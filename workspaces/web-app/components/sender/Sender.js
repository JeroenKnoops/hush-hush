import React from 'react'
import Head from 'next/head'
import { PageCentered } from '@react-frontend-developer/react-layout-helpers'

import { Secret } from './Secret'

class Sender extends React.Component {
  state = {
    secret: ''
  }

  onSecret = secret => {
    console.log('secret:', secret)
    this.setState({ secret })
  }

  render () {
    return (
      <PageCentered css={{ color: 'white' }}>
        <Head>
          <title>Hush Hush</title>
          <link href='https://fonts.googleapis.com/css?family=Roboto+Mono' rel='stylesheet' />
        </Head>
        <Secret onSubmit={this.onSecret} />
      </PageCentered>
    )
  }
}

export { Sender }
