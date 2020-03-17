import React, {Component} from 'react'

export default class Mouse extends Component {
    constructor(props) {
      super(props);
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.state = { x: 0, y: 0 };
    }
  
    handleMouseMove(event) {
      this.setState({
        x: event.clientX,
        y: event.clientY
      });
    }
  
    render() {
      return (
        <div style={{ height: '200px', backgroundColor: 'yellow' }} onMouseMove={this.handleMouseMove}>
          {this.props.render(this.state)}
          <p>当前的鼠标位置是 ({this.state.x}, {this.state.y})</p>
        </div>
      );
    }
  }