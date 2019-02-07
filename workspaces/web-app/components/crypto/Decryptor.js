import { CogitoEncryption } from '@cogitojs/cogito-encryption'
import base64url from 'base64url'

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
    const senderTag = doc.get(tag)
    if (!senderTag) {
      throw new Error('no sender tag found in the store!')
    }
    if (!senderTag.recipient) {
      throw new Error('no recipient record found for the given tag!')
    }
    const { encryptedSecret, tag: recipientTag } = senderTag.recipient
    if (!encryptedSecret) {
      throw new Error('no encrypted secret found for the given tag!')
    }
    if (!recipientTag) {
      throw new Error('no recipient tag found for the given sender tag!')
    }
    return { encryptedSecret, recipientTag }
  } else {
    throw new Error('Having trouble accesing Firebase. Please try again...')
  }
}

class Decryptor {
  static getEncryptedSecret = async ({
    telepathChannel,
    senderTagBase64,
    onStatusChanged = () => {}
  }) => {
    return new Promise((resolve, reject) => {
      try {
        onStatusChanged('extracting sender tag from the link')
        const senderTag = base64url.decode(senderTagBase64)
        setTimeout(async () => {
          try {
            onStatusChanged('[green]Extracted.', ' Trying to read encrypted secret from the cloud...')
            const { encryptedSecret, recipientTag } = await read(senderTag)
            setTimeout(() => {
              onStatusChanged('[green]Success!', ' Ready to decrypt!')
              resolve({ encryptedSecret, recipientTag })
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

  static decrypt = async ({
    telepathChannel,
    recipientTag,
    encryptedSecret,
    onStatusChanged = () => {}
  }) => {
    return new Promise(async (resolve, reject) => {
      try {
        onStatusChanged('[green]check your mobile app now')
        try {
          const cogitoEncryption = new CogitoEncryption({ telepathChannel })
          const decryptedSecret = await cogitoEncryption.decrypt({
            tag: recipientTag,
            encryptionData: encryptedSecret
          })
          resolve(decryptedSecret)
        } catch (e) {
          console.error(e)
          reject(e)
        }
      } catch (e) {
        console.error(e)
        reject(e)
      }
    })
  }
}

export { Decryptor }
