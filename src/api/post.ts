import { get, post } from './index';
import { ResponsePage } from '../types/common'
import { Post } from '../types/post'

interface IPostQuery {
  keyword?: string;
  search?: string;
  tagName?: string;
  page?: number;
  limit?: number;
}
export function getPosts(params: IPostQuery): Promise<ResponsePage<Post>> {
  if (params.keyword) {
    return get(`/keywords/list`, params)
  }
  return get('/posts/list', params);
}

export function getPost(id?: string): Promise<Post | undefined> {
  if (id) {
    return get(`/posts/detail/${id}`) as Promise<Post>
  }
  return Promise.resolve(undefined);
}


export function postPosts() {
  return post('/posts/list')
}

export function deletePost(postId: string) {
  return post(`/posts/delete/${postId}`)
}