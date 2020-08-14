import React from 'react'

import './ProductCode.css'

const ProductCode: React.FC<any> = (props) => {
  return (
    <span className='b-product-code'>{props.product.code}</span>
  )
}

export default ProductCode
