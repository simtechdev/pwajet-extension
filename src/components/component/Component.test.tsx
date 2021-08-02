import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Component, { IProps } from './Component'

const setup = (customProps?: Partial<IProps>) => {
  const props = {
   ...{
      color: '#f00',
    },
    ...customProps
  }

  return {
    wrapper: render(
      <Component {...props} />
    ),
    props: props
  }
}

describe('Component component', () => {
  it('should render text "Inserted by Addon example"', () => {
    setup();
    expect(screen.getByText('Inserted by Addon example')).toBeInTheDocument()
  })
  it('should color "Inserted by Addon example" to a specified color', () => {
    const {wrapper} = setup();
    expect(screen.getByText('Inserted by Addon example')).toHaveStyle({ color: '#f00'})

    wrapper.rerender(<Component color='#0f0' />);
    expect(screen.getByText('Inserted by Addon example')).toHaveStyle({ color: '#0f0'})
  })
})
