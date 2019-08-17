import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import style from './index.less';

class StaticList extends Component {
  static propTypes = {
    data: PropTypes.array,
  }
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !(fromJS(nextProps).equals(fromJS(this.props)) && fromJS(nextState).equals(fromJS(this.state)));
  }

  componentDidUpdate() {
  }
  componentWillUnmount() {
  }

  render() {
    this.rolldata2Value = this.props.data
    // [
    //   { x: '全省常住人口全省常住人口全省常住人口', y: '空值率大于50%空值率大于50%', z: '62774', m: '257', n: '19.03.01', p: '1893' },
    //   { x: '全省常住人口', y: '空值率大于50%', z: '62774', m: '257', n: '19.03.01', p: '1893' },
    //   { x: '全省常住人口', y: '空值率大于50%', z: '62774', m: '257', n: '19.03.01', p: '1893' },
    //   { x: '全省常住人口', y: '空值率大于50%', z: '62774', m: '257', n: '19.03.01', p: '1893' },
    //   { x: '全省常住人口', y: '空值率大于50%', z: '62774', m: '257', n: '19.03.01', p: '1893' },
    //   { x: '全省常住人口', y: '空值率大于50%', z: '62774', m: '257', n: '19.03.01', p: '1893' },
    //   { x: '全省常住人口', y: '空值率大于50%', z: '62774', m: '257', n: '19.03.01', p: '1893' },
    //   { x: '全省常住人口', y: '空值率大于50%', z: '62774', m: '257', n: '19.03.01', p: '1893' },
    //   { x: '全省常住人口', y: '空值率大于50%', z: '62774', m: '257', n: '19.03.01', p: '1893' },
    //   { x: '全省常住人口', y: '空值率大于50%', z: '62774', m: '257', n: '19.03.01', p: '1893' },
    // ];
    const listContent = [];
    const {tableHead, options } = this.props
    for (let i = 0; i < this.rolldata2Value.length; i += 1) {
      this.data = this.rolldata2Value[i];
      listContent.push(
        <li className={style.rollingRow} key={this.data[0] + i}>
          <div className={style['table-row']}>
          {
            this.data.map((t, j) => {
              return <span className={style['table-col']} title={t} key={t + i} style={{width: options[j] + 'px'}}>{t}</span>
            })
          }
          </div>
        </li>);
    }
    console.log(88888, options);
    return (
      <div className={style.staticLists1}>
        <div className={style['table-title']}>
        {
          tableHead.map((t, i) => {
            return <span className={style['table-col']} style={{width: options[i] + 'px'}} key={t}>{t}</span>
          })
        }
        </div>
        <div className={style.rollingLists} onMouseEnter={this.stopOuterLoop} onMouseLeave={this.rolldata2Value && this.rolldata2Value.length > this.showRowNum ? this.outerLoop : this.stopOuterLoop}>
          <ul className={style.rollingBox} ref={(node) => { this.ulContainer = node; }}>
            {listContent}
          </ul>
        </div>
      </div>
    );
  }
}

export default StaticList;
