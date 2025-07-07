const headerOpenMenuButton = document.querySelector('[header-menu-open]');
const headerCloseMenuButton = document.querySelector(
  '[header-data-menu-close]'
);
const headerModalBackdrop = document.querySelector('[header-data-menu]');
const headerMenuLinks = headerModalBackdrop.querySelectorAll('a[href^="#"]');

let headerSavedScrollY = 0;

// Блокіруем прокрутку
function lockHeaderScroll() {
  headerSavedScrollY = window.scrollY || document.documentElement.scrollTop;
  document.documentElement.style.setProperty(
    '--scroll-y',
    `-${headerSavedScrollY}px`
  );
  document.documentElement.classList.add('no-scroll');
  document.body.classList.add('no-scroll');
}

// Разблокіруем прокрутку
function unlockHeaderScroll() {
  document.documentElement.classList.remove('no-scroll');
  document.body.classList.remove('no-scroll');
  window.scrollTo(0, headerSavedScrollY);
}

// Открітіе/закрітіе меню
function toggleHeaderModal() {
  const headerIsOpen = headerModalBackdrop.classList.toggle('is-open');
  headerIsOpen ? lockHeaderScroll() : unlockHeaderScroll();
}

// Собітія
headerOpenMenuButton.addEventListener('click', toggleHeaderModal);
headerCloseMenuButton.addEventListener('click', toggleHeaderModal);

// Закрітіе при кліке по ссілке
headerMenuLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (headerModalBackdrop.classList.contains('is-open')) {
      headerModalBackdrop.classList.remove('is-open');
      unlockHeaderScroll();
    }
  });
});
