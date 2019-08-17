import React, { Component } from 'react';
import { fromJS } from 'immutable';
import PropTypes from 'prop-types';
import render from './render';
import style from './index.less';

class PieSource extends Component {
  static propTypes = {
    data: PropTypes.array,
    options: PropTypes.object,
  };

  componentDidMount() {
    localStorage.setItem('s1pieinterval', 'init')
    const { data, options } = this.props;
    if (data && data.length) {
      render(this.node, data || undefined, options);
    }
  }
  shouldComponentUpdate(nextProps) {
    return !fromJS(nextProps).equals(fromJS(this.props));
  }
  componentDidUpdate() {
    const { data, options } = this.props;
    render(this.node, data || undefined, options);
  }
  componentWillUnmount() {
    localStorage.setItem('s1pieinterval', 'distory')
  }
  render() {
    return (<div
      className="PieSourceS1"
      ref={(node) => { this.node = node; }}
    />);
  }
}

export default PieSource;
