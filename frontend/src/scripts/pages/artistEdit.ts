import config from '../../config';

import { fetchAPI } from '../utils/fetch';
import { formatDateForInput } from '../utils/user';
import { buildUrl, interpolate } from '../utils/url';

import { Gender } from '../../interface/user';
import { UpdateArtist } from '../../interface/artist';
import { SingleArtistResponse } from '../../interface/response';

import { PATCH, GET } from '../../constants/methods';

import {
  validateAddress,
  validateAlbumsReleased,
  validateDob,
  validateFirstReleaseYear,
  validateGender,
  validateName,
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
  const artistId = parseInt(urlParams.get('id') || '', 10);

  if (!artistId) {
    console.error('Artist ID is missing or invalid');
    container.innerHTML =
      '<p class="error-message">Artist ID is missing or invalid.</p>';
    return;
  }

  try {
    // Fetch artist data for pre-filling the form
    const artistUrl = buildUrl(
      config.serverUrl,
      interpolate(config.endpoints.artistDetail, { id: artistId }),
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
        '<p class="error-message">Failed to fetch artist details.</p>';
      return;
    }
    userDetailTitle.textContent = `Edit ${artistDetails.name}'s Detail`;

    (document.getElementById('name') as HTMLInputElement).value =
      artistDetails.name;

    (document.getElementById('dob') as HTMLInputElement).value =
      formatDateForInput(artistDetails.dob);
    (document.getElementById('address') as HTMLInputElement).value =
      artistDetails.address;
    (document.getElementById('gender') as HTMLSelectElement).value =
      artistDetails.gender;

    (document.getElementById('first-release-year') as HTMLInputElement).value =
      artistDetails.firstReleaseYear;

    (document.getElementById('albums-released') as HTMLInputElement).value =
      artistDetails.noOfAlbumsReleased.toString();

    editForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const updatedArtist: UpdateArtist = {
        name: (
          document.getElementById('name') as HTMLInputElement
        ).value.trim(),

        dob: (document.getElementById('dob') as HTMLInputElement).value,
        gender: (document.getElementById('gender') as HTMLSelectElement)
          .value as Gender,
        address: (
          document.getElementById('address') as HTMLInputElement
        ).value.trim(),

        firstReleaseYear: Number(
          (
            document.getElementById('first-release-year') as HTMLInputElement
          ).value.trim(),
        ),

        noOfAlbumsReleased: Number(
          (
            document.getElementById('albums-released') as HTMLInputElement
          ).value.trim(),
        ),
      };

      let isValid = true;

      const nameError = document.getElementById('name-error')!;
      const dobError = document.getElementById('dob-error')!;
      const genderError = document.getElementById('gender-error')!;
      const addressError = document.getElementById('address-error')!;
      const firstReleaseYearError = document.getElementById(
        'first-release-year-error',
      )!;
      const albumsReleasedrror = document.getElementById(
        'albums-released-error',
      )!;

      nameError.textContent = '';
      dobError.textContent = '';
      addressError.textContent = '';
      genderError.textContent = '';
      firstReleaseYearError.textContent = '';
      albumsReleasedrror.textContent = '';

      if (!validateName(updatedArtist.name)) {
        nameError.textContent = 'Name must be at least 2 characters long';
        isValid = false;
      }

      if (!validateGender(updatedArtist.gender)) {
        genderError.textContent = 'Gender is required!';
        isValid = false;
      }

      if (!validateDob(updatedArtist.dob)) {
        dobError.textContent = 'DOB is required!';
        isValid = false;
      }

      if (!validateAddress(updatedArtist.address)) {
        addressError.textContent = 'Address is required!';
        isValid = false;
      }

      if (!validateFirstReleaseYear(updatedArtist.firstReleaseYear)) {
        firstReleaseYearError.textContent = 'Release Year is required!';
        isValid = false;
      }

      if (!validateAlbumsReleased(updatedArtist.noOfAlbumsReleased)) {
        albumsReleasedrror.textContent = 'Albums Released is required!';
        isValid = false;
      }

      if (!isValid) {
        return;
      }
      try {
        const updateUrl = buildUrl(
          config.serverUrl,
          interpolate(config.endpoints.artistDetail, {
            id: artistId.toString(),
          }),
        );

        const response = await fetchAPI<SingleArtistResponse>(
          updateUrl,
          PATCH,
          { ...updatedArtist },
          true,
        );

        if (response.success) {
          window.location.href = `/src/pages/artist-detail.html?id=${artistId}`;
        } else {
          mainFormError.style.display = 'block';
          mainFormError.textContent = response.message;
        }
        console.error('Failed to update artist');
      } catch {
        mainFormError.style.display = 'block';
        mainFormError.textContent = 'Something went wrong!';
      }
    });
  } catch (error) {
    console.error('Error fetching artist details:', error);
    container.innerHTML = `<p class="error-message">Error: ${error instanceof Error ? error.message : 'An unexpected error occurred.'}</p>`;
  }
});
