import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import qs from 'qs';
import { AES, enc } from 'crypto-js';
import { notification } from 'antd';

type RequestMethod = 'get' | 'post' | 'put' | 'delete' | 'head' | 'patch'

const HOST = localStorage.getItem('api') || 'http://localhost:5000/api'
const axiosInstance = axios.create({
  timeout: 30000,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config: AxiosRequestConfig<any>) => {
  const SECRET = localStorage.getItem('secret') || '';
  if (config.method === 'get') {
    let params = `data=${encodeURIComponent(AES.encrypt(JSON.stringify(config.data || {}), SECRET).toString())}`
    const url = config.url as string;
    if (url.indexOf('?') < 0) {
      params = '?' + params
    } else if (!url.endsWith('?')) {
      params = '&' + params
    }
    config.url = `${url}${params}`
  } else {
    config.data = {
      data: AES.encrypt(JSON.stringify(config.data || {}), SECRET).toString(),
    }
  }
  return config;
});

axiosInstance.interceptors.response.use((response: AxiosResponse) => {
  const SECRET = localStorage.getItem('secret') || '';
  const {
    data: { code, data, message: errorMessage },
  } = response;
  if (code === 0) {
    const bytes  = AES.decrypt(data, SECRET);
    try {
      const decryptedData = JSON.parse(bytes.toString(enc.Utf8));
      return decryptedData;
    } catch(e) {
      notification.error({ message: '请求失败', description: `SECRET错误： ${SECRET}`})
    }
  }
  notification.error({ message: '请求失败', description: errorMessage})
  throw new Error(errorMessage)
}, (error) => {
  console.log(error)
  return Promise.reject(error);
});


export function request(method: RequestMethod, url: string, body?: any, config?: any): any {
  let queryUrl = `${HOST}${url}`
  if (method === 'delete') {
    return axiosInstance[method](queryUrl,{...config, data: body || {} })
  } else if (method === 'get') {
    return axiosInstance[method](queryUrl, {...config, data: body || {} })
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
