import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import playCounter from './render';
import './index.less';

export default class Counter extends Component {
  constructor(props) {
    super(props);
    this.num = 0;
  }
  componentDidMount() {
    playCounter(this.counter, this.props.data, this.num, this.option);
  }
  shouldComponentUpdate(nextProps) {
    if (!fromJS(nextProps).equals(fromJS(this.props))) {
      return true;
    }
    return false;
  }
  componentDidUpdate() {
    playCounter(this.counter, this.props.data, this.num, this.option);
    this.num = this.props.data;
  }
  render() {
    this.option = { fontSize: this.props.fontSize,
      fontColor: this.props.color };
    return (
      <span className="counter" ref={(node) => { this.counter = node; }}></span>
    );
  }
}

Counter.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  fontSize: PropTypes.number,
  color: PropTypes.string,
};
