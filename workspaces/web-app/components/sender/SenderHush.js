import React from 'react'
import { Secret } from './Secret'
import { Recipient } from './Recipient'
import { Invite } from './Invite'
import { Inviting } from './Inviting'
import { Hushing } from './Hushing'

const Stages = Object.freeze({
  Recipient: Symbol('gettingRecipient'),
  Invite: Symbol('inviteRecipient'),
  Inviting: Symbol('invitingProgress'),
  Secret: Symbol('gettingSecret'),
  Hush: Symbol('hushing')
})

class SenderHush extends React.Component {
  state = {
    workflow: Stages.Recipient
  }

  knownRecipient = (recipient, telepathChannel) => {
    return false
  }

  onRecipientReady = (recipient, telepathChannel) => {
    console.log('got your recipient:', recipient)
    if (this.knownRecipient()) {
      this.setState({ workflow: Stages.Secret, recipient, telepathChannel })
    } else {
      this.setState({ workflow: Stages.Invite, recipient, telepathChannel })
    }
  }

  onSecretReady = secret => {
    console.log('got your secret:', secret)
    this.setState({ workflow: Stages.Hush, secret })
  }

  onInvite = () => {
    this.setState({ workflow: Stages.Inviting })
  }

  onDone = () => {
    this.setState({ workflow: Stages.Recipient })
  }

  renderRecipient = () => {
    return (
      <Recipient onSubmit={this.onRecipientReady} />
    )
  }

  renderSecret = () => {
    return (
      <Secret onSubmit={this.onSecretReady} />
    )
  }

  renderInviting = () => {
    const { recipient, telepathChannel } = this.state
    return (
      <Inviting recipient={recipient}
        telepathChannel={telepathChannel}
        onDone={this.onDone} />
    )
  }

  renderInvite = () => {
    const { recipient, telepathChannel } = this.state
    return (
      <Invite recipient={recipient}
        telepathChannel={telepathChannel}
        onInvite={this.onInvite}
        onCancel={this.onDone} />
    )
  }

  renderHush = () => {
    const { secret, recipient, telepathChannel } = this.state
    return (
      <Hushing secret={secret}
        recipient={recipient}
        telepathChannel={telepathChannel}
        onDone={this.onDone} />
    )
  }

  render () {
    switch (this.state.workflow) {
      case Stages.Recipient:
        return this.renderRecipient()
      case Stages.Secret:
        return this.renderSecret()
      case Stages.Invite:
        return this.renderInvite()
      case Stages.Inviting:
        return this.renderInviting()
      case Stages.Hush:
        return this.renderHush()
      default:
        return null
    }
  }
}

export { SenderHush }
