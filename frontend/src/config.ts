const config = {
  serverUrl: import.meta.env.VITE_SERVER_URL,

  jwt: {
    accessToken:
      import.meta.env.JWT_ACCESS_TOKEN || 'artist-management-system-token-123',
    refreshToken:
      import.meta.env.VITE_JWT_REFRESH_TOKEN ||
      'artist-management-system-secret-123',
  },

  endpoints: {
    registerUser: '/users/register',
    users: '/users',
    loginUser: '/users/login',
    artists: '/artists',
    userDetail: '/users/:id',
    artistDetail: '/artists/:id',
    createArtist: '/artists/create',
    createSong: '/artists/:artistId/songs/create',
    songs: '/artists/:artistId/songs',
    songDetail: '/artists/:artistId/songs/:songId',
  },
};

export default config;
