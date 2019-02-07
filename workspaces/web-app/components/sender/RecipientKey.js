import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'

import { FadingValueBox } from '../animations'
import { Red, Green, Blue } from '../ui'

import { Encryptor } from '../crypto'
import { CogitoGarbageBin } from '../cogito-garbage-bin'
import base64url from 'base64url'

class RecipientKey extends Component {
  state = {
    inProgress: true,
    decryptRecipientPubKey: false
  }

  log = (...args) => {
    const status = args.map((a, i) => {
      if (a.startsWith('[green]')) {
        return <Green key={i}>{a.slice('[green]'.length)}</Green>
      } if (a.startsWith('[blue]')) {
        return <Blue key={i}>{a.slice('[blue]'.length)}</Blue>
      } if (a.startsWith('[red]')) {
        return <Red key={i}>{a.slice('[red]'.length)}</Red>
      } else {
        return a
      }
    })
    this.setState({ status })
  }

  onStatusChanged = (...args) => {
    this.log(...args)
  }

  onDone = recipientPublicKey => {
    this.props.onDone && this.props.onDone(recipientPublicKey)
  }

  getRecipientPublicKey = async ({
    telepathChannel,
    senderTag
  }) => {
    try {
      this.log('Searching for recipient public key in the bin...')
      const garbageBin = new CogitoGarbageBin({ telepathChannel })
      const recipientPublicKeyBase64 = await garbageBin.get({
        key: senderTag
      })
      setTimeout(() => {
        if (recipientPublicKeyBase64) {
          try {
            const recipientPublicKeyJson = base64url.decode(recipientPublicKeyBase64)
            const recipientPublicKey = JSON.parse(recipientPublicKeyJson)
            console.log('recipientPublicKey=', recipientPublicKey)
            this.log('Found recipient key. ', '[green]Good to go!')
            setTimeout(() => {
              this.onDone(recipientPublicKey)
            }, 2000)
          } catch (e) {
            console.error(e)
            this.log('[red]Hush! ', e.message)
          }
        } else {
          this.setState({
            inProgress: false,
            decryptRecipientPubKey: true
          })
        }
      }, 2000)
    } catch (e) {
      console.error(e)
      this.log('[red]Hush! ', e.message)
    }
  }

  onDecrypt = async () => {
    const {
      telepathChannel,
      senderTag,
      recipientEncryptedPublicKey
    } = this.props
    this.setState({
      status: '',
      decryptRecipientPubKey: false,
      inProgress: true
    })
    const recipientPublicKey = await Encryptor.decryptRecipientPublicKey({
      telepathChannel,
      senderTag,
      recipientEncryptedPublicKey,
      onStatusChanged: this.onStatusChanged
    })
    this.onDone(recipientPublicKey)
  }

  componentDidMount () {
    const {
      telepathChannel,
      senderTag
    } = this.props
    this.getRecipientPublicKey({
      telepathChannel,
      senderTag
    })
  }

  render () {
    if (this.state.decryptRecipientPubKey) {
      const { recipient } = this.props
      return (
        <FadingValueBox>
          <div css={{ display: 'flex', width: '100%', flexFlow: 'column nowrap', alignItems: 'center' }}>
            <div css={{ width: '100%', textAlign: 'center' }}>
              Looks like this is the first time you send a secret to <Blue>{recipient}</Blue>.
            </div>
            <div css={{ width: '100%', textAlign: 'center', margin: '20px 0 20px 0' }}>
              So far, we only have an encrypted public key of the recipient. A good thing is
              that it is encrypted with a public key that you own (one that is associated with
              the identity you used when inviting your hush budy), which means we can decrypt it.
            </div>
            <div css={{ width: '100%', textAlign: 'center', margin: '20px 0 20px 0' }}>
              We only need this step once. We will record the public key of the recipient safely
              on your mobile and we will use it for the future exchanges with this specific hush buddy.
            </div>
            <div css={{ width: '100%', textAlign: 'center', margin: '20px 0 20px 0' }}>
              After clicking <Blue>Decrypt</Blue> button, please use your mobile to allow decryption. It does not matter which identity you
              use for this because we keep a handle of the key that is needed.
            </div>
            <Button primary onClick={this.onDecrypt}>Decrypt...</Button>
          </div>
        </FadingValueBox>
      )
    }
    if (this.state.inProgress) {
      return (
        <FadingValueBox trigger={this.state.status}>
          {!this.state.done && <div css={{ width: '100%', textAlign: 'center', wordBreak: 'break-word' }}>
            {this.state.status}
          </div>}
        </FadingValueBox>
      )
    }
    return null
  }
}

export { RecipientKey }
