import React from 'react'
import Head from 'next/head'
import { PageCentered } from '@react-frontend-developer/react-layout-helpers'

import { Sender } from '../components/sender'

const Index = () => (
  <PageCentered css={{ color: 'white' }}>
    <Head>
      <title>Hush Hush</title>
      <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' />
      <link href='https://fonts.googleapis.com/css?family=Roboto+Mono' rel='stylesheet' />
      <script src='https://www.gstatic.com/firebasejs/5.8.2/firebase-app.js' />
      <script src='https://www.gstatic.com/firebasejs/5.8.2/firebase-auth.js' />
      <script src='https://www.gstatic.com/firebasejs/5.8.2/firebase-firestore.js' />
    </Head>
    <div css={{ display: 'flex', flexFlow: 'column nowrap', alignItems: 'center', minHeight: '150px', maxWidth: '550px', width: '85%' }}>
      <Sender />
    </div>
  </PageCentered>
)

export default Index
