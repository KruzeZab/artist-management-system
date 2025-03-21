import { buildUrl, interpolate } from '../utils/url';
import { fetchAPI } from '../utils/fetch';

import config from '../../config';

import { POST } from '../../constants/methods';

import {
  validateGenre,
  validateAlbumName,
  validateTitle,
} from '../components/formValidator';

import { ServerResponse } from '../../interface/response';

document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.querySelector(
    '#register-form',
  ) as HTMLFormElement;

  const registerButton = document.getElementById(
    'register-button',
  ) as HTMLButtonElement;

  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);

    const artistId = parseInt(urlParams.get('artistId') || '', 10);

    registerButton.disabled = true;
    registerButton.textContent = 'Adding...';

    const titleInput = document.getElementById('title') as HTMLInputElement;
    const genreInput = document.getElementById('genre') as HTMLSelectElement;
    const albumNameInput = document.getElementById(
      'album-name',
    ) as HTMLInputElement;

    const title = titleInput.value.trim();
    const genre = genreInput.value.trim();
    const albumName = albumNameInput.value.trim();

    let isValid = true;

    const mainFormError = document.getElementById(
      'main-form-error',
    ) as HTMLDivElement;

    const titleError = document.getElementById('title-error') as HTMLDivElement;
    const genreError = document.getElementById('genre-error') as HTMLDivElement;
    const albumNameError = document.getElementById(
      'album-name-error',
    ) as HTMLDivElement;

    titleError.textContent = '';
    genreError.textContent = '';
    albumNameError.textContent = '';

    mainFormError.textContent = '';

    if (!validateTitle(title)) {
      titleError.textContent = 'Title must be at least 4 characters long.';
      isValid = false;
    }

    if (!validateGenre(genre)) {
      genreError.textContent = 'Please enter a valid Genre.';
      isValid = false;
    }

    if (!validateAlbumName(albumName)) {
      albumNameError.textContent = 'Please enter a valid Album Name.';
      isValid = false;
    }

    if (isValid) {
      const artistData = {
        title,
        genre,
        albumName,
        artistId,
      };

      try {
        const registerUrl = buildUrl(
          config.serverUrl,
          interpolate(config.endpoints.createSong, {
            artistId,
          }),
        );
        const response = await fetchAPI<ServerResponse>(
          registerUrl,
          POST,
          artistData,
          true,
        );

        if (response.success) {
          window.location.href = `/src/pages/song-list.html?artistId=${artistId}`;
        } else {
          mainFormError.style.display = 'block';
          mainFormError.textContent = response.message;
        }
      } catch {
        mainFormError.textContent = 'Something went wrong!';
      } finally {
        registerButton.disabled = false;
        registerButton.textContent = 'Add Song';
      }
    } else {
      registerButton.disabled = false;
      registerButton.textContent = 'Add Song';
    }
  });
});
