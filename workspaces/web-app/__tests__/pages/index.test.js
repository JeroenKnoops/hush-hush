import React from 'react'
import { render } from 'react-testing-library'
import Home from '../../pages/index'

describe('index', () => {
  it('has proper styling', () => {
    const { container } = render(<Home />)
    expect(container).toMatchSnapshot()
  })

  it('displays secret form', () => {
    const { getByText } = render(<Home />)
    expect(getByText(/your secret/i)).toBeInTheDocument()
  })
})
