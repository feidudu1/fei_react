import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import render from './render';
import style from './index.less';

class RectBar extends Component {
  static propTypes = {
    data: PropTypes.array,
    opts: PropTypes.object,
  };

  componentDidMount() {
    render(this.node, this.defaultDate, this.options);
  }
  shouldComponentUpdate(nextProps) {
    return !(fromJS(nextProps).equals(fromJS(this.props)));
  }
  componentDidUpdate() {
    render(this.node, this.defaultDate, this.options);
  }
  render() {
    const { opts, data } = this.props;
    this.defaultDate = data || [
      { x: '全省常住人口', y: 98, m: 0, v: 0 },
      { x: '全省常住人口', y: 98, m: 0, v: 0 },
      { x: '全省常住人口', y: 78, m: 0, v: 0 },
      { x: '全省常住人口', y: 68, m: 0, v: 0 },
      { x: '全省常住人口', y: 58, m: 0, v: 0 },
      { x: '全省常住人口', y: 48, m: 0, v: 0 },
      { x: '全省常住人口', y: 38, m: 0, v: 0 },
      { x: '全省人口', y: 28, m: 0, v: 0 },
    ];    
    this.options = Object.assign({
      width: 715,
      height: 695,
      left: 2260,
      top: 1390,
      paddingTop: 125,
      bgColor: '#00B9F8',
      color1: '#2F50D2',
      color2: '#06CBFF',
      unit: [],
      title: [],
      // unit: ['条', 'GB'],
      // title: ['表名', ''],
      maxData: 0,
      showAll: false, // 是否强制显示所有数据（条数和存储量）
    }, opts);
    
    // let returnDom
    // if (this.options.maxData && Number(this.options.maxData)) {
    const returnDom = <div className="RectBar" ref={(node) => { this.node = node; }}/>
    // } else {
    //   returnDom = ''
    // }
    return (
      <div className="rectbar">{returnDom}</div>
    );
  }
}

export default RectBar;
