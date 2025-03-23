const config = {
  serverUrl: import.meta.env.VITE_SERVER_URL,

  endpoints: {
    registerUser: '/users/register',
    users: '/users',
    loginUser: '/users/login',
    logout: '/users/logout',
    artists: '/artists',
    userDetail: '/users/:id',
    artistDetail: '/artists/:id',
    createArtist: '/artists/create',
    createSong: '/artists/:artistId/songs/create',
    songs: '/songs',
    songDetail: '/artists/:artistId/songs/:songId',
  },
};

export default config;
