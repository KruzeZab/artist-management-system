import config from '../../config';

import { GET } from '../../constants/methods';

import { User } from '../../interface/user';
import { UserListResponse } from '../../interface/response';

import { buildUrl } from '../utils/url';
import { fetchAPI } from '../utils/fetch';
import { getFullName, mapGender, mapRole } from '../utils/user';

/**
 * Fetches users from the server based on the provided page and limit.
 *
 */
export async function getUsers(page: number, limit: number) {
  const usersUrl = buildUrl(config.serverUrl, config.endpoints.users, {
    page: page.toString(),
    limit: limit.toString(),
  });

  try {
    const { data, meta } = await fetchAPI<UserListResponse>(
      usersUrl,
      GET,
      null,
      true,
    );
    return { users: data, totalRecords: meta?.totalRecords ?? 0 };
  } catch (error) {
    console.error('Error fetching users:', error);
    return null;
  }
}

/**
 * Updates the user table and pagination buttons based on the fetched user data.
 *
 */
export function updateUserTable(
  page: number,
  limit: number,
  users: User[],
  totalRecords: number,
  userTable: HTMLElement,
  prevButton: HTMLButtonElement,
  nextButton: HTMLButtonElement,
) {
  userTable.innerHTML = '';

  if (!users || !users.length) {
    userTable.innerHTML =
      '<td colspan="8" class="table-empty">No users found.</td>';
    prevButton.classList.add('d-none');
    nextButton.classList.add('d-none');
    return;
  }

  users.forEach((user, index) => {
    const row = document.createElement('tr');
    const userDetailLink = `/src/pages/user-detail.html?id=${user.id}`;
    row.innerHTML = `
      <td>${(page - 1) * limit + index + 1}</td>
      <td><a href="${userDetailLink}">${getFullName(
        user.firstName,
        user.lastName,
      )}</a></td>
      <td>${user.email}</td>
      <td>${user.phone}</td>
      <td>${user.dob}</td>
      <td>${mapGender(user.gender)}</td>
      <td>${user.address}</td>
      <td>${mapRole(user.role)}</td>
      <td><a href="/src/pages/user-detail.html?id=${user.id}" class="view-btn">View Detail</a></td>
    `;
    userTable.appendChild(row);
  });

  const isPrevBtnDisabled = page <= 1;
  const isNextBtnDisabled = page * limit >= totalRecords;

  if (isNextBtnDisabled) {
    nextButton.classList.add('d-none');
  }

  if (isPrevBtnDisabled) {
    prevButton.classList.add('d-none');
  }
}
