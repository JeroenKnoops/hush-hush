import React from 'react'
import styled from '@emotion/styled'
import Header from '../components/Header'

const H1 = styled.h1(
  {
    fontSize: 20
  },
  props => ({ color: props.color })
)

const Index = () => (
  <div>
    <Header />
    <H1 color='#ff80c3'>Welcome to next.js!</H1>
  </div>
)

export default Index
