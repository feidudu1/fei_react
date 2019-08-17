import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import style from './index.less';

class SwitchBtn extends Component {
  static propTypes = {
    isDesc: PropTypes.bool,
    opts: PropTypes.object,
    id: PropTypes.number,
    handleTrigger: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !(fromJS(nextProps).equals(fromJS(this.props)) && fromJS(nextState).equals(fromJS(this.state)));
  }
  componentDidUpdate() {
  }
  change = () => {
    this.props.handleTrigger(this.props.id)
  }
  render() {
    const { isDesc, opts } = this.props;
    return (
      <div
        className={isDesc ? `${style.SortIconCom} ${style.desc}` : `${style.SortIconCom} ${style.asc}`}
        ref={(node) => { this.node = node; }}
        onClick={() => this.change()}
        >
      </div>
    );
  }
}

export default SwitchBtn;
