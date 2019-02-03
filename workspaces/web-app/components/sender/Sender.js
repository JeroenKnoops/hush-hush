import React from 'react'
import Head from 'next/head'
import { PageCentered } from '@react-frontend-developer/react-layout-helpers'

import { Secret } from './Secret'
import { Recipient } from './Recipient'
import { Encrypting } from './Encrypting'

const SecretOrRecipient = ({
  secret,
  recipient,
  telepathChannel,
  invite,
  onSecretReady,
  onRecipientReady,
  onDone }) => {
  if (recipient === '') {
    return (
      <Recipient onSubmit={onRecipientReady} />
    )
  } else if (!invite && secret === '') {
    return (
      <Secret onSubmit={onSecretReady} />
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

  onSecretReady = secret => {
    console.log('got your secret:', secret)
    this.setState({ secret })
  }

  onRecipientReady = (recipient, telepathChannel, invite) => {
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
          <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' />
          <link href='https://fonts.googleapis.com/css?family=Roboto+Mono' rel='stylesheet' />
        </Head>
        <SecretOrRecipient {...this.state}
          onSecretReady={this.onSecretReady}
          onRecipientReady={this.onRecipientReady}
          onDone={this.onDone} />
      </PageCentered>
    )
  }
}

export { Sender }
