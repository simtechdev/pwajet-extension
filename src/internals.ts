///<amd-module name='noname-example-addon'/>
import React from 'react'
const Component = React.lazy(() => import('./components/component/Component'))

export default {
  components: {
    Component,
  },
  utils: {
    doAJob: () => 'Provided by first extension'
  }
}
