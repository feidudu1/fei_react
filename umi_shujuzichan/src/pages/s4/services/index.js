import request from '../../../utils/request';
// import request from '@/utils/request';

// 数据流入 左边产业和部门列表
export function apiDeptLeft() {
  return request(`/api/flow/in/dept`);
}
// export function remove(id) {
//   return request(`/api/users/${id}`, {
//     method: 'DELETE',
//   })
// }
// export function patch(id, values) {
//   return request(`/api/users/${id}`, {
//     method: 'PATCH',
//     body: JSON.stringify(values)
//   })
// }