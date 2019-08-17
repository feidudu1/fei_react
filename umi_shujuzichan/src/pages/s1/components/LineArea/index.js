import React from 'react';
import { fromJS } from 'immutable';
import PropTypes from 'prop-types';
import drawChart from './render';

import style from './index.less';
// import style from './index.less';

class LineArea extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    opts: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      // chooseNum: this.props.data.length,
    };
  }

  componentDidMount() {
    this.start();
    if (this.defaultData.length) {
      drawChart(this.container, this.defaultData, this.defaultData.length - 1, this.options);
    }
    // if (this.defaultData.length > this.state.chooseNum) {
    //   this.props.emitEvent('chooseYear', this.defaultData[this.state.chooseNum].x);
    // }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (fromJS(nextProps).equals(fromJS(this.props)) && fromJS(nextState).equals(fromJS(this.state))) {
      return false;
    }
    return true;
  }

  componentDidUpdate() {
    // if (this.props.dataEntries
    // && this.props.dataEntries.index) {}

    if (this.defaultData.length) {
      drawChart(this.container, this.defaultData, this.defaultData.length - 1, this.options);
    }
    // if (this.defaultData.length > this.state.chooseNum) {
    //   this.props.emitEvent('chooseYear', this.defaultData[this.state.chooseNum].x);
    // }
  }
  componentWillUnmount() {
    this.stop();
  }
  speedCount = 0;
  speed = 180;
  loop = () => {
    this.requestId = requestAnimationFrame(this.loop);
    if (this.speedCount === this.speed) {
      if (this.state.chooseNum > (this.defaultData.length - 2)) {
        this.setState({ chooseNum: 0 });
      } else {
        this.setState({ chooseNum: this.state.chooseNum + 1 });
      }
      this.speedCount = 0;
    } else {
      this.speedCount += 1;
    }
  };
  start = () => {
    if (!this.requestId) {
      // this.loop();
    }
  };
  stop = () => {
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
      this.requestId = null;
    }
  };
  render() {
    const { opts, data } = this.props
    this.options = opts || {};
    this.defaultData = data || [];
    return (
      <div
        className="lineArea"
        // className={style.lineArea}
        ref={(node) => { this.container = node; }}
      />
    );
  }
}

export default LineArea;
