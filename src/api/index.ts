import axios, { AxiosResponse } from 'axios';
import qs from 'qs';
type RequestMethod = 'get' | 'post' | 'put' | 'delete' | 'head' | 'patch'

const HOST = 'http://localhost:5000/api'
const axiosInstance = axios.create({
  timeout: 30000,
  withCredentials: true,
});

axiosInstance.interceptors.response.use((response: AxiosResponse) => {
  const {
    data: { code },
  } = response;
  if (code === 0) {
    return response.data.data;
  }
  throw new Error('ajax fail')
}, (error) => {
  return Promise.reject(error);
});


export function request(method: RequestMethod, url: string, body?: any, config?: any): any {
  let queryUrl = `${HOST}${url}`
  if (method === 'delete') {
    return axiosInstance[method](queryUrl,{...config, data: body || {} })
  } else if (method === 'get') {
    let params = body ? qs.stringify(body) : ''
    if (params) {
      if (queryUrl.indexOf('?') < 0) {
        params = '?' + params
      } else if (!queryUrl.endsWith('?')) {
        params = '&' + params
      }
    }
    return axiosInstance[method](queryUrl + params, config)
  } else if(method === 'post' || method === 'put' || method === 'patch'){
    return axiosInstance[method](queryUrl, body, config)
  } else if (method === 'head' || method === 'option') {
    return axiosInstance[method](queryUrl, config)
  }
}

export function get(url: string, body?: any, config?: any): Promise<any> {
  return request('get', url, body, config);
}

export function post(url: string, body?: any, config?: any): Promise<any> {
  return request('post', url, body, config);
}
