import Link from 'umi/link'
import { connect } from 'dva';
import withRouter from 'umi/withRouter';
import {
  Component
} from 'react';
import style from './index.less';

const screenSwitchInfo = [{
    route: '/s3',
    name: '数据概览',
  },
  {
    route: '/s4',
    name: '数据链路',
  },
  {
    route: '/',
    name: '资产评估',
  },
  {
    route: '/',
    name: '资产地图',
  },
];

class BasicLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: '数据概览',
    };
  }
  componentDidMount() {
    this.changeZoom()
    window.onresize = () => this.changeZoom();
  }
  changeZoom() {
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;
    const visualFill = 3840 / 2160;
    let scales
    let w
    let h
    let mt
    let ml
    if (width > height * visualFill) {
      scales = height / 2160
      w = visualFill * height
      h = height
      mt = 0
      ml = (width - w) / 2
    } else {
      scales = width / 3840
      w = width
      h = width / visualFill
      mt = (height - h) / 2
      ml = 0
    }
    document.querySelector('.content').style['transform-origin'] = `0px 0px`
    // document.querySelector('.content').style.transform = `scale(${scales})`
    document.querySelector('.content').style.transform = `translate(${ml}px, ${mt}px) scale(${scales})`
    
    const layout = {
      scales: scales * 1,w, h,mt: mt * 1, ml: ml * 1
      // scales: scales * 2,w, h,mt: mt * 2, ml: ml * 2
    }
    // this.props.dispatch({
    //   type: 'layout/saveLayout',
    //   payload: {layout}
    // })
  }
  render() {
    const {activeItem} = this.state
    return (
      <div className="content">
        <div className={style.bigScreenTop}>
          <div className={style.screenTitle}></div>
          <div className={style.screenLink}>
            {
              screenSwitchInfo.map(screenInfo => (
                <button
                  key={screenInfo.name}
                  className = {
                    `${style.linkBtn} ${screenInfo.name === activeItem ? style.linkActive :''}`
                  }
                  >
                  <Link
                    className={style.link}
                    to={screenInfo.route}
                    disabled={screenInfo.name === activeItem ? 'disabled' : false}
                    >{screenInfo.name}
                  </Link>
                </button>
              ))
            }
          </div>
          <div className={style.screenRightLink}>
            <div className={style.rightBg1}></div>
            <div className={style.rightBg2}></div>
            <div className={style.rightBg3}></div>
            <a className={style.screenRightLinkTitle} href="http://www.baidu.com">资产管理</a>
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }
}

// export default BasicLayout;
export default connect()(BasicLayout);

