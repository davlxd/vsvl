import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import ConsentDialog from '../ConsentDialog'

import { APPLY_WEB_STORAGE_VALUE, } from '../../actions'



const styles = theme => ({
})

const bgHeight = () => window.innerHeight

class Home extends Component {
  constructor(props) {
    super(props)
    window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true
  }


  componentDidMount() {
    this.loadWebStorageValue()
  }
  loadWebStorageValue() {
    const { applyWebStorageValue } = this.props

    applyWebStorageValue('consent', localStorage.getItem('consent') === 'true')
    applyWebStorageValue('v', Number(localStorage.getItem('v')))
    applyWebStorageValue('settings', JSON.parse(localStorage.getItem('settings')))
  }



  render() {
    const { classes } = this.props
    return (
      <ConsentDialog />
    )
  }
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => ({
  applyWebStorageValue: (name, value) => {
    dispatch(APPLY_WEB_STORAGE_VALUE(name, value))
  }
})

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Home)
)
