import React from 'react'
import Head from 'next/head'
import { PageCentered } from '@react-frontend-developer/react-layout-helpers'

import { Secret } from './Secret'
import { Recipient } from './Recipient'

const SecretOrRecipient = ({ secret, onSecret, onRecipient }) => {
  if (secret === '') {
    return (
      <Secret onSubmit={onSecret} />
    )
  } else {
    return (
      <Recipient onSubmit={onRecipient} />
    )
  }
}

class Sender extends React.Component {
  state = {
    secret: '',
    recipient: ''
  }

  onSecret = secret => {
    console.log('got your secret:', secret)
    this.setState({ secret })
  }

  onRecipient = recipient => {
    console.log('got your recipient:', recipient)
    this.setState({ recipient })
  }

  render () {
    return (
      <PageCentered css={{ color: 'white' }}>
        <Head>
          <title>Hush Hush</title>
          <link href='https://fonts.googleapis.com/css?family=Roboto+Mono' rel='stylesheet' />
        </Head>
        <SecretOrRecipient secret={this.state.secret}
          onSecret={this.onSecret}
          onRecipient={this.onRecipient} />
      </PageCentered>
    )
  }
}

export { Sender }
