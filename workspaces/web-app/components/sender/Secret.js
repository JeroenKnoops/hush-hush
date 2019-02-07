import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'

import { FadingValueBox } from '../animations'
import { Form, Textarea, Label } from '../forms'

class Secret extends Component {
  state = {
    secret: '',
    disabled: true
  }

  constructor () {
    super()
    this.secretField = React.createRef()
  }

  onChange = event => {
    const secret = event.target.value
    this.setState({
      secret,
      disabled: secret === ''
    })
  }

  onSubmit = event => {
    this.props.onSubmit && this.props.onSubmit(this.state.secret)
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
          <div css={{ alignSelf: 'center', marginTop: '1rem' }}>
            <Button primary
              disabled={this.state.disabled}
              onClick={this.onSubmit}>
              Send...
            </Button>
          </div>

        </Form>
      </FadingValueBox>
    )
  }
}

export { Secret }
