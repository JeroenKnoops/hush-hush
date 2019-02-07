import React from 'react'
import Link from 'next/link'
import { Textarea } from '../forms'
import { Decryptor } from '../crypto'
import { Connector } from '../identity'
import { FadingValueBox } from '../animations'
import { Button } from 'semantic-ui-react'

import { Red, Green, Blue } from '../ui'

class ProcessSecret extends React.Component {
  state = {
    status: 'validating the link',
    inProgress: true,
    secretOk: false,
    secretReallyOk: false,
    secretDecrypted: false
  }

  constructor () {
    super()
    this.secretField = React.createRef()
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

  checkSecretLink = async () => {
    const { telepathChannel, senderTagBase64 } = this.props
    console.log(senderTagBase64)
    try {
      const { encryptedSecret, recipientTag } = await Decryptor.getEncryptedSecret({
        telepathChannel,
        senderTagBase64,
        onStatusChanged: this.onStatusChanged
      })
      setTimeout(() => {
        this.setState({
          encryptedSecret,
          recipientTag,
          secretOk: true,
          inProgress: false
        })
      }, 3000)
    } catch (e) {
      this.setState({ inProgress: true })
      this.log('[red]Hush! ', e.message)
    }
  }

  makeSure = () => {
    this.setState({
      secretOk: false,
      secretReallyOk: true
    })
  }

  decrypt = async telepathChannel => {
    console.log('decrypting...')
    this.setState({
      secretReallyOk: false,
      inProgress: true
    })
    const { encryptedSecret, recipientTag } = this.state
    try {
      const decryptedSecret = await Decryptor.decrypt({
        telepathChannel,
        recipientTag,
        encryptedSecret,
        onStatusChanged: this.onStatusChanged
      })
      setTimeout(() => {
        this.setState({
          decryptedSecret,
          secretReallyOk: false,
          secretDecrypted: true,
          inProgress: false
        })
        this.setHeight()
      }, 3000)
    } catch (e) {
      this.setState({ inProgress: true })
      this.log('[red]Hush! ', e.message)
    }
  }

  isOS = () => {
    return navigator.userAgent.match(/ipad|iphone/i)
  }

  clearSelection = () => {
    if (window.getSelection) {
      if (window.getSelection().empty) { // Chrome
        window.getSelection().empty()
      } else if (window.getSelection().removeAllRanges) { // Firefox
        window.getSelection().removeAllRanges()
      }
    } else if (document.selection) { // IE?
      document.selection.empty()
    }
  }

  selectText = textarea => {
    let range
    let selection
    if (this.isOS()) {
      range = document.createRange()
      range.selectNodeContents(textarea)
      selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
      textarea.setSelectionRange(0, 999999)
    } else {
      textarea.select()
    }
  }

  onCopy = () => {
    const textarea = document.querySelector('#secret-link')
    this.selectText(textarea)
    document.execCommand('copy')
    this.clearSelection()
    this.setState({ copied: true })
  }

  setHeight = () => {
    const area = this.secretField.current
    area.style.height = `${Number.parseInt(area.scrollHeight, 10) + 10}px`
  }

  componentDidMount () {
    this.checkSecretLink()
  }

  render () {
    if (this.state.inProgress) {
      return (
        <FadingValueBox trigger={this.state.status}>
          <div css={{ width: '100%', textAlign: 'center', wordBreak: 'break-word' }}>
            {this.state.status}
          </div>
        </FadingValueBox>
      )
    }
    if (this.state.secretDecrypted) {
      return (
        <FadingValueBox trigger={this.state.secretOk}>
          <div css={{ display: 'flex', width: '100%', flexFlow: 'column nowrap', alignItems: 'center' }}>
            <div css={{ width: '100%', textAlign: 'center' }}>
              Here it is. Now, there is no way back :).
            </div>
            <div css={{ width: '100%', textAlign: 'center', margin: '20px 0 20px 0' }}>
              Thank you for trusting <Green>Hush Hush</Green> to hush your secrets!
            </div>
            <Textarea id='secret-link' ref={this.secretField} css={{ height: 'auto' }} readOnly value={this.state.decryptedSecret} />
            <div css={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', width: '100%' }}>
              <Button primary onClick={this.onCopy}>{this.state.copied ? 'Copied' : 'Copy to clipboard...'}</Button>
            </div>
          </div>
        </FadingValueBox>
      )
    }
    if (this.state.secretReallyOk) {
      return (
        <FadingValueBox trigger={this.state.secretOk}>
          <div css={{ display: 'flex', width: '100%', flexFlow: 'column nowrap', alignItems: 'center' }}>
            <div css={{ width: '100%', textAlign: 'center', margin: '20px 0 20px 0' }}>
              Are you sure? What was seen cannot be unseen...
            </div>
            <div css={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', width: '100%' }}>
              <Connector onDone={this.decrypt}
                title='Yes, show me!' />
              <Link href={{ pathname: '/' }}>
                <Button>Maybe later then...</Button>
              </Link>
            </div>
          </div>
        </FadingValueBox>
      )
    }
    if (this.state.secretOk) {
      return (
        <FadingValueBox trigger={this.state.secretOk}>
          <div css={{ display: 'flex', width: '100%', flexFlow: 'column nowrap', alignItems: 'center' }}>
            <div css={{ width: '100%', textAlign: 'center' }}>
              <Green>Good!</Green> We have the encrypted secret!
            </div>
            <div css={{ width: '100%', textAlign: 'center', margin: '20px 0 20px 0' }}>
              Do you want to decrypt the secret now?
            </div>
            <div css={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', width: '100%' }}>
              <Button primary onClick={this.makeSure}>Yes, give it to me!</Button>
              <Link href={{ pathname: '/' }}>
                <Button>Not so curious...</Button>
              </Link>
            </div>
          </div>
        </FadingValueBox>
      )
    }
    return null
  }
}

export { ProcessSecret }
