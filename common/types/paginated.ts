export default interface Paginated<
  D = any,
  S extends string = string,
  F = any
> {
  page: number;
  pageSize: number;
  total: number;
  sort: S;
  filters?: F[];
  rows: D[];
}
