import { nanoid } from 'nanoid';

export const createLinkHash = (url: string): string => {
  const timeMs = Date.now();
  const hash = nanoid(8);
  return `${timeMs}${hash}`;
};