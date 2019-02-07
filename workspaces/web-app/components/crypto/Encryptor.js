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

const store = async (obj) => {
  const uid = getCurrentlySignedUser()
  if (uid) {
    console.log('uid=', uid)
    const db = firebase.firestore()
    const doc = await db.collection('users').doc(uid).get()
    console.log('doc=', doc.data())
    db.collection('users').doc(uid).set(obj, { merge: true })
  } else {
    throw new Error('Having trouble accesing Firebase. Please try again...')
  }
}

const storeSecret = async ({
  senderTag,
  encryptedSecret
}) => {
  const uid = getCurrentlySignedUser()
  if (uid) {
    console.log('uid=', uid)
    console.log('senderTag=', senderTag)
    console.log('encryptedSecret=', encryptedSecret)
    const db = firebase.firestore()
    const ref = db.collection('users').doc(uid)
    await ref.update({
      [`${senderTag}.recipient.encryptedSecret`]: encryptedSecret
    })
    console.log('wrote encrypted secret to database')
  } else {
    throw new Error('Having trouble accesing Firebase. Please try again...')
  }
}

class Encryptor {
  static decryptRecipientPublicKey = async ({
    telepathChannel,
    senderTag,
    recipientEncryptedPublicKey,
    onStatusChanged = () => {}
  }) => {
    return new Promise((resolve, reject) => {
      try {
        onStatusChanged('decrypting recipient public key')
        setTimeout(async () => {
          try {
            onStatusChanged('[green]check your mobile app now')
            const cogitoEncryption = new CogitoEncryption({ telepathChannel })
            const recipientPublicKeyText = await cogitoEncryption.decrypt({
              tag: senderTag,
              encryptionData: recipientEncryptedPublicKey
            })
            const recipientPublicKey = JSON.parse(recipientPublicKeyText)
            console.log('recipientPublicKey=', recipientPublicKey)
            setTimeout(async () => {
              onStatusChanged('[green]Success!', ' We have the key. Now writing it down to your mobile.')
              try {
                const garbageBin = new CogitoGarbageBin({ telepathChannel })
                await garbageBin.store({
                  key: senderTag,
                  value: base64url.encode(JSON.stringify(recipientPublicKey))
                })
                resolve(recipientPublicKey)
              } catch (e) {
                console.error(e)
                reject(e)
              }
            }, 2000)
          } catch (e) {
            console.error(e)
            reject(e)
          }
        }, 2000)
      } catch (e) {
        console.error(e)
        reject(e)
      }
    })
  }

  static encrypt = async ({
    telepathChannel,
    secret,
    recipient,
    senderTag,
    recipientPublicKey,
    recipientTag,
    onStatusChanged = () => {}
  }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const cogitoEncryption = new CogitoEncryption({ telepathChannel })
        console.log('recipientPublicKey=', recipientPublicKey)
        const encryptedSecret = await cogitoEncryption.encrypt({
          jsonWebKey: recipientPublicKey,
          plainText: secret
        })
        await storeSecret({
          senderTag,
          encryptedSecret
        })
        resolve()
      } catch (e) {
        console.error(e)
        reject(e)
      }
    })
  }

  static invite = ({ telepathChannel, recipient, onStatusChanged = () => {} }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const cogitoKeyProvider = new CogitoKeyProvider({ telepathChannel })
        const tag = await cogitoKeyProvider.createNewKeyPair()
        const jsonWebKey = await cogitoKeyProvider.getPublicKey({ tag })

        console.log('jsonWebKey=', jsonWebKey)

        const symmetricKey = await createRandomKey()
        console.log('symmetricKey=', symmetricKey.toString('hex'))
        console.log('symmetricKey=', base64url.toBuffer(base64url.encode(symmetricKey)).toString('hex'))
        // const symmetricKeyText = symmetricKey.toString('hex')
        const nonce = await random(await nonceSize())
        console.log('nonce=', nonce.toString('hex'))
        console.log('nonce=', base64url.toBuffer(base64url.encode(nonce)).toString('hex'))
        const encryptedSenderPublicKey = await encrypt(JSON.stringify(jsonWebKey), nonce, symmetricKey)

        const garbageBin = new CogitoGarbageBin({ telepathChannel })
        const uid = getCurrentlySignedUser()
        if (uid) {
          onStatusChanged('recording recipient address and tag in ', '[blue]Cogito iOS app')
          await garbageBin.store({
            key: base64url.encode(recipient),
            value: tag
          })
          setTimeout(async () => {
            try {
              onStatusChanged('writing ', '[blue]encrypted sender public key ', 'in Firebase')
              await store({
                [`${tag}`]: {
                  sender: {
                    epub: base64url.encode(encryptedSenderPublicKey)
                  }
                }
              })
              resolve(`https://hush-hush.now.sh/invite#${base64url.encode(tag)}.${base64url.encode(symmetricKey)}.${base64url.encode(nonce)}`)
            } catch (e) {
              reject(e)
            }
          }, 2000)
        }
      } catch (e) {
        reject(e)
      }
    })
  }
}

export { Encryptor }
