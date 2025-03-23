import '../css/base.css';
import '../css/main.css';

import { injectHeader } from './components/header';

import { ELEMENT_ROLE_MAPPING } from '../constants/permission';

import { hideForRoles, isAuthorized } from './utils/authorization';

document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;

  const isUserAuthorized = isAuthorized(currentPath);

  if (!isUserAuthorized) {
    window.location.href = '/';
  }

  // Hide the elements according to the role authorization
  ELEMENT_ROLE_MAPPING.forEach((mapping) => {
    const elements = document.querySelectorAll(mapping.elementSelector);
    elements.forEach((element) => {
      hideForRoles(element as HTMLElement, mapping.roles);
    });
  });

  injectHeader();
});
