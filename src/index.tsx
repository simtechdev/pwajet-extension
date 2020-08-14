import './publicPathResover'
import React from 'react'

const ProductCode = React.lazy(() => import('./components/product-code/ProductCode'))

const productCode = (props: any) => (
  <React.Suspense fallback={null}>
    <ProductCode {...props} />
  </React.Suspense>
)

const init = () => {
  console.log('init called')
  window.addEventListener<any>('render-element.product/grid-item/ProductGridItem', (event: CustomEvent) => {
    event.detail.appendTo('div.b-product-grid-item__body', productCode)
  })
}

init()
