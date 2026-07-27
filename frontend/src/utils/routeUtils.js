export function getObfuscatedRoute(user, path) {
  // Generates an obfuscated string to hide the middle path
  const identifier = user?.email ? user.email + "-session" : Math.random().toString(36).substring(2);
  const sessionHash = btoa(identifier).replace(/=/g, '');
  return `/app/${sessionHash}${path}`;
}
