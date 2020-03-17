import React, {Component} from 'react'
import Mouse from '../Mouse'

function WithMouse(Comp) {
  return class extends Component {
    render() {
      return (
        <div>
          <h1>移动鼠标!</h1>
          <Mouse render={mouse => (
              <Comp mouse={mouse} {...this.props}/>
          )}/>
        </div>
      )
    }
  }
}

export default WithMouse


