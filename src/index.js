import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './containers/App'
import * as serviceWorker from './serviceWorker'

import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import * as reducers from './reducers'

import { BrowserRouter as Router, Route } from 'react-router-dom'

const store = createStore(
  combineReducers(reducers)
)

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div>
        <Route exact path="/" component={App} />
        <Route path="/app" component={App} />
        <Route path="/topics" component={App} />
      </div>
    </Router>
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
