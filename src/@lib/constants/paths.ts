export const Paths = {
  root: '/',
  maintenance: '/maintenance',

  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    validate: '/auth/validate',
    resetPass: '/auth/reset-password',
  },
  webCall: {
    root: '/web-call',
    waitingPage: '/web-call/waiting-room',
    toWebCallPage: (id) => `/web-call/rooms/${id}`,
  },
};

export function pathToUrl(path: string): string {
  path = path.startsWith('/') ? path : `/${path}`;
  return `${process.env.NEXT_PUBLIC_APP_ORIGIN}${path}`;
}
