import { Component } from 'react';
import { fromJS } from 'immutable';
import render from './render';

class Tree extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }
  componentWillReceiveProps(nextProps) {
    console.log(1111, nextProps);
    if (!fromJS(nextProps).equals(fromJS(this.props))) {
      const { leftDepts, rightDepts, rightApps, leftData, rightData, options } = nextProps;
      render(this.node, leftDepts, rightDepts, rightApps, leftData, rightData, options);
    }
  }

  showModelHandler = (e) => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  };

  render() {
    const { children } = this.props;

    return (
      <div ref={(node) => { this.node = node; }}></div>
    );
  }
}

export default Tree;