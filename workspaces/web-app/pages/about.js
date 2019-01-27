import React from 'react'
import Header from '../components/Header'

import { Icon } from 'semantic-ui-react'
import image from './TestAttestation.png'
import './style.css'

const IconExampleSize = () => (
  <div>
    <Icon name='home' size='mini' />
    <Icon name='home' size='tiny' />
    <Icon name='home' size='small' />
    <Icon name='home' size='small' />
    <br />
    <Icon name='home' />
    <br />
    <Icon name='home' size='large' />
    <br />
    <Icon name='home' size='big' />
    <br />
    <Icon name='home' size='huge' />
    <br />
    <Icon name='amazon' size='massive' />
  </div>
)

export default () => (
  <div css={{backgroundColor: 'white'}}>
    <Header />
    <p>This is the about page</p>
    <IconExampleSize />
    <img src={image} />
    <p>{image}</p>
    <div className='test' />
  </div>
)
