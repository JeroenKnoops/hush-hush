import React, { Component } from 'react'
import { FadingValueBox } from '../animations'

import { Form, Input, Label } from '../forms'
import { Connector } from '../identity'

// From https://emailregex.com
const emailValidationRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

class Recipient extends Component {
  state = {
    recipient: ''
  }

  constructor () {
    super()
    this.recipientField = React.createRef()
  }

  onChange = event => {
    this.setState({ recipient: event.target.value })
  }

  onSubmit = event => {
    event.preventDefault()
  }

  onDone = telepathChannel => {
    this.props.onSubmit && this.props.onSubmit(this.state.recipient, telepathChannel)
  }

  validRecipient = () => {
    return this.state.recipient.length > 0 &&
      this.state.recipient.match(emailValidationRegEx)
  }

  submitDisabled = () => {
    return !this.validRecipient()
  }

  componentDidMount () {
    this.recipientField.current.focus()
  }

  render () {
    return (
      <FadingValueBox>
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
          <Connector disabled={this.submitDisabled()} onDone={this.onDone} />
        </Form>
      </FadingValueBox>
    )
  }
}

export { Recipient }
