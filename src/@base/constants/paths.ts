export const Paths = {
  root: '/',

  auth: {
    login: '/auth/sign-in/',
    signup: '/auth/sign-up/',
    validate: '/auth/validate/',
    resetPass: '/auth/reset-password/',
  },
  meeting: {
    room: '/room/',
    toRoomPage: (name) => `/room/${name}/`,
  },
};

export function pathToUrl(path: string): string {
  path = path.startsWith('/') ? path : `/${path}`;
  return `${process.env.NEXT_PUBLIC_APP_ORIGIN}${path}`;
}

export const PrivatePaths = [
  Paths.meeting.room,
  Paths.auth.login,
  Paths.auth.signup,
  Paths.auth.validate,
  Paths.auth.resetPass,
];
