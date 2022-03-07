import { get, post } from './index';
import { Tag, TagItem } from '../types/tag'

export function getAllTags(): Promise<Tag[]> {
  return get('/posts/tags') as Promise<Tag[]>
}

export function postAddTag(postId: string, name: string): Promise<TagItem> {
  return get(`/posts/tag/add`, { postId, name }).then((tagId: string) => ({
    _id: tagId,
    name,
  }));
}

export function postsAddTags(postsId: string[], tagsId: string[]): Promise<TagItem[]> {
  return post(`/posts/tags/add`, { postsId, tagsId });
}

export function postAddTags(postId: string, tagsId: string[]): Promise<TagItem[]> {
  return postsAddTags([postId], tagsId);
}

export function newTag(name: string): Promise<TagItem> {
  return post(`/posts/tag/new/${name}`);
}

export function changeName(tagId: string, name: string): Promise<Tag> {
  return get(`/posts/tag/change`, { tagId, name }) as Promise<Tag>
}

export function removeTag(params: { tagId: string, postId: string }): Promise<Tag> {
  return post(`/posts/tag/remove`, params) as Promise<Tag>
}

export function getPost(id?: string): Promise<Tag | undefined> {
  if (id) {
    return get(`/posts/detail/${id}`) as Promise<Tag>
  }
  return Promise.resolve(undefined);
}


export function postPosts() {
  return post('/posts/list')
}