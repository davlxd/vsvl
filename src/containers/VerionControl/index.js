import React, { Component } from 'react'
import { connect } from 'react-redux'


const version = 9 //message = 'Fix file name'

class VersionControl extends Component {
  componentDidMount() {
    console.log('version number: ', Number(localStorage.getItem('v')))
    if (this.props.consent) {
      localStorage.setItem('v', version)
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.consent && this.props.consent) {
      localStorage.setItem('v', version)
    }
  }

  render() {
    return (
      <div></div>
    )
  }
}

const mapStateToProps = (state) => ({
  consent: state.misc.consent
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VersionControl)
