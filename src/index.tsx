import './publicPathResolver'
import React from 'react'
import pwajet from 'pwajet'

const ProductCode = React.lazy(() => import('./components/product-code/ProductCode'))

const productCode = (props: any) => (
  <React.Suspense fallback={null}>
    <ProductCode {...props} />
  </React.Suspense>
)

const init = () => {
  pwajet.core.renderSubscriber.on('render-element.product/grid-item/ProductGridItem', event => {
    event.appendTo('div.b-product-grid-item__body', productCode)
  })
}

init()
