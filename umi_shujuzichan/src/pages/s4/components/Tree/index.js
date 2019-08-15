import { Component } from 'react';
import { fromJS } from 'immutable';
import render from './render';
import style from './index.less'

class Tree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }
  componentDidMount() {
    const { leftDepts, rightDepts, rightApps, leftData, rightData } = this.props;
    render(this.node, leftDepts, rightDepts, rightApps, leftData, rightData);
  }
  shouldComponentUpdate(nextProps) {
    return !fromJS(nextProps).equals(fromJS(this.props));
  }
  componentDidUpdate() {
    const { leftDepts, rightDepts, rightApps, leftData, rightData } = this.props;
    render(this.node, leftDepts, rightDepts, rightApps, leftData, rightData);
  }

  showModelHandler = (e) => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  };

  render() {
    const { children } = this.props;

    return (
      <div className={style.main}>
        <div ref={(node) => { this.node = node; }}></div>
        {/* tooltip样式 */}
          <div className={`${style.tooltip} tooltip`}>
          {/* <div className="tooltip"> */}
            <div className={`${style.bgDiv1} bgDiv1`}></div>
            <div className={`${style.bgDiv2} bgDiv2`}>
              <div className={`${style.leftText} leftText`}>
                {/* <div>共享应用数：</div>
                <div>共用数：</div>
                <div>共数：</div> */}
              </div>
              <div className={`${style.rightText} rightText`}>
                {/* <div>34个</div>
                <div>3400万个</div>
                <div>34万个</div> */}
              </div>
            </div>
            <div className={`${style.bgDiv3} bgDiv3`}></div>
          </div>
          {/* hover时线上文字滚动组件 */}
          <div className={`${style.scrollLeft} scrollLeft`}>
            {/* 一个滚动 */}
            {/* <div className="textScrollBlock textScrollBlockLeft">
              <div className="textScroll textScrollLeft">
                <span className="scrollType">
                  <span className="scrollItem">
                    <span>5BG服务</span>
                    <span className="diviceLine">/</span>
                  </span>
                  <span className="scrollItem">
                    <span>5</span>
                    <span>BG</span>
                    <span>服务</span>
                  </span>
                </span>
              </div>
            </div> */}
          </div>
        </div>
    );
  }
}

export default Tree;