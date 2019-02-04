import React, { Component } from 'react'
import { FadingValueBox } from '../animations'

import { Form, Input, Label } from '../forms'
import { Connector } from '../identity'

// From https://emailregex.com
const emailValidationRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

class Recipient extends Component {
  state = {
    recipient: '',
    known: false,
    unknown: false
  }

  constructor () {
    super()
    this.recipientField = React.createRef()
  }

  onChange = event => {
    const recipient = event.target.value
    this.setState({ recipient })
    if (this.validRecipient(recipient)) {
      if (localStorage.getItem(recipient)) {
        this.setState({ known: true, unknown: false })
      } else {
        this.setState({ unknown: true, known: false })
      }
    } else {
      this.setState({ unknown: false, known: false })
    }
  }

  onSubmit = event => {
    event.preventDefault()
  }

  onDone = (telepathChannel, invite) => {
    this.props.onSubmit && this.props.onSubmit(this.state.recipient, telepathChannel, invite)
  }

  validRecipient = recipient => {
    return recipient.length > 0 &&
      recipient.match(emailValidationRegEx)
  }

  submitDisabled = () => {
    return !this.validRecipient()
  }

  componentDidMount () {
    this.recipientField.current.focus()
  }

  render () {
    return (
      <FadingValueBox css={{ alignItems: 'center' }}>
        <Form onSubmit={this.onSubmit}>
          <Label htmlFor='frmEmailA'>Recipient:</Label>
          <Input id='frmEmailA' type='email'
            name='email'
            ref={this.recipientField}
            value={this.state.recipient}
            placeholder='name@example.com'
            required
            autocomplete='email'
            onChange={this.onChange} />
          { this.state.known && <Connector onDone={this.onDone} /> }
          { this.state.unknown && <Connector onDone={this.onDone} invite /> }
        </Form>
      </FadingValueBox>
    )
  }
}

export { Recipient }
