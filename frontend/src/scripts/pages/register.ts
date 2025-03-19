import { fetchAPI } from '../utils/fetch';
import { POST } from '../../constants/methods';
import { buildUrl } from '../utils/url';
import config from '../../config';
import {
  validateAddress,
  validateDob,
  validateEmail,
  validateGender,
  validateName,
  validatePassword,
  validatePhone,
  validateRole,
} from '../components/formValidator.js';
import { ServerResponse } from '../../interface/response.js';

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
    registerButton.textContent = 'Registering...';

    const fnameInput = document.getElementById('fname') as HTMLInputElement;
    const lnameInput = document.getElementById('lname') as HTMLInputElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById(
      'password',
    ) as HTMLInputElement;
    const phoneInput = document.getElementById('phone') as HTMLInputElement;
    const dobInput = document.getElementById('dob') as HTMLInputElement;
    const genderInput = document.getElementById('gender') as HTMLSelectElement;
    const addressInput = document.getElementById('address') as HTMLInputElement;
    const roleInput = document.getElementById('role') as HTMLInputElement;

    const firstName = fnameInput.value.trim();
    const lastName = lnameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const phone = phoneInput.value.trim();
    const dob = dobInput.value.trim();
    const gender = genderInput.value.trim();
    const address = addressInput.value.trim();
    const role = roleInput.value.trim();

    let isValid = true;

    const mainFormError = document.getElementById(
      'main-form-error',
    ) as HTMLDivElement;
    const fnameError = document.getElementById('fname-error') as HTMLDivElement;
    const lnameError = document.getElementById('lname-error') as HTMLDivElement;
    const emailError = document.getElementById('email-error') as HTMLDivElement;
    const passwordError = document.getElementById(
      'password-error',
    ) as HTMLDivElement;
    const phoneError = document.getElementById('phone-error') as HTMLDivElement;
    const dobError = document.getElementById('dob-error') as HTMLDivElement;
    const genderError = document.getElementById(
      'gender-error',
    ) as HTMLDivElement;
    const addressError = document.getElementById(
      'address-error',
    ) as HTMLDivElement;
    const roleError = document.getElementById('role-error') as HTMLDivElement;

    fnameError.textContent = '';
    lnameError.textContent = '';
    emailError.textContent = '';
    passwordError.textContent = '';
    phoneError.textContent = '';
    dobError.textContent = '';
    genderError.textContent = '';
    addressError.textContent = '';
    roleError.textContent = '';
    mainFormError.textContent = '';

    if (!validateName(firstName)) {
      fnameError.textContent = 'First Name must be at least 2 characters long.';
      isValid = false;
    }
    if (!validateName(lastName)) {
      lnameError.textContent = 'Last Name must be at least 2 characters long.';
      isValid = false;
    }
    if (!validateEmail(email)) {
      emailError.textContent = 'Please enter a valid email address.';
      isValid = false;
    }
    if (!validatePassword(password)) {
      passwordError.textContent =
        'Password must be at least 6 characters long.';
      isValid = false;
    }
    if (!validatePhone(phone)) {
      phoneError.textContent = 'Please enter a valid 10-digit phone number.';
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

    if (!validateRole(role)) {
      roleError.textContent = 'Please enter a valid role.';
      isValid = false;
    }

    if (isValid) {
      const userData = {
        firstName,
        lastName,
        email,
        password,
        phone,
        dob,
        gender,
        address,
        role,
      };

      try {
        const registerUrl = buildUrl(
          config.serverUrl,
          config.endpoints.registerUser,
        );
        const response = await fetchAPI<ServerResponse>(
          registerUrl,
          POST,
          userData,
        );

        if (response.success) {
          window.location.href = '/src/pages/login.html';
        } else {
          mainFormError.style.display = 'block';
          mainFormError.textContent = response.message;
        }
      } catch {
        mainFormError.textContent = 'Something went wrong!';
      } finally {
        registerButton.disabled = false;
        registerButton.textContent = 'Signup';
      }
    } else {
      registerButton.disabled = false;
      registerButton.textContent = 'Signup';
    }
  });
});
