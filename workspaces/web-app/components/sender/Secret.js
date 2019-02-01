import React, { Component } from 'react'

import { FadingValueBox } from '../animations'
import { Form, Button, Textarea, Label } from '../forms'

class Secret extends Component {
  state = {
    secret: ''
  }

  constructor () {
    super()
    this.secretField = React.createRef()
  }

  onChange = event => {
    this.setState({ secret: event.target.value })
  }

  onSubmit = event => {
    this.props.onSubmit && this.props.onSubmit(this.state.secret)
    this.setState({ secret: '' })
    this.secretField.current.focus()
    event.preventDefault()
  }

  componentDidMount () {
    this.secretField.current.focus()
  }

  render () {
    return (
      <FadingValueBox>
        <Form onSubmit={this.onSubmit}>
          <Label htmlFor='secret'>Your secret</Label>
          <Textarea id='secret' ref={this.secretField}
            value={this.state.secret}
            placeholder='Type your secret here...'
            onChange={this.onChange} />
          <Button type='submit' value='Send...' />
        </Form>
      </FadingValueBox>
    )
  }
}

export { Secret }
