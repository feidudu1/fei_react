import React, { Component } from 'react';
import { fromJS } from 'immutable';
import PropTypes from 'prop-types';
// import render from './render';
import style from './index.less';
import Counter from '../../../../components/Counter';
import imgBg0 from '../../../../assets/img/s1/layerGroup/imgBg0.svg';
import imgBg1 from '../../../../assets/img/s1/layerGroup/imgBg1.svg';
import imgBg2 from '../../../../assets/img/s1/layerGroup/imgBg2.svg';
import imgBg3 from '../../../../assets/img/s1/layerGroup/imgBg3.svg';

class LayerGroup extends Component {
  static propTypes = {
    data: PropTypes.array,
    // options: PropTypes.opts,
  };

  componentDidMount() {
    // const { data, options } = this.props;
    // render(this.node, data || undefined, options);
  }
  shouldComponentUpdate(nextProps) {
    return !fromJS(nextProps).equals(fromJS(this.props));
  }
  componentDidUpdate() {
    // const { data, options } = this.props;
    // render(this.node, data || undefined, options);
  }
  render() {
    const { data } = this.props;
    return (
      <div className={style.layerGroup} ref={(node) => { this.node = node; }}>
        <div className={style.leftTextBlock}>
          <div className={`${style.lineItem} ${style.lineItem0}`}>
            <img src={imgBg0} alt=""/>
            <span className={style.titleBox}>{data.length > 0 ? data[0].name || '库表' : '库表'}</span>
            <span className={style.valueBox}>
              <Counter data={data.length > 0 ? data[0].value || 0 : 0} fontSize={76} color="#FFFFFF" /> {data.length > 0 ? data[0].unit || '个' : '个'}
            </span>
          </div>
          <div className={`${style.lineItem} ${style.lineItem1}`}>
            <img src={imgBg1} alt=""/>
            <span className={style.titleBox}>{data.length > 1 ? data[1].name || '文件' : '文件'}</span>
            <span className={style.valueBox}>
              <Counter data={data.length > 1 ? data[1].value || 0 : 0} fontSize={76} color="#FFFFFF" /> {data.length > 1 ? data[1].unit || '个' : '个'}
            </span>
          </div>
          <div className={`${style.lineItem} ${style.lineItem2}`}>
            <img src={imgBg2} alt=""/>
            <span className={style.titleBox}>{data.length > 2 ? data[2].name || 'API接口' : 'API接口'}</span>
            <span className={style.valueBox}>
              <Counter data={data.length > 2 ? data[2].value || 0 : 0} fontSize={76} color="#FFFFFF" /> {data.length > 2 ? data[2].unit || '个' : '个'}
            </span>
          </div>
          <div className={`${style.lineItem} ${style.lineItem3}`}>
            <img src={imgBg3} alt=""/>
            <span className={style.titleBox}>{data.length > 3 ? data[3].name || '实时流数据' : '实时流数据'}</span>
            <span className={style.valueBox}>
              <Counter data={data.length > 3 ? data[3].value || 0 : 0} fontSize={76} color="#FFFFFF" /> {data.length > 3 ? data[3].unit || '个' : '个'}
            </span>
          </div>
        </div>
        {/* <div className="layers" ref={(node) => { this.node = node; }}/> */}
      </div>
    );
  }
}

export default LayerGroup;
