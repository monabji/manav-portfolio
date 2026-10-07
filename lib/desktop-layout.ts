// Stable, collision-free desktop placement. No random changes on each render.
export function desktopHash(value: string) {
  let hash = 2166136261;
  for (const character of value) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  return hash >>> 0;
}
export function scatterDesktop(keys: string[], width: number, height: number) {
  const tile = { width: 84, height: 96 };
  const pitch = 112;
  const columns = Math.max(1, Math.floor((width - 8) / pitch));
  const rows = Math.max(1, Math.floor((height - 16) / pitch), Math.ceil(keys.length / columns));
  const canvasHeight = Math.max(height, rows * pitch + 16);
  const slots = Array.from({ length: columns * rows }, (_, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const seed = desktopHash(`desktop-slot-${column}-${row}`);
    // Favor irregular spots at the edges, leaving the central window readable.
    const edge = column < 2 || column === columns - 1;
    const x = column === columns - 1 ? width - tile.width - 8 - seed % 9 : column * pitch + 4 + seed % 13;
    const availableY = Math.max(0, canvasHeight - tile.height - 24);
    const y = (rows === 1 ? 0 : row * availableY / (rows - 1)) + 4 + (seed >>> 8) % 13;
    return { x, y, priority: (edge ? 0 : 1) * 4294967296 + desktopHash(`placement-${index}`) };
  }).sort((a, b) => a.priority - b.priority);
  const positions: Record<string, { x: number; y: number }> = {};
  [...keys].sort((a, b) => desktopHash(a) - desktopHash(b)).forEach((key, index) => {
    positions[key] = { x: slots[index].x, y: slots[index].y };
  });
  return { positions, canvasHeight };
}
