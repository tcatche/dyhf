export interface KeywordItem {
  _id: string;
  name: string;
}

export type Keyword = {
  posts: string[]
} & KeywordItem;