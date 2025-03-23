import config from '../../config';

import Modal from '../components/modal';

import { GET, DELETE } from '../../constants/methods';

import {
  DeleteUserResponse,
  SingleUserResponse,
} from '../../interface/response';

import { buildUrl, interpolate } from '../utils/url';
import { fetchAPI } from '../utils/fetch';
import { getCurrentUser, mapGender, mapRole } from '../utils/user';

document.addEventListener('DOMContentLoaded', async () => {
  const currentUser = getCurrentUser();
  const container = document.querySelector('.container')!;
  const userDetailTitle = document.getElementById('user-detail-title')!;
  const userDetailInfo = document.querySelector('.user-detail__info')!;
  const editBtn = document.getElementById('user-edit')!;
  const deleteBtn = document.getElementById('user-delete')!;

  const urlParams = new URLSearchParams(window.location.search);
  const userId = parseInt(urlParams.get('id') || '', 10);

  editBtn.setAttribute('href', `/src/pages/user-edit.html?id=${userId}`);

  if (currentUser?.id === userId) {
    deleteBtn.classList.add('d-none');
  }

  if (!userId) {
    console.error('User ID is missing or invalid');
    container.innerHTML = '<p class="error-message">User not Found!s</p>';
    return;
  }

  try {
    const userUrl = buildUrl(
      config.serverUrl,
      interpolate(config.endpoints.userDetail, { id: userId.toString() }),
    );

    const { data: userDetails } = await fetchAPI<SingleUserResponse>(
      userUrl,
      GET,
      null,
      true,
    );

    if (!userDetails) {
      console.error('Failed to fetch user details');
      container.innerHTML =
        '<p class="table-error">Failed to fetch user details.</p>';
      return;
    }

    userDetailTitle.textContent = `${userDetails.firstName} ${userDetails.lastName}'s Detail`;

    userDetailInfo.innerHTML = `
          <p>Full Name: <strong>${userDetails.firstName} ${userDetails.lastName}</strong></p>
          <p>Gender: <strong>${mapGender(userDetails.gender)}</strong></p>
          <p>Role: <strong>${mapRole(userDetails.role)}</strong></p>
          <p>Email: <strong>${userDetails.email}</strong></p>
          <p>Phone: <strong>${userDetails.phone}</strong></p>
          <p>Date of Birth: <strong>${userDetails.dob}</strong></p>
          <p>Address: <strong>${userDetails.address}</strong></p>
        
    `;

    const deleteModal = new Modal({
      id: 'modal',
      title: 'Delete User',
      content: 'Are you sure you want to delete this user?',
      actions: ` <button class="btn btn-danger" type="button" id="modal-delete">Delete</button>
            <button class="btn btn-muted" type="button">Cancel</button>`,
    });

    deleteBtn.addEventListener('click', () => {
      deleteModal.show();

      const modalDelete = document.getElementById('modal-delete')!;

      modalDelete.addEventListener('click', async () => {
        const deleteUrl = buildUrl(
          config.serverUrl,
          interpolate(config.endpoints.userDetail, { id: userId.toString() }),
        );

        try {
          const response = await fetchAPI<DeleteUserResponse>(
            deleteUrl,
            DELETE,
            null,
            true,
          );

          if (response.success) {
            window.location.href = '/src/pages/user-list.html';
          } else {
            console.error('Failed to delete user');
          }
        } catch (error) {
          console.error('Error deleting user:', error);
        }
      });
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    container.innerHTML = `<p class="error-message">Error: ${
      error instanceof Error ? error.message : 'An unexpected error occurred.'
    }</p>`;
  }
});
