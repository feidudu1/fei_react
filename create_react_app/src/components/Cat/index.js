import React, {Component} from 'react'

export default class Cat extends Component {
    render() {
      const mouse = this.props.mouse
      return (
        <div style={{width: '10px', height: '10px', backgroundColor: 'red', position: 'absolute', left: mouse.x, top: mouse.y}}>cat</div>
      );
    }
  }