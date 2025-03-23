import { updatePageUrl } from '../utils/pagination';
import { getArtists, updateArtistTable } from '../utils/artistList';

import {
  DEFAULT_PAGE_LIMIT,
  DEFAULT_PAGE_START,
} from '../../constants/application';
import { getCurrentUser } from '../utils/user';

document.addEventListener('DOMContentLoaded', async () => {
  const artistTable = document.querySelector('.user-list')! as HTMLElement;

  const prevButton = document.querySelector(
    '.pagination__item:nth-child(1)',
  ) as HTMLButtonElement;
  const nextButton = document.querySelector(
    '.pagination__item:nth-child(2)',
  ) as HTMLButtonElement;

  let currentPage = DEFAULT_PAGE_START;
  let limit = DEFAULT_PAGE_LIMIT;
  let totalRecords = 0;

  const setTotalRecords = (newTotalRecords: number) => {
    totalRecords = newTotalRecords;
  };

  async function displayArtists() {
    const result = await getArtists(currentPage, limit);

    if (result) {
      const { artists, totalRecords: records } = result;

      setTotalRecords(records);

      updateArtistTable(
        currentPage,
        limit,
        artists,
        totalRecords,
        artistTable,
        prevButton,
        nextButton,
        getCurrentUser(),
      );

      updatePageUrl({
        page: currentPage.toString(),
        limit: limit.toString(),
      });
    } else {
      artistTable.innerHTML =
        '<td colspan="8" class="table-error">Failed to load artists.</td>';

      prevButton.classList.add('d-none');
      nextButton.classList.add('d-none');
    }
  }

  prevButton.addEventListener('click', async () => {
    if (currentPage > 1) {
      currentPage--;
      await displayArtists();
    }
  });

  nextButton.addEventListener('click', async () => {
    if (currentPage * limit < totalRecords) {
      currentPage++;
      await displayArtists();
    }
  });

  const urlParams = new URLSearchParams(window.location.search);

  currentPage = parseInt(
    urlParams.get('page') || DEFAULT_PAGE_START.toString(),
    10,
  );
  limit = parseInt(urlParams.get('limit') || DEFAULT_PAGE_LIMIT.toString(), 10);

  await displayArtists();
});
