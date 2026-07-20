export const mediaUrl = (path: string | null | undefined): string => {
  if (!path) return '';

  if (/^(?:[a-z]+:)?\/\//i.test(path) || /^(?:data|blob):/i.test(path)) {
    return path;
  }

  return `/${path.replace(/^\/+/, '')}`;
};
