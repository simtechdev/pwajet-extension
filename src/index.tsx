import React from 'react'
import pwajet from 'pwajet'
const Component = React.lazy(() => import('./components/component/Component'))

pwajet.core.renderSubscriber.on(
  'render-element.product/single-item/ProductSingleItem',
  (subscriber) => {
    subscriber.insertAfter('.b-product-single__price', () => {
      return (
        <React.Suspense fallback={null}>
          <Component color='blue' />
        </React.Suspense>
      )
    })
  }
)
