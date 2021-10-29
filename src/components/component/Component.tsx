import React from 'react'

export interface IOwnProps {
  color: string
}

export type IProps = IOwnProps

//import './Component.css'

const Component:React.FC<IProps> = (props) => {
  return (
    <div className='b-component'>
      <h1
        style={{ color: props.color }}
        className='b-component__header'
      >Inserted by Addon example</h1>
      <p className='b-component__content'>Text</p>
    </div>
  )
}

export default Component
