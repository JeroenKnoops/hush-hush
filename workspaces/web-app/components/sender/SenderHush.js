import React from 'react'
import base64url from 'base64url'
import { Secret } from './Secret'
import { Recipient } from './Recipient'
import { Invite } from './Invite'
import { Inviting } from './Inviting'
import { Pending } from './Pending'
import { Hushing } from './Hushing'
import { CogitoGarbageBin } from '../cogito-garbage-bin'

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
    const recipient = doc.data()[tag].recipient
    console.log('recipient=', recipient)
    if (recipient) {
      return {
        epub: recipient.epub,
        tag: recipient.tag
      }
    } else {
      return {}
    }
  } else {
    throw new Error('Having trouble accesing Firebase. Please try again...')
  }
}

const Stages = Object.freeze({
  Recipient: Symbol('gettingRecipient'),
  Invite: Symbol('inviteRecipient'),
  Inviting: Symbol('invitingProgress'),
  Pending: Symbol('invitationPending'),
  Secret: Symbol('gettingSecret'),
  Hush: Symbol('hushing')
})

class SenderHush extends React.Component {
  state = {
    workflow: Stages.Recipient
  }

  knownRecipient = async (recipient, telepathChannel) => {
    try {
      const garbageBin = new CogitoGarbageBin({ telepathChannel })
      const tag = await garbageBin.get({
        key: base64url.encode(recipient)
      })
      if (!tag || tag.length === 0) {
        return undefined
      }
      return tag
    } catch (e) {
      console.error(e)
      return undefined
    }
  }

  onRecipientReady = async (recipient, telepathChannel) => {
    console.log('got your recipient:', recipient)
    const senderTag = await this.knownRecipient(recipient, telepathChannel)
    console.log('tag [iOS]:', senderTag)
    if (senderTag) {
      const { epub: recipientEncryptedPublicKey, tag: recipientTag } = await read(senderTag)
      if (recipientEncryptedPublicKey && recipientTag) {
        this.setState({ workflow: Stages.Secret, recipient, telepathChannel, senderTag, recipientEncryptedPublicKey, recipientTag })
      } else {
        console.log('recipient=', recipient)
        this.setState({ workflow: Stages.Pending, recipient })
      }
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
    this.setState({
      workflow: Stages.Recipient,
      secret: undefined,
      recipient: undefined,
      telepathChannel: undefined,
      senderTag: undefined,
      recipientEncryptedPublicKey: undefined,
      recipientTag: undefined
    })
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

  renderPending = () => {
    const { recipient } = this.state
    return (
      <Pending recipient={recipient} onDone={this.onDone} />
    )
  }

  renderHush = () => {
    const {
      secret,
      recipient,
      telepathChannel,
      senderTag,
      recipientEncryptedPublicKey,
      recipientTag
    } = this.state
    return (
      <Hushing secret={secret}
        recipient={recipient}
        telepathChannel={telepathChannel}
        senderTag={senderTag}
        recipientEncryptedPublicKey={recipientEncryptedPublicKey}
        recipientTag={recipientTag}
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
      case Stages.Pending:
        return this.renderPending()
      case Stages.Hush:
        return this.renderHush()
      default:
        return null
    }
  }
}

export { SenderHush }
