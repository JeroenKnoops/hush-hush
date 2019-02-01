import { CogitoEncryption, CogitoKeyProvider } from '@cogitojs/cogito-encryption'

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
}

export { Encryptor }
