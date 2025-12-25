import { Transform } from 'class-transformer';

export function Trim() {
  return Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : undefined,
  );
}
