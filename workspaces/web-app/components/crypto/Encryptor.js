import { CogitoEncryption, CogitoKeyProvider } from '@cogitojs/cogito-encryption'
import base64url from 'base64url'
import {
  random,
  keySize,
  nonceSize,
  encrypt
} from '@cogitojs/crypto'

const createRandomKey = async () => {
  return random(await keySize())
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
