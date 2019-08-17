import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';

// import './index.less';
import style from './index.less';
import render from './render';

class LeftPolygon extends Component {
  static propTypes = {
    data: PropTypes.array,
  }
  // static defaultProps = {
  //   data: [
  //     { x: '完整性', y: 0 },
  //     { x: '唯一性', y: 0 },
  //     { x: '规范性', y: 0 },
  //     { x: '及时性', y: 0 },
  //     { x: '准确性', y: 0 },
  //     { x: '准确性', y: 0 },
  //   ],
  //   opts: {
  //     width: 1227,
  //     height: 1036,
  //     color1: '#0034FF',
  //     color2: '#06CBFF',
  //     color3: '#DCFB50',
  //     circleColor1: '#DCF4FD',
  //     circleColor2: '#09232E',
  //     rectColor1: '#FF5C5C',
  //     rectColor2: '#DCFB50',
  //   },
  // }

  constructor(props) {
    super(props);
    this.state = {
      // chooseNum: 0,
    };
  }
  componentDidMount() {
    render(this.container, this.defaultDate, this.defaultOpt);
  }
  componentDidUpdate() {
    render(this.container, this.defaultDate, this.defaultOpt);
  }
  componentWillUnmount() {
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (fromJS(nextProps).equals(fromJS(this.props)) && fromJS(nextState).equals(fromJS(this.state))) {
      return false;
    }
    return true;
  }
  render() {
    const { data } = this.props
    this.defaultDate = (data && data.length > 0) ? data : [
      { x: '完整性', y: 0 },
      { x: '唯一性', y: 0 },
      { x: '一致性', y: 0 },
      { x: '稳定性', y: 0 },
      { x: '准确性', y: 0 },
      { x: '时效性', y: 0 },
    ];
    this.defaultOpt = {
      width: 1227,
      height: 1036,
      color1: '#0034FF',
      color2: '#06CBFF',
      color3: '#DCFB50',
      circleColor1: '#DCF4FD',
      circleColor2: '#09232E',
      rectColor1: '#FF5C5C',
      rectColor2: '#DCFB50',
    };
    return (
      <div className={`${style.leftPolygon} leftPolygon`} ref={(node) => { this.container = node; }}>
      </div>
    )
  }
}
export default LeftPolygon;
