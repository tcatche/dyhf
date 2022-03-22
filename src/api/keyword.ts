import { get, post } from './index';
import { Keyword, KeywordItem } from '../types/keyword'

export function getAll(): Promise<Keyword[]> {
  return get('/keywords/all') as Promise<Keyword[]>
}

export function getPosts(name: string): Promise<KeywordItem> {
  return get(`/keywords/list/${name}`);
}

export function remove(id: string): Promise<Keyword> {
  return post(`/keywords/delete/${id}`) as Promise<Keyword>
}

export function merge(keywords: string[]): Promise<Keyword> {
  return post(`/keywords/merge`, { keywords }) as Promise<Keyword>
}