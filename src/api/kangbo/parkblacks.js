import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-kangbo-biz/parkblacks/list',
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
    url: '/api/blade-kangbo-biz/parkblacks/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-kangbo-biz/parkblacks/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-kangbo-biz/parkblacks/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-kangbo-biz/parkblacks/submit',
    method: 'post',
    data: row
  })
}

export const uploadFile = (row) => {
  return request({
    headers:{
      'Content-Type':'multipart/form-data'
    },
    url: '/api/blade-kangbo-biz/parkblacks/upload',
    method: 'post',
    params: {row}
  })
}

