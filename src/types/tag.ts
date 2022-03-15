export interface TagItem {
  _id: string;
  name: string;
  size: number;
}

export type Tag = {
  posts: string[]
} & TagItem;