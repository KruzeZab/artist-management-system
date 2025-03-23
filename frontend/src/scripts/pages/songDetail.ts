import config from '../../config';

import Modal from '../components/modal';

import { GET, DELETE } from '../../constants/methods';

import { fetchAPI } from '../utils/fetch';
import { buildUrl, interpolate } from '../utils/url';

import {
  DeleteArtistResponse,
  SingleSongResponse,
} from '../../interface/response';
import { hideForRoles } from '../utils/authorization';
import { Role } from '../../interface/user';
import { getFullName } from '../utils/user';

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.querySelector('.container')!;
  const userDetailTitle = document.getElementById('user-detail-title')!;
  const userDetailInfo = document.querySelector('.user-detail__info')!;
  const userDetailCta = document.querySelector(
    '.user-detail__cta',
  )! as HTMLElement;
  const editBtn = document.getElementById('user-edit')!;
  const deleteBtn = document.getElementById('user-delete')!;

  const urlParams = new URLSearchParams(window.location.search);

  const artistId = parseInt(urlParams.get('artistId') || '', 10);
  const songId = parseInt(urlParams.get('songId') || '', 10);

  if (!songId) {
    console.error('ID is missing or invalid');
    container.innerHTML = '<p class="error-message">Song not Found!s</p>';
    return;
  }

  try {
    hideForRoles(userDetailCta, [Role.ARTIST_MANAGER]);

    const artistUrl = buildUrl(
      config.serverUrl,
      interpolate(config.endpoints.songDetail, {
        artistId: artistId.toString(),
        songId: songId.toString(),
      }),
    );

    const { data: songDetails } = await fetchAPI<SingleSongResponse>(
      artistUrl,
      GET,
      null,
      true,
    );

    if (!songDetails) {
      console.error('Failed to fetch song details');
      container.innerHTML =
        '<p class="table-error">Failed to fetch song details.</p>';
      return;
    }

    userDetailTitle.textContent = `${songDetails.title}'s Detail`;

    userDetailInfo.innerHTML = `
        <p>Title: <strong>${songDetails.title}</strong></p>
        <p>Artist: <strong>${getFullName(songDetails.artistFirstName, songDetails.artistLastName)}</strong></p>
        <p>Album: <strong>${songDetails.albumName}</strong></p>
        <p>Genre: <strong>${songDetails.genre}</strong></p>
    `;

    const deleteModal = new Modal({
      id: 'modal',
      title: 'Delete Song',
      content: 'Are you sure you want to delete this song?',
      actions: ` <button class="btn btn-danger" type="button" id="modal-delete">Delete</button>
            <button class="btn btn-muted" type="button">Cancel</button>`,
    });

    deleteBtn.addEventListener('click', () => {
      deleteModal.show();

      const modalDelete = document.getElementById('modal-delete')!;

      modalDelete.addEventListener('click', async () => {
        const deleteUrl = buildUrl(
          config.serverUrl,
          interpolate(config.endpoints.songDetail, {
            artistId: artistId.toString(),
            songId: songId.toString(),
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
            window.location.href = `/src/pages/song-list.html?artistId=${artistId}`;
          } else {
            console.error('Failed to delete artist');
          }
        } catch (error) {
          console.error('Error deleting song:', error);
        }
      });
    });

    editBtn.setAttribute(
      'href',
      `/src/pages/song-edit.html?artistId=${songDetails.artistId}&songId=${songId}`,
    );
  } catch (error) {
    console.error('Error fetching song details:', error);
    container.innerHTML = `<p class="error-message">Error: ${
      error instanceof Error ? error.message : 'An unexpected error occurred.'
    }</p>`;
  }
});
