import config from '../../config';

import { fetchAPI } from '../utils/fetch';
import { buildUrl, interpolate } from '../utils/url';

import { Gender, UpdateUser } from '../../interface/user';

import { PATCH, GET } from '../../constants/methods';
import { SingleUserResponse } from '../../interface/response';
import {
  validateEmail,
  validateName,
  validatePhone,
} from '../components/formValidator';
import { formatDateForInput } from '../utils/user';

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
  const userId = parseInt(urlParams.get('id') || '', 10);

  if (!userId) {
    console.error('User ID is missing or invalid');
    container.innerHTML =
      '<p class="error-message">User ID is missing or invalid.</p>';
    return;
  }

  try {
    // Fetch user data for pre-filling the form
    const userUrl = buildUrl(
      config.serverUrl,
      config.endpoints.users,
      userId.toString(),
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
        '<p class="error-message">Failed to fetch user details.</p>';
      return;
    }
    userDetailTitle.textContent = `Edit ${userDetails.firstName} ${userDetails.lastName}'s Detail`;

    (document.getElementById('fname') as HTMLInputElement).value =
      userDetails.firstName;
    (document.getElementById('lname') as HTMLInputElement).value =
      userDetails.lastName;
    (document.getElementById('email') as HTMLInputElement).value =
      userDetails.email;
    (document.getElementById('phone') as HTMLInputElement).value =
      userDetails.phone;
    (document.getElementById('dob') as HTMLInputElement).value =
      formatDateForInput(userDetails.dob);
    (document.getElementById('address') as HTMLInputElement).value =
      userDetails.address;
    (document.getElementById('gender') as HTMLSelectElement).value =
      userDetails.gender;

    editForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const updatedUser: UpdateUser = {
        firstName: (
          document.getElementById('fname') as HTMLInputElement
        ).value.trim(),
        lastName: (
          document.getElementById('lname') as HTMLInputElement
        ).value.trim(),
        email: (
          document.getElementById('email') as HTMLInputElement
        ).value.trim(),
        phone: (
          document.getElementById('phone') as HTMLInputElement
        ).value.trim(),
        dob: (document.getElementById('dob') as HTMLInputElement).value,
        gender: (document.getElementById('gender') as HTMLSelectElement)
          .value as Gender,
        address: (
          document.getElementById('address') as HTMLInputElement
        ).value.trim(),
      };

      let isValid = true;

      const fnameError = document.getElementById('fname-error')!;
      const lnameError = document.getElementById('lname-error')!;
      const emailError = document.getElementById('email-error')!;
      const phoneError = document.getElementById('phone-error')!;

      fnameError.textContent = '';
      lnameError.textContent = '';
      emailError.textContent = '';
      phoneError.textContent = '';

      if (!validateName(updatedUser.firstName)) {
        fnameError.textContent =
          'First Name must be at least 2 characters long';
        isValid = false;
      }
      if (!validateName(updatedUser.lastName)) {
        lnameError.textContent = 'Last Name must be at least 2 characters long';
        isValid = false;
      }

      if (!validateEmail(updatedUser.email)) {
        emailError.textContent = 'Please enter a valid email address';
        isValid = false;
      }
      if (!validatePhone(updatedUser.phone)) {
        phoneError.textContent = 'Please enter a valid phone number.';
        isValid = false;
      }

      if (!isValid) {
        return;
      }
      try {
        const updateUrl = buildUrl(
          config.serverUrl,
          interpolate(config.endpoints.userDetail, { id: userId.toString() }),
        );
        const response = await fetchAPI<SingleUserResponse>(
          updateUrl,
          PATCH,
          { ...updatedUser },
          true,
        );

        if (response.success) {
          window.location.href = `/src/pages/user-detail.html?id=${userId}`;
        } else {
          mainFormError.style.display = 'block';
          mainFormError.textContent = response.message;
        }
      } catch (error) {
        console.error('Error updating user:', error);
      }
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    container.innerHTML = `<p class="error-message">Error: ${error instanceof Error ? error.message : 'An unexpected error occurred.'}</p>`;
  }
});
