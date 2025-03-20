import {
  DEFAULT_PAGE_LIMIT,
  DEFAULT_PAGE_START,
} from '../../constants/application';

import { fetchUsers } from '../apis/fetchUsers';

document.addEventListener('DOMContentLoaded', async () => {
  const userTable = document.querySelector('.user-list')! as HTMLTableElement;
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

  prevButton.addEventListener('click', async () => {
    if (currentPage > 1) {
      currentPage--;
      await fetchUsers(
        currentPage,
        limit,
        userTable,
        prevButton,
        nextButton,
        setTotalRecords,
      );
    }
  });

  nextButton.addEventListener('click', async () => {
    if (currentPage * limit < totalRecords) {
      currentPage++;
      await fetchUsers(
        currentPage,
        limit,
        userTable,
        prevButton,
        nextButton,
        setTotalRecords,
      );
    }
  });

  // Fetch initial users and set initial URL
  const urlParams = new URLSearchParams(window.location.search);
  currentPage = parseInt(
    urlParams.get('page') || DEFAULT_PAGE_START.toString(),
    10,
  );
  limit = parseInt(urlParams.get('limit') || DEFAULT_PAGE_LIMIT.toString(), 10);

  await fetchUsers(
    currentPage,
    limit,
    userTable,
    prevButton,
    nextButton,
    setTotalRecords,
  );
});
