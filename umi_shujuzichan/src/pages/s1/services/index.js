import request from '../../../utils/request';
// import request from '@/utils/request';

// 部门列表
export function apiDepartmentList() {
  return request(`/api/department/deptList`);
}
// 部门总体情况banner--------------------------------------------
// 来源字段
export function apiBanner3({deptId}) {
  if (deptId) {
    return request(`/api/nodeField/count?deptId=${deptId}`)
  } else {
    return request(`/api/nodeField/count`)
  }
}
// 来源表数
export function apiBanner2({deptId}) {
  if (deptId) {
    return request(`/api/nodeTable/count?deptId=${deptId}`)
  } else {
    return request(`/api/nodeTable/count`)
  }
}
// 来源数据量 条
export function apiBanner42({deptId}) {
  if (deptId) {
    return request(`/api/nodeRecord/count?deptId=${deptId}`)
  } else {
    return request(`/api/nodeRecord/count`)
  }
}
// 来源数据量 T
export function apiBanner41({deptId}) {
  if (deptId) {
    return request(`/api/nodeRecord/size?deptId=${deptId}`)
  } else {
    return request(`/api/nodeRecord/size`)
  }
}
// 昨日增量
export function apiBanner5({deptId}) {
  if (deptId) {
    return request(`/api/nodeRecord/dailyCount?deptId=${deptId}`)
  } else {
    return request(`/api/nodeRecord/dailyCount`)
  }
}

// 总体情况========================================================
// 数据质量概况 雷达图
export function apiDataQuality() {
  return request(`/api/summary/quotaList`)
}
// 部门总体情况banner
// 来源部门数
export function apiBanner1() {
  return request(`/api/dept/count`)
}
// 数据来源类型数
export function apiSourceType() {
  return request(`/api/record/srcType`)
}
// 当周更新表列表
export function apiUpdateTable() {
  return request(`/api/table/modifyList?limit=300&order=desc`)
}
// 接入数据趋势
export function apiTrend({type, period}) {
  return request(`/api/record/trend?type=${type}&period=${period}`)
}
// 来源部门占比
export function apiSourceDepartment({type}) {
  return request(`/api/record/deptRatio?type=${type}&limit=10`)
}
// 来源部门增量排名
export function apiDepartmentRank({type, order}) {
  return request(`/api/dept/ranking?type=${type}&limit=6&order=${order}`)
}
// 数据表排名
export function apiTableTop({type, order}) {
  return request(`/api/table/ranking?type=${type}&limit=6&order=${order}`)
}

// 各部门情况========================================================
// 数据质量概况 雷达图
export function apiQuotaList({deptId}) {
  return request(`/api/department/quotaList?deptId=${deptId}`)
}
// 问题数据量趋势
export function apiProblemTrend({deptId, period}) {
  return request(`/api/department/problemTrend?deptId=${deptId}&period=${period}`)
}
// 问题数据列表
export function apiProblemTable({deptId, period}) {
  return request(`/api/department/problemTable?deptId=${deptId}&period=${period}`)
}
// 接入数据趋势
export function apiAccessTrend({deptId, period, type}) {
  return request(`/api/department/trend?deptId=${deptId}&period=${period}&type=${type}`)
}
// 接入数据趋势
export function apiQualityTop({deptId, order, type}) {
  return request(`/api/department/qualityTop?deptId=${deptId}&order=${order}&type=${type}&limit=6`)
}
// 表数据量占比
export function apiTableRatio({deptId, order}) {
  return request(`/api/department/tableSizePercent?deptId=${deptId}&order=${order}&limit=6`)
}