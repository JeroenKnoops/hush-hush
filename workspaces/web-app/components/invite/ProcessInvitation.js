import React from 'react'
import Link from 'next/link'
import { Inviter } from '../crypto'
import { Connector } from '../identity'
import { FadingValueBox } from '../animations'
import { Button } from 'semantic-ui-react'

import { Red, Green, Blue } from '../ui'

class ProcessInvitation extends React.Component {
  state = {
    status: 'checking your invitation...',
    inProgress: true,
    invitationOk: false,
    invitationAccepted: false
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

  checkInvitation = async () => {
    console.log(this.props.invitation)
    try {
      const { tag, symmetricKey, nonce } = Inviter.check(this.props.invitation)
      setTimeout(() => {
        this.setState({
          tag,
          symmetricKey,
          nonce,
          invitationOk: true,
          inProgress: false
        })
        // this.log('invitation looks ', '[green]good')
      }, 3000)
    } catch (e) {
      this.setState({ inProgress: true, status: e.message })
    }
  }

  accept = async telepathChannel => {
    try {
      this.setState({
        inProgress: true
      })
      this.log('accepting invitation...')
      const { tag, symmetricKey, nonce } = this.state
      await Inviter.accept({
        tag,
        symmetricKey,
        nonce,
        telepathChannel,
        onStatusChanged: this.onStatusChanged
      })
      setTimeout(() => {
        this.setState({
          inProgress: false,
          invitationAccepted: true
        })
      }, 2000)
    } catch (e) {
      this.setState({ inProgress: true, status: e.message })
    }
  }

  componentDidMount () {
    this.checkInvitation()
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
    if (this.state.invitationAccepted) {
      return (
        <FadingValueBox>
          <div css={{ display: 'flex', width: '100%', flexFlow: 'column nowrap', alignItems: 'center' }}>
            <div css={{ width: '100%', textAlign: 'center' }}>
              You <Green>accepted</Green> the invitation!
            </div>
            <div css={{ width: '100%', textAlign: 'center', margin: '20px 0 20px 0' }}>
              Now the sender can start hushing with you. Maybe it is worth to remind him?
            </div>
            <Link href={{ pathname: '/' }}>
              <Button primary>Done</Button>
            </Link>
          </div>
        </FadingValueBox>
      )
    }
    if (this.state.invitationOk) {
      return (
        <FadingValueBox>
          <div css={{ display: 'flex', width: '100%', flexFlow: 'column nowrap', alignItems: 'center' }}>
            <div css={{ width: '100%', textAlign: 'center' }}>
              Invitation looks <Green>good!</Green>
            </div>
            <div css={{ width: '100%', textAlign: 'center', margin: '20px 0 20px 0' }}>
              Do you want to accept it?
            </div>
            <div css={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', width: '100%' }}>
              <Connector onDone={this.accept}
                title='Accept...' />
              <Link href={{ pathname: '/' }}>
                <Button>Maybe later...</Button>
              </Link>
            </div>
          </div>
        </FadingValueBox>
      )
    }
    return null
  }
}

export { ProcessInvitation }
