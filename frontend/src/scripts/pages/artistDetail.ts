import config from '../../config';

import Modal from '../components/modal';

import { GET, DELETE } from '../../constants/methods';

import { fetchAPI } from '../utils/fetch';
import { buildUrl, interpolate } from '../utils/url';
import { hideForRoles } from '../utils/authorization';
import { getFullName, mapGender } from '../utils/user';

import {
  DeleteArtistResponse,
  SingleArtistResponse,
} from '../../interface/response';
import { Role } from '../../interface/user';

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.querySelector('.container')!;
  const userDetailTitle = document.getElementById('user-detail-title')!;
  const userDetailInfo = document.querySelector('.user-detail__info')!;

  const viewSongsBtn = document.querySelector('.page-header__cta')!;
  const editBtn = document.getElementById('user-edit')!;
  const deleteBtn = document.getElementById('user-delete')!;
  const artistCta = document.querySelector(
    '.artist-detail-cta',
  )! as HTMLElement;

  hideForRoles(artistCta, [Role.ARTIST_MANAGER]);

  const urlParams = new URLSearchParams(window.location.search);

  const artistId = parseInt(urlParams.get('id') || '', 10);

  editBtn.setAttribute('href', `/src/pages/artist-edit.html?id=${artistId}`);
  viewSongsBtn.setAttribute(
    'href',
    `/src/pages/song-list.html?artistId=${artistId}`,
  );

  if (!artistId) {
    console.error('User ID is missing or invalid');
    container.innerHTML = '<p class="error-message">Artist not Found!s</p>';
    return;
  }

  try {
    const artistUrl = buildUrl(
      config.serverUrl,
      interpolate(config.endpoints.artistDetail, { id: artistId.toString() }),
    );

    const { data: artistDetails } = await fetchAPI<SingleArtistResponse>(
      artistUrl,
      GET,
      null,
      true,
    );

    if (!artistDetails) {
      console.error('Failed to fetch artist details');
      container.innerHTML =
        '<p class="table-error">Failed to fetch artist details.</p>';
      return;
    }

    userDetailTitle.textContent = `${getFullName(artistDetails.firstName, artistDetails.lastName)}'s Detail`;

    userDetailInfo.innerHTML = `
          <p>Full Name: <strong>${getFullName(artistDetails.firstName, artistDetails.lastName)}</strong></p>
          <p>Gender: <strong>${mapGender(artistDetails.gender)}</strong></p>
          <p>Date of Birth: <strong>${artistDetails.dob}</strong></p>
          <p>Address: <strong>${artistDetails.address}</strong></p>
          <p>First Release Year: <strong>${artistDetails.firstReleaseYear}</strong></p>
          <p>No of Albums Released: <strong>${artistDetails.noOfAlbumsReleased}</strong></p>
        
    `;

    const deleteModal = new Modal({
      id: 'modal',
      title: 'Delete Artist',
      content: 'Are you sure you want to delete this artist?',
      actions: ` <button class="btn btn-danger" type="button" id="modal-delete">Delete</button>
            <button class="btn btn-muted" type="button">Cancel</button>`,
    });

    deleteBtn.addEventListener('click', () => {
      deleteModal.show();

      const modalDelete = document.getElementById('modal-delete')!;

      modalDelete.addEventListener('click', async () => {
        const deleteUrl = buildUrl(
          config.serverUrl,
          interpolate(config.endpoints.userDetail, {
            id: artistDetails.userId,
          }),
        );

        try {
          const response = await fetchAPI<DeleteArtistResponse>(
            deleteUrl,
            DELETE,
            null,
            true,
          );

          if (response.success) {
            window.location.href = '/src/pages/artist-list.html';
          } else {
            console.error('Failed to delete artist');
          }
        } catch (error) {
          console.error('Error deleting user:', error);
        }
      });
    });
  } catch (error) {
    console.error('Error fetching artist details:', error);
    container.innerHTML = `<p class="error-message">Error: ${
      error instanceof Error ? error.message : 'An unexpected error occurred.'
    }</p>`;
  }
});
