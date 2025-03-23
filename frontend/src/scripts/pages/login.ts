import { fetchAPI } from '../utils/fetch';
import { POST } from '../../constants/methods';
import { buildUrl } from '../utils/url';
import config from '../../config';

import { ServerResponse } from '../../interface/response.js';
import { setItem } from '../utils/localStorage.js';
import { AUTH } from '../../constants/application.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('#login-form') as HTMLFormElement;

  const loginButton = document.getElementById(
    'login-button',
  ) as HTMLButtonElement;

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    loginButton.disabled = true;
    loginButton.textContent = 'Logging in...';

    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById(
      'password',
    ) as HTMLInputElement;

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    let isValid = true;

    const mainFormError = document.getElementById(
      'main-form-error',
    ) as HTMLDivElement;
    const emailError = document.getElementById('email-error') as HTMLDivElement;
    const passwordError = document.getElementById(
      'password-error',
    ) as HTMLDivElement;

    emailError.textContent = '';
    passwordError.textContent = '';

    mainFormError.textContent = '';

    if (!email.trim()) {
      emailError.textContent = 'Please enter an email';
      isValid = false;
    }
    if (!password.trim()) {
      passwordError.textContent = 'Please enter a password';
      isValid = false;
    }

    if (isValid) {
      const userData = {
        email,
        password,
      };

      try {
        const loginUrl = buildUrl(config.serverUrl, config.endpoints.loginUser);
        const response = await fetchAPI<ServerResponse>(
          loginUrl,
          POST,
          userData,
        );

        if (response.success) {
          setItem(AUTH, JSON.stringify(response.data));

          window.location.href = '/src/pages/users.html';
        } else {
          mainFormError.style.display = 'block';
          mainFormError.textContent = response.message;
        }
      } catch {
        mainFormError.style.display = 'block';
        mainFormError.textContent = 'Something went wrong!';
      } finally {
        loginButton.disabled = false;
        loginButton.textContent = 'Login';
      }
    } else {
      loginButton.disabled = false;
      loginButton.textContent = 'Login';
    }
  });
});
