import config from '../../config';

import { fetchAPI } from '../utils/fetch';
import { buildUrl, interpolate } from '../utils/url';

import { Genre, UpdateSong } from '../../interface/song';
import { SingleSongResponse } from '../../interface/response';

import { PATCH, GET } from '../../constants/methods';

import {
  validateTitle,
  validateGenre,
  validateAlbumName,
} from '../components/formValidator';

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.querySelector('.container')!;
  const editForm = document.querySelector('.edit-form') as HTMLFormElement;
  const userDetailTitle = document.getElementById(
    'user-edit-title',
  )! as HTMLHeadingElement;
  const mainFormError = document.getElementById(
    'main-form-error',
  )! as HTMLParagraphElement;

  // Get user ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const artistId = parseInt(urlParams.get('artistId') || '', 10);
  const songId = parseInt(urlParams.get('songId') || '', 10);

  if (!artistId || !songId) {
    console.error('ID is missing or invalid');
    container.innerHTML =
      '<p class="error-message">ID is missing or invalid.</p>';
    return;
  }

  try {
    // Fetch song data for pre-filling the form
    const songUrl = buildUrl(
      config.serverUrl,
      interpolate(config.endpoints.songDetail, { artistId, songId }),
    );
    const { data: songDetails } = await fetchAPI<SingleSongResponse>(
      songUrl,
      GET,
      null,
      true,
    );

    console.log(songDetails, 'song detail');

    if (!songDetails) {
      console.error('Failed to fetch song details');
      container.innerHTML =
        '<p class="error-message">Failed to fetch song details.</p>';
      return;
    }
    userDetailTitle.textContent = `Edit ${songDetails.title}`;

    (document.getElementById('title') as HTMLInputElement).value =
      songDetails.title;

    (document.getElementById('album-name') as HTMLInputElement).value =
      songDetails.albumName;

    (document.getElementById('genre') as HTMLSelectElement).value =
      songDetails.genre;

    editForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const updatedSong: UpdateSong = {
        title: (
          document.getElementById('title') as HTMLInputElement
        ).value.trim(),
        albumName: (
          document.getElementById('album-name') as HTMLInputElement
        ).value.trim(),
        genre: (document.getElementById('genre') as HTMLSelectElement)
          .value as Genre,
      };

      let isValid = true;

      const titleError = document.getElementById('title-error')!;
      const genreError = document.getElementById('genre-error')!;
      const albumNameError = document.getElementById('album-name-error')!;

      titleError.textContent = '';
      albumNameError.textContent = '';
      genreError.textContent = '';

      if (!validateTitle(updatedSong.title)) {
        titleError.textContent = 'Title must be at least 4 characters long';
        isValid = false;
      }

      if (!validateGenre(updatedSong.genre)) {
        genreError.textContent = 'Genre is not valid!';
        isValid = false;
      }

      if (!validateAlbumName(updatedSong.albumName)) {
        genreError.textContent = 'Album name is not valid!';
        isValid = false;
      }

      if (!isValid) {
        return;
      }

      try {
        const updateUrl = buildUrl(
          config.serverUrl,
          interpolate(config.endpoints.songDetail, {
            artistId,
            songId,
          }),
        );

        const response = await fetchAPI<SingleSongResponse>(
          updateUrl,
          PATCH,
          { ...updatedSong },
          true,
        );

        if (response.success) {
          window.location.href = `/src/pages/song-detail.html?artistId=${artistId}&songId=${songId}`;
        } else {
          mainFormError.style.display = 'block';
          mainFormError.textContent = response.message;
        }
        console.error('Failed to update song');
      } catch (error) {
        console.error('Error updating song:', error);
      }
    });
  } catch (error) {
    console.error('Error fetching song details:', error);
    container.innerHTML = `<p class="error-message">Error: ${error instanceof Error ? error.message : 'An unexpected error occurred.'}</p>`;
  }
});
