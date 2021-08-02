import React from 'react'

export interface IOwnProps {
  helloText: string
}

export type IProps = IOwnProps

import './ConsumerComponent.css'

const ConsumerComponent:React.FC<IProps> = (props) => {
  const {
    helloText,
  } = props
  return (
    <h1 className='b-consumer-component'>{helloText}</h1>
  )
}

export default ConsumerComponent
