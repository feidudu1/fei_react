import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import render from './render';
// import './index.less';

class CircleBar extends Component {
  static propTypes = {
    data: PropTypes.array,
    options: PropTypes.object,
  };

  componentDidMount() {
    const { data, options } = this.props;
    if (data && data.length) {
      render(this.node, data.slice(0, 6) || [], options);
    }
  }
  shouldComponentUpdate(nextProps) {
    return !fromJS(nextProps).equals(fromJS(this.props));
  }
  componentDidUpdate() {
    const { data, options } = this.props;
    if (data && data.length) {
      render(this.node, data.slice(0, 6) || [], options);
    }
  }
  componentWillUnmount() {
  }
  render() {
    return (<div
      className="circleBar"
      ref={(node) => { this.node = node; }}
    />);
  }
}

export default CircleBar;
