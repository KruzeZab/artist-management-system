import './style.css';

function loadComponent(selector: string, file: string) {
  fetch(file)
    .then((response) => response.text())
    .then((html) => {
      document.querySelector(selector)!.innerHTML = html;
    })
    .catch((error) => console.error(`Error loading ${file}:`, error));
}

function loadPageStyles() {
  const viewStyle = document.createElement('link');
  viewStyle.rel = 'stylesheet';

  viewStyle.href = './style.css';

  document.head.appendChild(viewStyle);
}

document.addEventListener('DOMContentLoaded', () => {
  loadComponent('header', './components/header.html');
  loadComponent('footer', './components/footer.html');
  loadPageStyles();
});
