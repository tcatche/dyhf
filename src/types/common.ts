export interface ResponsePage<T> {
  data: T[],
  page: number,
  limit: number,
  count: number,
}