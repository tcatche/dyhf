import axios, { AxiosResponse } from 'axios';
import qs from 'qs';
import { AES, enc } from 'crypto-js';
import { message } from 'antd';

type RequestMethod = 'get' | 'post' | 'put' | 'delete' | 'head' | 'patch'

const HOST = localStorage.getItem('api') || 'http://localhost:5000/api'
const axiosInstance = axios.create({
  timeout: 30000,
  withCredentials: true,
});

axiosInstance.interceptors.response.use((response: AxiosResponse) => {
  const SECRET = localStorage.getItem('secret') || '';
  const {
    data: { code, data },
  } = response;
  if (code === 0) {
    console.log(SECRET)
    const bytes  = AES.decrypt(data, SECRET);
    try {
      const decryptedData = JSON.parse(bytes.toString(enc.Utf8));
      return decryptedData;
    } catch(e) {
      message.error(`SECRET错误： ${SECRET}`)
    }
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
