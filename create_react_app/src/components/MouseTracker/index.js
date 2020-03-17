import React, {Component} from 'react'
import Mouse from '../Mouse'
import Cat from '../Cat'

export default class MouseTracker extends Component {
    render() {
      return (
        <div>
          <h1>移动鼠标!</h1>
          <Mouse render={mouse => (
              <Cat mouse={mouse} />
          )}/>
          {/* 错误写法 */}
          {/* <Mouse>
            {mouse => (
                <Cat mouse={mouse} />
            )}
          </Mouse> */}
        </div>
      );
    }
  }