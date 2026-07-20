export const mediaUrl = (value: unknown): string => {
  if (!value) return '';

  const path = typeof value === 'string'
    ? value
    : typeof value === 'object'
      ? Object.values(value as Record<string, unknown>).find(item => typeof item === 'string')
      : undefined;

  if (typeof path !== 'string') return '';

  if (/^(?:[a-z]+:)?\/\//i.test(path) || /^(?:data|blob):/i.test(path)) {
    return path;
  }

  return `/${path.replace(/^\/+/, '')}`;
};
