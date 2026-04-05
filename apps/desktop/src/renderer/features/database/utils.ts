export function groupByLetter<T>(
  items: T[],
  getKey: (item: T) => string,
): Array<{ letter: string; items: T[] }> {
  const map = new Map<string, T[]>();

  for (const item of items) {
    const letter = getKey(item)[0]?.toUpperCase() ?? '#';
    const group = map.get(letter) ?? [];
    group.push(item);
    map.set(letter, group);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letter, items]) => ({ letter, items }));
}
