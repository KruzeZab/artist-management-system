import { updatePageUrl } from '../utils/pagination';
import { getUsers, updateUserTable } from '../utils/userList';

import {
  DEFAULT_PAGE_LIMIT,
  DEFAULT_PAGE_START,
} from '../../constants/application';

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

  const setTotalRecords = (newTotalRecords: number) => {
    totalRecords = newTotalRecords;
  };

  async function displayUsers() {
    const result = await getUsers(currentPage, limit);

    if (result) {
      const { users, totalRecords: records } = result;
      setTotalRecords(records);
      updateUserTable(
        currentPage,
        limit,
        users,
        totalRecords,
        userTable,
        prevButton,
        nextButton,
      );

      updatePageUrl({
        page: currentPage.toString(),
        limit: limit.toString(),
      });

      updateUserTable(
        currentPage,
        limit,
        users,
        totalRecords,
        userTable,
        prevButton,
        nextButton,
      );
    } else {
      userTable.innerHTML =
        '<td colspan="8" class="table-error">Failed to load users.</td>';
      prevButton.disabled = true;
      nextButton.disabled = true;
    }
  }

  prevButton.addEventListener('click', async () => {
    if (currentPage > 1) {
      currentPage--;
      await displayUsers();
    }
  });

  nextButton.addEventListener('click', async () => {
    if (currentPage * limit < totalRecords) {
      currentPage++;
      await displayUsers();
    }
  });

  const urlParams = new URLSearchParams(window.location.search);

  currentPage = parseInt(
    urlParams.get('page') || DEFAULT_PAGE_START.toString(),
    10,
  );
  limit = parseInt(urlParams.get('limit') || DEFAULT_PAGE_LIMIT.toString(), 10);

  await displayUsers();
});
