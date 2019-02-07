import React from 'react'

import { NoSecret } from './NoSecret'
import { ProcessSecret } from './ProcessSecret'

class RecipientHush extends React.Component {
  state = {
    tagOk: false
  }

  componentDidMount () {
    if (window.location.hash) {
      const senderTagBase64 = window.location.hash.substring(1)
      console.log(senderTagBase64)
      this.setState({ senderTagBase64, tagOk: true })
    }
  }

  render () {
    if (!this.state.tagOk) {
      return (
        <NoSecret />
      )
    }
    return (
      <ProcessSecret senderTagBase64={this.state.senderTagBase64} />
    )
  }
}

export { RecipientHush }
