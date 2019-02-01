import React from 'react'
import Head from 'next/head'
import { PageCentered } from '@react-frontend-developer/react-layout-helpers'

import { Secret } from './Secret'
import { Recipient } from './Recipient'
import { Encrypting } from './Encrypting'

// const SecretOrRecipient = ({ secret, recipient, telepathChannel, invite, onSecret, onRecipient, onDone }) => {
//   if (secret === '') {
//     return (
//       <Secret onSubmit={onSecret} />
//     )
//   } else if (recipient === '') {
//     return (
//       <Recipient onSubmit={onRecipient} />
//     )
//   } else {
//     return (
//       <Encrypting secret={secret}
//         recipient={recipient}
//         telepathChannel={telepathChannel}
//         invite={invite}
//         onDone={onDone} />
//     )
//   }
// }

const SecretOrRecipient = ({ secret, recipient, telepathChannel, invite, onSecret, onRecipient, onDone }) => {
  if (recipient === '') {
    return (
      <Recipient onSubmit={onRecipient} />
    )
  } else if (!invite && secret === '') {
    return (
      <Secret onSubmit={onSecret} />
    )
  } else {
    return (
      <Encrypting secret={secret}
        recipient={recipient}
        telepathChannel={telepathChannel}
        invite={invite}
        onDone={onDone} />
    )
  }
}

class Sender extends React.Component {
  initialState = {
    secret: '',
    recipient: ''
  }

  constructor () {
    super()
    this.state = this.initialState
  }

  onSecret = secret => {
    console.log('got your secret:', secret)
    this.setState({ secret })
  }

  onRecipient = (recipient, telepathChannel, invite) => {
    console.log('got your recipient:', recipient)
    this.setState({ recipient, telepathChannel, invite })
  }

  onDone = () => {
    this.setState(this.initialState)
  }

  render () {
    return (
      <PageCentered css={{ color: 'white' }}>
        <Head>
          <title>Hush Hush</title>
          <link href='https://fonts.googleapis.com/css?family=Roboto+Mono' rel='stylesheet' />
        </Head>
        <SecretOrRecipient secret={this.state.secret}
          recipient={this.state.recipient}
          telepathChannel={this.state.telepathChannel}
          invite={this.state.invite}
          onSecret={this.onSecret}
          onRecipient={this.onRecipient}
          onDone={this.onDone} />
      </PageCentered>
    )
  }
}

export { Sender }
