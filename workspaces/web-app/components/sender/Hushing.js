import React from 'react'
import { Encryptor } from '../crypto'
import { FadingValueBox } from '../animations'
import { Button } from 'semantic-ui-react'
import { Textarea } from '../forms'
import { Red, Green, Blue } from '../ui'
import base64url from 'base64url'

class Hushing extends React.Component {
  state = {
    status: '',
    done: false,
    copied: false,
    inProgress: true
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

  encrypt = async () => {
    try {
      const {
        telepathChannel,
        secret,
        recipient,
        senderTag,
        recipientPublicKey,
        recipientTag
      } = this.props
      await Encryptor.encrypt({
        telepathChannel,
        secret,
        recipient,
        senderTag,
        recipientPublicKey,
        recipientTag,
        onStatusChanged: this.onStatusChanged
      })
      console.log('Encryptor.encrypt finsihed!!!')
      this.setState({
        done: true,
        status: `https://hush-hush.now.sh/secret#${base64url.encode(recipientTag)}`
      })
      this.setHeight()
      console.log('Encryptor.encrypt:', this.state.done, this.state.status)
    } catch (e) {
      console.error(e)
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
    this.encrypt()
  }

  render () {
    if (this.state.done) {
      return (
        <FadingValueBox>
          <div css={{ display: 'flex', width: '100%', flexFlow: 'column nowrap', alignItems: 'center' }}>
            <div css={{ width: '100%', textAlign: 'center' }}>
              Your secret is ready to be shared with your hush budy.
            </div>
            <div css={{ width: '100%', textAlign: 'center', margin: '20px 0 20px 0' }}>
              Copy it, paste to your favorite email client and send it to the recipient.
            </div>
            <div css={{ width: '100%', textAlign: 'center', marginBottom: '50px' }}>
              BTW: you can share this link anyway you like. It is safe.
              Only your intended hush budy will be able to decrypt the secret.
              And that's gorgeous. Isn't it?
            </div>
            <Textarea id='secret-link' ref={this.secretField} css={{ height: 'auto' }} readOnly value={this.state.status} />
            <div css={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', width: '100%' }}>
              <Button primary onClick={this.onCopy}>{this.state.copied ? 'Copied' : 'Copy to clipboard...'}</Button>
            </div>
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

export { Hushing }
