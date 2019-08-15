import request from '../../../utils/request';
// import request from '@/utils/request';

// 数据流入 左边产业和部门列表
export function apiDeptLeft() {
  return request(`/api/flow/in/dept`);
}
// 数据流出 右边部门列表
export function apiDeptRight() {
  return request(`/api/flow/out/dept`)
}
// 数据流出 右边应用列表
export function apiAppRight() {
  return request(`/api/flow/out/app`)
}
// 数据流入 状态等关系
export function apiLeftStatus({ nodeId }) {
  return request(`/api/flow/in/data?nodeId=${nodeId}`)
}
// 数据流出 状态等关系
export function apiRightStatus({ nodeId }) {
  return request(`/api/flow/out/data?nodeId=${nodeId}`)
}
// 钻石数据
export function apiMiddleDiamond() {
  return request(`/api/flow/middle/category`)
}
// export function patch(id, values) {
//   return request(`/api/users/${id}`, {
//     method: 'PATCH',
//     body: JSON.stringify(values)
//   })
// }