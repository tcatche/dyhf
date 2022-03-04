import { TagItem } from './tag'

export interface Post {
  _id: string;
  eid: string | number;
  title: string;
  url: string;
  content: string;
  size: number;
  date?: string;
  author?: string;
  tags: Array<TagItem>;
  delete: boolean;
}