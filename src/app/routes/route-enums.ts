export enum RouteNames {
  FEED = 'feed',
  REGISTER = 'register',
  LOGIN = 'login',
  ARTICLE = 'article',
  EDITOR_NEW = 'editor-new',
  EDITOR = 'editor',
  SETTINGS = 'settings',
  PROFILE = 'profile',
  PROFILE_FAVORITES = 'profile-favorites',
}

export enum RoutePaths {
  FEED = '/',
  REGISTER = '/register',
  LOGIN = '/login',
  ARTICLE = '/article/:slug',
  EDITOR_NEW = '/editor',
  EDITOR = '/editor/:slug?',
  SETTINGS = '/settings',
  PROFILE = '/profile/:username',
  PROFILE_FAVORITES = '/profile/:username/favorites',
}
