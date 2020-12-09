import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-system/deptcategory/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/blade-system/deptcategory/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-system/deptcategory/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-system/deptcategory/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-system/deptcategory/submit',
    method: 'post',
    data: row
  })
}

export function getAllList() {
  return request({
    url: '/api/blade-system/deptcategory/getAllList',
    method: 'get',
  })
}

export function getDeptCanSelectList(parentId) {
  return request({
    url: '/api/blade-system/deptcategory/getDeptCanSelectList',
    method: 'get',
    params: {parentId}
  })
}

