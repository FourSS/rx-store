import { Component, PropTypes, Children } from 'react'
import storeShape from '../utils/storeShape'
import actionFactoryShape from '../utils/actionFactoryShape'
import warning from '../utils/warning'

let didWarnAboutReceivingStore = false
function warnAboutReceivingStore() {
  if (didWarnAboutReceivingStore) {
    return
  }
  didWarnAboutReceivingStore = true

  warning('<Provider> does not support changing `store` on the fly.')
}

export default class Provider extends Component {
  static propTypes = {
    store: storeShape.isRequired,
    actionFactory: actionFactoryShape,
    children: PropTypes.element.isRequired
  }
  static childContextTypes = {
    store: storeShape.isRequired,
    actionFactory: actionFactoryShape
  }
  getChildContext() {
    if (this.actionFactory) {
      return {
        store: this.store,
        actionFactory: this.actionFactory
      }
    }
    return { store: this.store }
  }

  constructor(props, context) {
    super(props, context)
    this.store = props.store
    this.actionFactory = props.actionFactory
  }

  render() {
    return Children.only(this.props.children)
  }
}

if (process.env.NODE_ENV !== 'production') {
  Provider.prototype.componentWillReceiveProps = function (nextProps) {
    const { store } = this
    const { store: nextStore } = nextProps

    if (store !== nextStore) {
      warnAboutReceivingStore()
    }
  }
}
