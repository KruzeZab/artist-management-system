import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        login: '/src/pages/login.html',
        register: '/src/pages/register.html',
        artistCreate: '/src/pages/artist-create.html',
        artistDetail: '/src/pages/artist-detail.html',
        artistEdit: '/src/pages/artist-edit.html',
        artistList: '/src/pages/artist-list.html',
        songCreate: '/src/pages/song-create.html',
        songDetail: '/src/pages/song-detail.html',
        songEdit: '/src/pages/song-edit.html',
        songList: '/src/pages/song-list.html',
        userDetail: '/src/pages/user-detail.html',
        userList: '/src/pages/user-list.html',
        userEdit: '/src/pages/user-edit.html',
      },
    },
  },
});
