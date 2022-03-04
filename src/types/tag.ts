export interface TagItem {
  _id: string;
  name: string;
}

export type Tag = {
  posts: string[]
} & TagItem;