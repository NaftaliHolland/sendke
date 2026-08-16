export function wrapWords(
  text: string,
  maxWidth: number,
  measure: (value: string) => number,
  maxLines: number
): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0 || maxLines < 1) return [];

  const lines: string[] = [];
  let current = "";

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const next = current ? `${current} ${word}` : word;
    if (!current || measure(next) <= maxWidth) {
      current = next;
      continue;
    }

    lines.push(current);
    current = word;

    if (lines.length === maxLines - 1) {
      current = [word, ...words.slice(i + 1)].join(" ");
      break;
    }
  }

  if (current) lines.push(current);

  const last = lines.length - 1;
  if (last >= 0 && measure(lines[last]) > maxWidth) {
    let clipped = lines[last];
    while (clipped.length > 1 && measure(`${clipped}…`) > maxWidth) {
      clipped = clipped.slice(0, -1);
    }
    lines[last] = `${clipped}…`;
  }

  return lines.slice(0, maxLines);
}

export function fitFontSize(
  text: string,
  maxWidth: number,
  startSize: number,
  minSize: number,
  measureAt: (size: number, value: string) => number
) {
  let size = startSize;
  while (size > minSize && measureAt(size, text) > maxWidth) {
    size -= 1;
  }
  return size;
}
