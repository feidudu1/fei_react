import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';

import render2 from './render2';
import './index.less';

class MiddleDiamond extends Component {
  static propTypes = {
    // screenSize: PropTypes.number,
    // leftTop: PropTypes.object,
    // getMoveStatus: PropTypes.func,
    // getNodeId: PropTypes.func,
    diamond: PropTypes.array,
  }

  constructor(props) {
    super(props);
    this.state = {
      chooseIndex: 0,
      index: 0,
      data2: null,
      data1: null,
    };
    this.initThree = false;
    this.updateThree = false;
    this.nodeId = 0;
    this.transmit = true;
    // this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    render2(
      this.three,
      this.defaultData1,
      this.defaultData2,
      this.defaultOpt,
      // this.props.screenSize,
      this.props.leftTop || 0,
      this.getShowIndex,
      this.props.getMoveStatus || 0, // hover传参
      this.updateThree,
      this.initThree,
    );
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !(fromJS(nextProps).equals(fromJS(this.props)) && fromJS(nextState).equals(fromJS(this.state)));
  }
  componentDidUpdate() {
    this.updateThree = true;
    render2(
      this.three,
      this.state.data1 || this.defaultData1,
      this.state.data2 || this.defaultData2,
      this.defaultOpt,
      // this.props.screenSize,
      this.props.leftTop,
      this.getShowIndex,
      this.props.getMoveStatus, // hover传参
      this.updateThree,
    );
  }
  componentWillUnmount() {
    this.showComp = true;
  }
  // 获取点击后小球i
  getShowIndex = (v) => {
    this.setState({
      chooseIndex: v,
    })
    this.getData2();
  }
  getData2 = () => {
    if (this.defaultData1 && this.defaultData1.length > 0) {
      const arr = [];
      this.defaultData1.forEach((d) => {
        const val = d;
        if (d.num === this.state.chooseIndex) {
          // console.log(3)
          val.type = 1;
          this.nodeId = val.nodeId;
          // this.props.getNodeId(this.nodeId);
        } else {
          val.type = 0;
        }
        arr.push(val);
      })
      this.setState({
        data1: arr,
      })
    }
    if (this.defaultData2 && this.defaultData2.length > 0) {
      const arr = [];
      this.defaultData2.forEach((d) => {
        const val = d;
        if (d.num === this.state.chooseIndex) {
          // console.log(2)
          val.type = 1;
          this.nodeId = val.nodeId;
          // this.props.getNodeId(this.nodeId);
        } else {
          val.type = 0;
        }
        arr.push(val);
      })
      this.setState({
        data2: arr,
      })
    }
  }
  render() {
    const dataset = [];
    if (this.props.diamond && this.props.diamond.length > 0) {
      let len = 0;
      this.props.diamond.forEach((d, i) => {
        const data1 = [];
        len += i === 0 ? 0 : this.props.diamond[i - 1].children.length;
        d.children.forEach((d2, i2) => {
          data1.push({
            x: d2.categoryName || '',
            y: (d2.data && d2.data.length > 0) ? d2.data : [],
            type: (i === 0) && (i2 === 0) ? 1 : 0,
            // type: (i === 1) && (i2 === Math.floor(this.props.diamond[1].children.length / 2)) ? 1 : 0,
            num: len + i2,
            nodeId: d2.categoryId || 0,
          })
        });
        dataset.push(data1);
      });
      // [this.defaultData1, this.defaultData2] = dataset;
      [this.defaultData2, this.defaultData1] = dataset;
      if (this.transmit) {
        this.transmit = false;
        dataset[0].forEach((d) => {
        // dataset[1].forEach((d) => {
          if (d.type === 1) {
            this.nodeId = d.nodeId;
            // this.props.getNodeId(this.nodeId);
          }
        });
      }
    } else {
      this.defaultData1 = [
        // { x: '监管', num: 3, type: 0 },
        // { x: '信用', num: 4, type: 0 },
        // { x: '应急', num: 5, type: 0 },
      ];
      this.defaultData2 = [
        // {
        //   x: '人口',
        //   num: 0,
        //   type: 0,
        //   y: [
        //     { name: '来源部门数', unit: '张', value: 4564 },
        //     { name: '部门总数', unit: 'GB', value: 1234 },
        //     { name: '来源部门数', unit: '张', value: 4564 },
        //     { name: '来源部门数', unit: '张', value: 4564 },
        //     { name: '来源部门数', unit: '张', value: 4564 },
        //   ],
        // },
        // {
        //   x: '人口',
        //   num: 1,
        //   type: 1,
        //   y: [
        //     { name: '来源部门数', unit: '张', value: 4564 },
        //     { name: '部门总数', unit: 'GB', value: 1234 },
        //     { name: '来源部门数', unit: '张', value: 4564 },
        //     { name: '来源部门数', unit: '张', value: 4564 },
        //     { name: '来源部门数', unit: '张', value: 4564 },
        //   ],
        // },
        // {
        //   x: '人口',
        //   num: 2,
        //   type: 0,
        //   y: [
        //     { name: '来源部门数', unit: '张', value: 4564 },
        //     { name: '部门总数', unit: 'GB', value: 1234 },
        //     { name: '来源部门数', unit: '张', value: 4564 },
        //     { name: '来源部门数', unit: '张', value: 4564 },
        //     { name: '来源部门数', unit: '张', value: 4564 },
        //   ],
        // },
      ]
    }
    this.defaultOpt = {
      width: 597,
      height: 723,
    };
    return (
      <div className="middleDiamond">
        <canvas id="zuanshi"></canvas>
        <div className="textDiv" ref={(node) => { this.three = node; }} />
      </div>
    );
  }
}

export default MiddleDiamond;
