import request from '../utils/request';
import { PAGE_SIZE } from '../constants';

export function fetchUsers({ page }) {
  return request(`/api/users?_page=${page}&_limit=${PAGE_SIZE}`);
}
