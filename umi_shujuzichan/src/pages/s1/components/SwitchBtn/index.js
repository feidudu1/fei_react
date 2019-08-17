import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './index.less';

class SwitchBtn extends Component {
  static propTypes = {
    data: PropTypes.oneOfType([
      PropTypes.array,
    ]), // [[{name: '分类1', id: 0}, {name: '分类2', id: 1}], ['table', '分类']]
    id: PropTypes.number,
    handleTrigger: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = {
      // data: [[[], [], []], [[], [], []], [[], [], []]],
      // chooseType: 0,
      // chooseDate: 2,
    };
  }

  componentDidMount() {
  }
  change = (id, type) => {
    if (id !== this.props.id) {
      this.props.handleTrigger(id, type)
    }
  }
  render() {
    const { data, id } = this.props;    
    return (
      <div className={style.SwitchBtnCom} ref={(node) => { this.node = node; }}>
        <div className={style.item}>{data[1] ? data[1][1] ? `${data[1][1]}：` : '' : ''}
          {
            data[0].map(t =>
              <button onClick={() => this.change(t.id, data[1][0])} className={id.toString() === (t.id).toString() ? `${style.activeBtn}` : `${style.btn}`} key={t.id}>{ t.name } </button>,
            )
          }
        </div>
      </div>);
  }
}

export default SwitchBtn;
