import styled from '@emotion/styled'

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

export { Textarea }
