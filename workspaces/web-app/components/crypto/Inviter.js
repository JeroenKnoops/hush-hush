import base64url from 'base64url'
import { Buffers } from '@react-frontend-developer/buffers'
import { CogitoEncryption, CogitoKeyProvider } from '@cogitojs/cogito-encryption'
import { decrypt } from '@cogitojs/crypto'
import { IdentityFetcher } from '../identity'

const getCurrentlySignedUser = () => {
  const user = firebase.auth().currentUser
  if (user) {
    return user.uid
  } else {
    return null
  }
}

const read = async tag => {
  const uid = getCurrentlySignedUser()
  if (uid) {
    const db = firebase.firestore()
    const doc = await db.collection('users').doc(uid).get()
    const sender = doc.data()[tag].sender
    console.log('sender=', sender)
    if (sender && sender.epub) {
      return sender.epub
    }
    throw new Error('No sender encrypted public key found for this invitation!')
  } else {
    throw new Error('Having trouble accesing Firebase. Please try again...')
  }
}

const store = async ({
  senderTag,
  recipientTag,
  encryptedRecipientPublicKey
}) => {
  const uid = getCurrentlySignedUser()
  if (uid) {
    console.log('uid=', uid)
    console.log('senderTag=', senderTag)
    console.log('recipientTag=', recipientTag)
    console.log('encryptedRecipientPublicKey=', encryptedRecipientPublicKey)
    const db = firebase.firestore()
    const ref = db.collection('users').doc(uid)
    const doc = await ref.get()
    const entry = doc.data()[senderTag]
    console.log('entry=', entry)
    await ref.update({
      [`${senderTag}`]: {
        ...entry,
        recipient: {
          tag: recipientTag,
          epub: encryptedRecipientPublicKey
        }
      }
    })
  }
}

const validateInvitationComponents = ({ tagBase64, keyBase64, nonceBase64 }) => {
  if (!tagBase64 || tagBase64.length === 0) {
    throw new Error('No tag component in the invitation!')
  }
  if (!keyBase64 || keyBase64.length === 0) {
    throw new Error('Missing symmetric key component in the invitation!')
  }
  if (!nonceBase64 || nonceBase64.length === 0) {
    throw new Error('Missing nonce component in the invitation!')
  }
}

const decodeInvitationComponents = ({ tagBase64, keyBase64, nonceBase64 }) => {
  return {
    tag: base64url.decode(tagBase64),
    symmetricKey: Buffers.copyToUint8Array(base64url.toBuffer(keyBase64)),
    nonce: Buffers.copyToUint8Array(base64url.toBuffer(nonceBase64))
  }
}

const getPublicKey = (telepathChannel, onStatusChanged = () => {}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const identityInfo = await IdentityFetcher.get(telepathChannel)
      console.log('identityInfo=', identityInfo)
      onStatusChanged('Accepting invitation as ', `[blue]${identityInfo.username}`)
      setTimeout(() => {
        onStatusChanged('with id ', `[blue]${identityInfo.ethereumAddress}`)
        setTimeout(async () => {
          onStatusChanged('creating a new key pair and retrieving corresponding ', '[green]public key')
          const cogitoKeyProvider = new CogitoKeyProvider({ telepathChannel })
          const tag = await cogitoKeyProvider.createNewKeyPair()
          const jsonWebKey = await cogitoKeyProvider.getPublicKey({ tag })
          resolve({ tag, jsonWebKey })
        }, 3000)
      }, 3000)
    } catch (e) {
      console.error(e)
      reject(e)
    }
  })
}

class Inviter {
  static check = invitation => {
    const [tagBase64, keyBase64, nonceBase64] = invitation.split('.')
    validateInvitationComponents({
      tagBase64,
      keyBase64,
      nonceBase64
    })

    return decodeInvitationComponents({
      tagBase64,
      keyBase64,
      nonceBase64
    })
  }

  static accept = ({
    tag: senderTag,
    symmetricKey,
    nonce,
    telepathChannel,
    onStatusChanged
  }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const encryptedSenderPublickKey = await read(senderTag)
        console.log('encryptedSenderPublickKey=', encryptedSenderPublickKey)
        const decryptedSenderPublicKey = JSON.parse(await decrypt(base64url.toBuffer(encryptedSenderPublickKey), nonce, symmetricKey, 'text'))
        console.log('decryptedSenderPublicKey=', decryptedSenderPublicKey)
        const { tag: recipientTag, jsonWebKey: recipientPublicKey } = await getPublicKey(telepathChannel, onStatusChanged)
        console.log('recipientPublicKey=', recipientPublicKey)
        setTimeout(async () => {
          try {
            onStatusChanged('encrypting ', '[green]your public key ', 'with ', "[blue]sender's public key")
            const cogitoEncryption = new CogitoEncryption({ telepathChannel })
            const encryptedRecipientPublicKey = await cogitoEncryption.encrypt({
              jsonWebKey: decryptedSenderPublicKey,
              plainText: JSON.stringify(recipientPublicKey)
            })
            console.log('encryptedRecipientPublicKey=', encryptedRecipientPublicKey)
            setTimeout(async () => {
              try {
                onStatusChanged('sharing your ', '[blue]encrypted ', 'public key with the sender')
                await store({
                  senderTag,
                  recipientTag,
                  encryptedRecipientPublicKey
                })
                setTimeout(() => {
                  onStatusChanged('[green]Wow! ', 'All hushed ;)')
                  setTimeout(() => {
                    resolve()
                  }, 2000)
                }, 3000)
              } catch (e) {
                console.error('e1')
                console.error(e)
                reject(e)
              }
            }, 3000)
          } catch (e) {
            console.error(e)
            reject(e)
          }
        }, 2000)
      } catch (e) {
        console.error('Here')
        console.error(e)
        reject(e)
      }
    })
  }
}

export { Inviter }
