import React from 'react'
import { Encryptor } from '../crypto'
import { IdentityFetcher } from '../identity'
import { FadingValueBox } from '../animations'
import { Button } from 'semantic-ui-react'
import { Textarea } from '../forms'

class Encrypting extends React.Component {
  state = {
    status: 'getting to know your identity...',
    done: false,
    copied: false
  }

  log = message => {
    this.setState({ status: message })
  }

  inviteUser = async () => {
    const { recipient, telepathChannel } = this.props
    const identityInfo = await IdentityFetcher.get(telepathChannel)
    console.log('identityInfo=', identityInfo)
    this.log(`You are ${identityInfo.username}`)
    setTimeout(() => {
      this.log(`and your id is ${identityInfo.ethereumAddress}`)
      setTimeout(async () => {
        this.log(`creating invitation for ${recipient}`)
        const symmetricKey = await Encryptor.invite({
          telepathChannel,
          recipient
        })
        setTimeout(async () => {
          this.setState({ done: true, status: symmetricKey })
        }, 3000)
      }, 3000)
    }, 3000)
  }

  sendContent = async () => {
    const { secret, recipient, telepathChannel } = this.props
    const identityInfo = await IdentityFetcher.get(telepathChannel)
    console.log('identityInfo=', identityInfo)
    this.log(`You are ${identityInfo.username}`)
    setTimeout(() => {
      this.log(`and your id is ${identityInfo.ethereumAddress}`)
      setTimeout(async () => {
        this.log(`encrypting your secret...`)
        await Encryptor.encrypt({
          telepathChannel,
          plainText: secret,
          recipient
        })
        this.log(`all good`)
      }, 1000)
    }, 1000)
  }

  onCopy = () => {
    const copyText = document.querySelector('#invitation')
    copyText.select()
    document.execCommand('copy')
    if (window.getSelection) {
      if (window.getSelection().empty) { // Chrome
        window.getSelection().empty()
      } else if (window.getSelection().removeAllRanges) { // Firefox
        window.getSelection().removeAllRanges()
      }
    } else if (document.selection) { // IE?
      document.selection.empty()
    }
    this.setState({ copied: true })
  }

  async componentDidMount () {
    if (this.props.invite) {
      this.inviteUser()
    } else {
      this.sendContent()
    }
  }

  render () {
    return (
      <FadingValueBox trigger={this.state.status}>
        {!this.state.done && <div>
          {this.state.status}
        </div>}
        { this.state.done &&
          <div css={{ display: 'flex', flexFlow: 'column nowrap', alignItems: 'center' }}>
            <Textarea id='invitation' css={{ width: '400px', height: '200px' }} readOnly value={this.state.status} />
            <div css={{ marginTop: '1rem' }}>
              <Button primary onClick={this.onCopy}>{this.state.copied ? 'Copied' : 'Copy to clipboard...'}</Button>
            </div>
          </div>
        }
      </FadingValueBox>
    )
  }
}

export { Encrypting }
