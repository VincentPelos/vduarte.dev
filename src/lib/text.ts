export interface Plural {
  one: string;
  other: string;
}

/** `3 roles`, `1 rol`: número con la forma singular o plural. */
export function pluralize(count: number, { one, other }: Plural): string {
  return `${count} ${count === 1 ? one : other}`;
}
