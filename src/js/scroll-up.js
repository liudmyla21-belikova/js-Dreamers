// src/js/scroll-up.js

document.addEventListener('DOMContentLoaded', () => {
  const scrollUpBtn = document.querySelector('.scroll-up-btn');

  if (!scrollUpBtn) {
    console.error('Scroll Up Button not found.');
    return;
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollUpBtn.classList.remove('is-hidden');
    } else {
      scrollUpBtn.classList.add('is-hidden');
    }
  });

  scrollUpBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
});
