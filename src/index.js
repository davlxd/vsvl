import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './containers/App'
import * as serviceWorker from './serviceWorker'

import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import reducers from './reducers'

import { BrowserRouter as Router, Route } from 'react-router-dom'

import LegalDoc from './components/LegalDoc'
import Test from './containers/Test'
import Home from './containers/Home'

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true

const store = createStore(
  combineReducers({...reducers})
)

//TODO remove this
store.subscribe(() => {
  console.log('-- store.getState() --')
  console.log(store.getState())
})


ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div>
        <Route exact path="/" component={Home} />
        <Route path="/app" component={App} />
        <Route path="/test" component={Test} />
        <Route path="/terms-of-service" component={LegalDoc}/>
        <Route path="/privacy-policy" component={LegalDoc}/>
        <Route path="/cookie-policy" component={LegalDoc}/>
      </div>
    </Router>
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
