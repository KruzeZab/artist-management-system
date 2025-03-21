import {
  DEFAULT_PAGE_LIMIT,
  DEFAULT_PAGE_START,
} from '../../constants/application';

import { updatePageUrl } from '../utils/pagination';
import { getSongs, updateSongsTable } from '../utils/songList';

document.addEventListener('DOMContentLoaded', async () => {
  const userTable = document.querySelector('.user-list')! as HTMLElement;

  const prevButton = document.querySelector(
    '.pagination__item:nth-child(1)',
  ) as HTMLButtonElement;
  const nextButton = document.querySelector(
    '.pagination__item:nth-child(2)',
  ) as HTMLButtonElement;

  let currentPage = DEFAULT_PAGE_START;
  let limit = DEFAULT_PAGE_LIMIT;
  let totalRecords = 0;

  const urlParams = new URLSearchParams(window.location.search);

  const artistId = parseInt(urlParams.get('artistId') || '', 10);

  currentPage = parseInt(
    urlParams.get('page') || DEFAULT_PAGE_START.toString(),
    10,
  );
  limit = parseInt(urlParams.get('limit') || DEFAULT_PAGE_LIMIT.toString(), 10);

  const setTotalRecords = (newTotalRecords: number) => {
    totalRecords = newTotalRecords;
  };

  async function displaySongs() {
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

      updatePageUrl({
        page: currentPage.toString(),
        limit: limit.toString(),
        artistId: artistId.toString(),
      });
    } else {
      userTable.innerHTML =
        '<td colspan="8" class="table-error">Failed to load songs.</td>';
      prevButton.disabled = true;
      nextButton.disabled = true;
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
});
