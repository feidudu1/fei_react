import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import Counter from '../../../../components/Counter';
import style from './index.less';

class StaticInfo extends Component {
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
    // console.log(111, fromJS(nextProps))
    return !(fromJS(nextProps).equals(fromJS(this.props)) && fromJS(nextState).equals(fromJS(this.state)));
    // return !fromJS(nextProps).equals(fromJS(this.props));
  }

  componentDidUpdate() {
  }
  componentWillUnmount() {
  }

  render() {
    this.defaultData = this.props.data;
    const itemWidth = 2320 / this.defaultData.length;
    return (
      <div className={style.staticInfo}>
        {
          this.defaultData.length && this.defaultData.map((t, i) => (
            <div className={style.staticInfoContent} key={t.x} style={{ left: `${itemWidth * i}px`, width: `${itemWidth - 20}px` }}>
              <div className={style.staticInfoMain}>
                <div className={style.titleBox}>{t.x || ''}</div>
                <div className={style.valueBox}>
                  <Counter data={t.y1 || 0} fontSize={76} color="#FFFFFF" /> {t.z1 || ''}
                  {t.y2 ?
                    (
                      <span>
                        <span className={style.iconBox}> / </span>
                        <Counter data={t.y2 || 0} fontSize={76} color="#FFFFFF"/> {t.z2 || ''}
                      </span>
                    )
                    : ''
                  }
                </div>
              </div>
              <div className={style.bottomLine}></div>
            </div>
        ))}
      </div>
    );
  }
}

export default StaticInfo;
