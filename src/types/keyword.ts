export interface KeywordItem {
  _id: string;
  name: string;
  size: number
}

export type Keyword = {
  posts: string[]
} & KeywordItem;