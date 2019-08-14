import Link from 'umi/link'
import withRouter from 'umi/withRouter';
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
function BasicLayout(props) {
  const activeItem = props.data || '数据概览'
  console.log(11, activeItem);
  
  return (
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
      {props.children}
    </div>
  );
}

export default BasicLayout;
// export default withRouter(BasicLayout);
