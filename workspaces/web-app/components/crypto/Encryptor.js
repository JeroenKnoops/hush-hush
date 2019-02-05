// import firebase from 'firebase/app'
// import 'firebase/database'
// import 'firebase/auth'
import { CogitoEncryption, CogitoKeyProvider } from '@cogitojs/cogito-encryption'
import base64url from 'base64url'
import {
  random,
  keySize,
  nonceSize,
  encrypt
} from '@cogitojs/crypto'

import { CogitoGarbageBin } from '../cogito-garbage-bin'

const createRandomKey = async () => {
  return random(await keySize())
}

const getCurrentlySignedUser = () => {
  const user = firebase.auth().currentUser
  if (user) {
    return user.uid
  } else {
    return null
  }
}

// const store = async (tag, obj) => {
//   const uid = getCurrentlySignedUser()
//   if (uid) {
//     console.log('uid=', uid)
//     const usersRef = firebase.database().ref(`users/${uid}/${tag}`)
//     usersRef.set(obj)
//   }
// }

// const read = async () => {
//   const uid = getCurrentlySignedUser()
//   if (uid) {
//     const snap = await firebase.database().ref('/users/' + uid).once('value')
//     console.log('snap=', snap.val())
//   }
// }

const read = async () => {
  const uid = getCurrentlySignedUser()
  if (uid) {
    const db = firebase.firestore()
    const doc = await db.collection('users').doc(uid).get()
    console.log('doc=', doc.data())
  }
}

const store = async (obj) => {
  const uid = getCurrentlySignedUser()
  if (uid) {
    console.log('uid=', uid)
    const db = firebase.firestore()
    const doc = await db.collection('users').doc(uid).get()
    console.log('doc=', doc.data())
    db.collection('users').doc(uid).set(obj, { merge: true })
  }
}

class Encryptor {
  static encrypt = async ({ telepathChannel, plainText, recipient }) => {
    const cogitoEncryption = new CogitoEncryption({ telepathChannel })
    const cogitoKeyProvider = new CogitoKeyProvider({ telepathChannel })
    const tag = await cogitoKeyProvider.createNewKeyPair()
    const jsonWebKey = await cogitoKeyProvider.getPublicKey({ tag })
    const cipherText = await cogitoEncryption.encrypt({ jsonWebKey, plainText })
    const exchangeObject = {
      tag,
      cipherText,
      senderPublicKey: jsonWebKey
    }
    const serializedState = JSON.stringify(exchangeObject)
    localStorage.setItem(recipient, serializedState)
  }

  static invite = async ({ telepathChannel, recipient }) => {
    const cogitoEncryption = new CogitoEncryption({ telepathChannel })
    const cogitoKeyProvider = new CogitoKeyProvider({ telepathChannel })
    const tag = await cogitoKeyProvider.createNewKeyPair()
    const jsonWebKey = await cogitoKeyProvider.getPublicKey({ tag })

    const symmetricKey = await createRandomKey()
    const symmetricKeyText = symmetricKey.toString('hex')
    const nonce = await random(await nonceSize())
    const encryptedSenderPublicKey = await encrypt(JSON.stringify(jsonWebKey), nonce, symmetricKey)
    const encryptedSymmetricKey = await cogitoEncryption.encrypt({ jsonWebKey, plainText: symmetricKeyText })

    const garbageBin = new CogitoGarbageBin({ telepathChannel })
    try {
      const uid = getCurrentlySignedUser()
      if (uid) {
        await garbageBin.store({
          key: tag,
          value: base64url.encode(symmetricKeyText)
        })
        await garbageBin.store({
          key: base64url.encode(recipient),
          value: tag
        })
        // await store(tag, {
        //   sender: {
        //     epub: base64url.encode(encryptedSenderPublicKey)
        //   }
        // })
        // await read()
        await store({
          [`${tag}`]: {
            sender: {
              epub: base64url.encode(encryptedSenderPublicKey)
            }
          }
        })
        await read()
      }
    } catch (e) {
      console.error(e)
    }

    const exchangeObject = {
      senderTag: tag,
      encryptedSenderPublicKey: base64url.encode(encryptedSenderPublicKey),
      encryptedSymmetricKey,
      nonce: base64url.encode(nonce)
    }
    const serializedState = JSON.stringify(exchangeObject)
    localStorage.setItem(recipient, serializedState)
    return base64url.encode(symmetricKeyText)
  }
}

export { Encryptor }
