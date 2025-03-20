import config from '../../config';

import { GET } from '../../constants/methods';
import { DEFAULT_PAGE_START } from '../../constants/application';

import { UserListResponse } from '../../interface/response';

import { buildUrl } from '../utils/url';
import { fetchAPI } from '../utils/fetch';
import { getFullName, mapGender, mapRole } from '../utils/user';

export async function fetchUsers(
  page: number,
  limit: number,
  userTable: HTMLTableElement,
  prevButton: HTMLButtonElement,
  nextButton: HTMLButtonElement,
  setTotalRecords: (totalRecords: number) => void,
) {
  const usersUrl = buildUrl(config.serverUrl, config.endpoints.users, {
    page: page.toString(),
    limit: limit.toString(),
  });

  const newUrl = buildUrl(window.location.origin + window.location.pathname, {
    page: page.toString(),
    limit: limit.toString(),
  });
  window.history.pushState({ page, limit }, '', newUrl);

  userTable.innerHTML =
    '<td colspan="8" class="table-loading">Loading users...</td>';
  prevButton.disabled = true;
  nextButton.disabled = true;

  try {
    const { data, meta } = await fetchAPI<UserListResponse>(
      usersUrl,
      GET,
      null,
      true,
    );

    if (data && Array.isArray(data)) {
      const totalRecords = meta?.totalRecords ?? 0;
      setTotalRecords(totalRecords);
      userTable.innerHTML = '';

      if (!data.length && page === DEFAULT_PAGE_START) {
        userTable.innerHTML =
          '<td colspan="8" class="table-empty">No users found.</td>';
        prevButton.disabled = true;
        nextButton.disabled = true;
        return;
      } else if (!data.length && page > DEFAULT_PAGE_START) {
        await fetchUsers(
          page - 1,
          limit,
          userTable,
          prevButton,
          nextButton,
          setTotalRecords,
        );
        return;
      }

      data.forEach((user, index) => {
        const row = document.createElement('tr');

        const userDetailLink = `/src/pages/user-detail.html?id=${user.id}`;

        row.innerHTML = `
            <td>${(page - 1) * limit + index + 1}</td>
            <td><a href="${userDetailLink}">${getFullName(user.firstName, user.lastName)}</a></td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.dob}</td>
            <td>${mapGender(user.gender)}</td>
            <td>${user.address}</td>
            <td>${mapRole(user.role)}</td>
          `;
        userTable.appendChild(row);
      });

      prevButton.disabled = page <= 1;
      nextButton.disabled = page * limit >= totalRecords;
    } else {
      console.error("Couldn't fetch users");
      userTable.innerHTML =
        '<td colspan="8" class="table-error">Cannot show users</td>';
      prevButton.disabled = true;
      nextButton.disabled = true;
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    prevButton.disabled = true;
    nextButton.disabled = true;
  }
}
