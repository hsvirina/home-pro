/**
 * Paginates an array of items.
 *
 * @template T The type of items in the array
 * @param items The full array of items to paginate
 * @param page The current page number (1-based)
 * @param pageSize Number of items per page. If -1, returns all items
 * @returns A subset of items corresponding to the requested page
 */
export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  // If pageSize is -1, return all items
  if (pageSize === -1) return [...items];

  // Calculate the starting index for slicing
  const start = (page - 1) * pageSize;

  // Return a slice of items for the current page
  return items.slice(start, start + pageSize);
}
