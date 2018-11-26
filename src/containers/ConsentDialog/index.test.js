import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'

import { expect } from 'chai'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import ConnectedConsentDialog, { StyledConsentDialog as ConsentDialog } from './index'
window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true

Enzyme.configure({ adapter: new Adapter() })

describe('<ConsentDialog />', () => {
  it('Dialog will not show if user has consent before', () => {
    const props = {
      consent: true,
      fullScreen: false,
    }
    const wrapper = mount(<ConsentDialog {...props} />)
    expect(wrapper.exists('#videoSurveillance-webcam')).to.be.false
  })

  it('PROCEED button only available when user check both checkboxes', () => {
    const props = {
      consent: false,
      fullScreen: false,
    }
    const wrapper = mount(<ConsentDialog {...props} />)
    expect(wrapper.exists('#videoSurveillance-webcam')).to.be.true

    wrapper.find('#checkbox-comply-legal-activities').hostNodes().getDOMNode().click()
    expect(wrapper.find('#proceed-button').hostNodes().getDOMNode()).to.have.property('disabled', true)

    wrapper.find('#checkbox-consent-to-legal-docs').hostNodes().getDOMNode().click()
    expect(wrapper.find('#proceed-button').hostNodes().getDOMNode()).to.have.property('disabled', false)
  })
})
