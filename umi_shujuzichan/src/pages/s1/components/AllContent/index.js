import { connect } from 'dva';
import Link from 'umi/link'
// import { routerRedux } from 'dva/router';
import RectCanvas from '../../components/RectCanvas/index'
import style from './index.less';

function AllContent({activeDepartment}) {
  const page = activeDepartment.id ? 2 : 1
  let head
  if (page === 1) {
    head = [
      {
        name: '数据质量概况',
        left: '160px',
        top: '384px'
      },
      {
        name: '数据来源类型数',
        left: '1504px',
        top: '622px'
      },
      {
        name: '近七天更新表列表',
        left: '2488px',
        top: '622px'
      },
      {
        name: '接入数据趋势',
        left: '160px',
        top: '1502px'
      },
      {
        name: '数据来源部门占比',
        left: '1490px',
        top: '1302px'
      },
      {
        name: '来源部门增量排名',
        left: '2290px',
        top: '1302px'
      },
      {
        name: '数据表总量排名',
        left: '3080px',
        top: '1302px'
      },
    ]
  } else {
    head = [{
        name: '数据质量概况',
        left: '160px',
        top: '384px'
      },
      {
        name: '问题数据量趋势',
        left: '1504px',
        top: '622px'
      },
      {
        name: '问题数据列表',
        left: '2540px',
        top: '622px'
      },
      {
        name: '接入数据趋势',
        left: '160px',
        top: '1502px'
      },
      {
        name: '数据表质量排名',
        left: '1490px',
        top: '1302px'
      },
      {
        name: '表数据量排名',
        left: '2290px',
        top: '1302px'
      }
    ]
  }
   return (
    <div className={`${style.allContent} ${page === 2 ? `${style.bg2}` : `${style.bg1}`}`}>
      <div className={style.allSecondLink}>
        <div className={style.typeFirstName}>来源分析</div>
        <Link to="s4" className={style.returnBox}>返回</Link>
      </div>
      {
        head.map(t => {
          return <div className={style.thirdTitle} style={{left: t.left, top: t.top}} key={t.name}>{t.name}</div>
        })
      }
      <div className={style.canvas}>
        <RectCanvas />
      </div>
    </div>
  );
}

 function mapStateToProps(state) {
  const { activeDepartment } = state.s1;
  return {
    activeDepartment,
    // total,
    // page,
    // loading: state.loading.models.users,
  };
}

export default connect(mapStateToProps)(AllContent);