import { buildUrl } from '../utils/url';
import { fetchAPI } from '../utils/fetch';

import config from '../../config';

import { POST } from '../../constants/methods';

import {
  validateAddress,
  validateAlbumsReleased,
  validateDob,
  validateFirstReleaseYear,
  validateGender,
  validateName,
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

    registerButton.disabled = true;
    registerButton.textContent = 'Creating...';

    const nameInput = document.getElementById('name') as HTMLInputElement;
    const dobInput = document.getElementById('dob') as HTMLInputElement;
    const genderInput = document.getElementById('gender') as HTMLSelectElement;
    const addressInput = document.getElementById('address') as HTMLInputElement;
    const firstReleaseInput = document.getElementById(
      'first-release-year',
    ) as HTMLInputElement;
    const albumsReleasedInput = document.getElementById(
      'albums-released',
    ) as HTMLInputElement;

    const name = nameInput.value.trim();
    const dob = dobInput.value.trim();
    const gender = genderInput.value.trim();
    const address = addressInput.value.trim();
    const firstReleaseYear = Number(firstReleaseInput.value);
    const noOfAlbumsReleased = Number(albumsReleasedInput.value);

    let isValid = true;

    const mainFormError = document.getElementById(
      'main-form-error',
    ) as HTMLDivElement;

    const nameError = document.getElementById('name-error') as HTMLDivElement;
    const dobError = document.getElementById('dob-error') as HTMLDivElement;
    const genderError = document.getElementById(
      'gender-error',
    ) as HTMLDivElement;
    const addressError = document.getElementById(
      'address-error',
    ) as HTMLDivElement;
    const firstReleaseError = document.getElementById(
      'first-release-year-error',
    ) as HTMLDivElement;
    const albumsReleasedError = document.getElementById(
      'albums-released-error',
    ) as HTMLDivElement;

    nameError.textContent = '';
    dobError.textContent = '';
    genderError.textContent = '';
    addressError.textContent = '';
    firstReleaseError.textContent = '';
    albumsReleasedError.textContent = '';

    mainFormError.textContent = '';

    if (!validateName(name)) {
      nameError.textContent = 'Name must be at least 2 characters long.';
      isValid = false;
    }

    if (!validateDob(dob)) {
      dobError.textContent = 'Please enter a valid DOB.';
      isValid = false;
    }
    if (!validateGender(gender)) {
      genderError.textContent = 'Please enter a valid Gender.';
      isValid = false;
    }
    if (!validateAddress(address)) {
      addressError.textContent = 'Please enter a valid DOB.';
      isValid = false;
    }

    if (!validateFirstReleaseYear(firstReleaseYear)) {
      firstReleaseError.textContent = 'Please enter a valid release year.';
      isValid = false;
    }

    if (!validateAlbumsReleased(noOfAlbumsReleased)) {
      albumsReleasedError.textContent = 'Please enter a valid albums released.';
      isValid = false;
    }

    if (isValid) {
      const artistData = {
        name,
        dob,
        gender,
        address,
        firstReleaseYear,
        noOfAlbumsReleased,
      };

      try {
        const registerUrl = buildUrl(
          config.serverUrl,
          config.endpoints.createArtist,
        );
        const response = await fetchAPI<ServerResponse>(
          registerUrl,
          POST,
          artistData,
          true,
        );

        if (response.success) {
          window.location.href = '/src/pages/artist-list.html';
        } else {
          mainFormError.style.display = 'block';
          mainFormError.textContent = response.message;
        }
      } catch {
        mainFormError.textContent = 'Something went wrong!';
      } finally {
        registerButton.disabled = false;
        registerButton.textContent = 'Create Artist';
      }
    } else {
      registerButton.disabled = false;
      registerButton.textContent = 'Create Artist';
    }
  });
});
