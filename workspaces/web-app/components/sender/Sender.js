import React from 'react'
import Head from 'next/head'
import styled from '@emotion/styled'
import { PageCentered } from '@react-frontend-developer/react-layout-helpers'

const Textarea = styled.textarea({
  fontFamily: '"Roboto Mono", monospace',
  width: '500px',
  height: '300px',
  backgroundColor: 'black',
  color: 'white',
  borderRadius: '20px',
  border: '1px solid white',
  padding: '20px',
  resize: 'none',
  outlineWidth: 0,
  transition: 'border-color 0.2s ease-in-out 0s',
  ':focus': {
    borderColor: '#0099FF'
  }
})

const Label = styled.label({
  fontFamily: '"Roboto Mono", monospace',
  fontSize: '1.2em',
  marginBottom: '10px',
  opacity: '0.5'
})

const Button = styled.input({
  fontFamily: '"Roboto Mono", monospace',
  fontSize: '1.2em',
  backgroundColor: '#0099FF',
  color: 'white',
  alignSelf: 'center',
  marginTop: '20px',
  borderRadius: '10px',
  outline: 0,
  width: '150px',
  height: '50px',
  border: 'none',
  opacity: '1.0',
  boxShadow: 'none',
  transition: 'all 0.2s ease-in-out 0s',
  ':active': {
    opacity: '0.6'
  },
  ':hover': {
    filter: 'brightness(85%)'
  },
  ':focus': {
    opacity: '0.8'
  }
})

const Form = styled.form({
  display: 'flex',
  flexFlow: 'column nowrap',
  alignItems: 'flex-start',
  justifyContent: 'center'
})

class Sender extends React.Component {
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
    console.log('submitted')
    this.secretField.current.focus()
    event.preventDefault()
  }

  componentDidMount () {
    this.secretField.current.focus()
  }

  render () {
    return (
      <PageCentered css={{ color: 'white' }}>
        <Head>
          <title>Hush Hush</title>
          <link href='https://fonts.googleapis.com/css?family=Roboto+Mono' rel='stylesheet' />
        </Head>
        <Form onSubmit={this.onSubmit}>
          <Label htmlFor='secret'>Your secret</Label>
          <Textarea id='secret' ref={this.secretField}
            value={this.state.secret}
            placeholder='Type your secret here...'
            onChange={this.onChange} />
          <Button type='submit' value='Send...' />
        </Form>
      </PageCentered>
    )
  }
}

export { Sender }
