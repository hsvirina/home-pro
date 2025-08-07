export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  if (pageSize === -1) return [...items];
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}
