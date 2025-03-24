import { AUTH } from '../../constants/application';

import { buildUrl } from '../utils/url';
import { fetchAPI } from '../utils/fetch';
import { getCurrentUser } from '../utils/user';

import config from '../../config';

import { Role } from '../../interface/user';

import { POST } from '../../constants/methods';

import { LogoutResponse } from '../../interface/response';

export function injectHeader() {
  const currentUser = getCurrentUser();

  let userLinks = '';

  if (currentUser) {
    userLinks += `<li><p class="header__item">Welcome ${currentUser.email}</p></li>`;
    if (currentUser.role === Role.SUPER_ADMIN) {
      userLinks += `<li><a href="/src/pages/user-list.html" class="header__item">Users</a></li>`;
      userLinks += `<li><a href="/src/pages/artist-list.html" class="header__item">Artists</a></li>`;
    } else if (currentUser.role === Role.ARTIST_MANAGER) {
      userLinks += `<li><a href="/src/pages/artist-list.html" class="header__item">Artists</a></li>`;
    } else if (currentUser.role === Role.ARTIST && currentUser.artistId) {
      userLinks += `<li><a href="/src/pages/song-list.html?artistId=${currentUser.artistId}" class="header__item">Songs</a></li>`;
    }

    userLinks += `<li><div id="logout" class="header__item btn btn-danger header__btn">Logout</div></li>`;
  } else {
    userLinks += `<li><a href="/src/pages/login.html" class="btn btn-primary header__btn header__item">Login</a></li>`;
    userLinks += `<li><a href="/src/pages/register.html" class="btn btn-primary header__btn header__item">Signup</a></li>`;
  }

  // Inject the header HTML
  const headerHTML = `
    <div class="header__wrapper">
      <div class="header__branding">
        <a href="/src/pages/index.html" class="header__brand">Artist Management System</a>
        <div class="header__collapse" id="header-collapse">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <ul class="header__menu">${userLinks}</ul>
    </div>
  `;

  let headerElement = document.querySelector('header') as HTMLElement;

  if (!headerElement) {
    headerElement = document.createElement('header');
    document.body.prepend(headerElement);
  }

  headerElement.innerHTML = headerHTML;

  // Mobile menu toggle
  const burgerIcon = document.getElementById('header-collapse');
  const menu = document.querySelector('.header__menu');

  if (burgerIcon && menu) {
    burgerIcon.addEventListener('click', function () {
      headerElement.classList.toggle('pb-0');
      menu.classList.toggle('d-block');
    });
  }

  // Handle logout event
  const logoutButton = document.getElementById('logout');

  if (logoutButton) {
    logoutButton.addEventListener('click', async function (event) {
      event.preventDefault();
      // Send request to backend
      const logoutUrl = buildUrl(config.serverUrl, config.endpoints.logout);
      const response = await fetchAPI<LogoutResponse>(
        logoutUrl,
        POST,
        null,
        true,
      );

      if (response.success) {
        localStorage.removeItem(AUTH);
        window.location.href = '/src/pages/login.html';
      }
    });
  }
}
