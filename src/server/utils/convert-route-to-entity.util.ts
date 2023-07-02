const mapping: Record<string, string> = {
  broadcasters: 'broadcaster',
  news: 'news',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
