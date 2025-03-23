import {
  DEFAULT_PAGE_LIMIT,
  DEFAULT_PAGE_START,
} from '../../constants/application';
import { Role } from '../../interface/user';
import { hideForRoles } from '../utils/authorization';

import { updatePageUrl } from '../utils/pagination';
import { getSongs, updateSongsTable } from '../utils/songList';

document.addEventListener('DOMContentLoaded', async () => {
  const userTable = document.querySelector('.user-list')! as HTMLElement;

  const songListCta = document.getElementById('song-list-cta')! as HTMLElement;
  const addSongLink = document.querySelector(
    '.page-header__cta',
  )! as HTMLAnchorElement;

  const prevButton = document.querySelector(
    '.pagination__item:nth-child(1)',
  ) as HTMLButtonElement;
  const nextButton = document.querySelector(
    '.pagination__item:nth-child(2)',
  ) as HTMLButtonElement;

  hideForRoles(songListCta, [Role.ARTIST_MANAGER]);

  let currentPage = DEFAULT_PAGE_START;
  let limit = DEFAULT_PAGE_LIMIT;
  let totalRecords = 0;

  const urlParams = new URLSearchParams(window.location.search);

  currentPage = parseInt(
    urlParams.get('page') || DEFAULT_PAGE_START.toString(),
    10,
  );
  limit = parseInt(urlParams.get('limit') || DEFAULT_PAGE_LIMIT.toString(), 10);

  const setTotalRecords = (newTotalRecords: number) => {
    totalRecords = newTotalRecords;
  };

  const artistId = parseInt(urlParams.get('artistId') || '', 10);

  async function displaySongs() {
    if (!artistId) {
      userTable.innerHTML =
        '<td colspan="8" class="table-error">Unable to load songs.</td>';
    }

    const result = await getSongs(currentPage, limit, artistId);

    if (result) {
      const { songs, totalRecords: records } = result;

      setTotalRecords(records);
      updateSongsTable(
        currentPage,
        limit,
        songs,
        totalRecords,
        userTable,
        prevButton,
        nextButton,
      );

      const params: Record<string, string> = {
        page: currentPage.toString(),
        limit: limit.toString(),
      };

      if (artistId) {
        params.artistId = artistId.toString();
      }

      updatePageUrl(params);
    } else {
      userTable.innerHTML =
        '<td colspan="8" class="table-error">Failed to load songs.</td>';

      prevButton.classList.add('d-none');
      nextButton.classList.add('d-none');
    }
  }

  prevButton.addEventListener('click', async () => {
    if (currentPage > 1) {
      currentPage--;
      await displaySongs();
    }
  });

  nextButton.addEventListener('click', async () => {
    if (currentPage * limit < totalRecords) {
      currentPage++;
      await displaySongs();
    }
  });

  await displaySongs();

  if (!artistId) {
    userTable.innerHTML =
      '<td colspan="8" class="table-error">Unable to load songs.</td>';
    songListCta.classList.add('d-none');
  }

  addSongLink.setAttribute(
    'href',
    `/src/pages/song-create.html?artistId=${artistId}`,
  );
});
