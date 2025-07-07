import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

document.addEventListener('DOMContentLoaded', () => {
  const eventSections = document.querySelectorAll('.event-section');

  eventSections.forEach(section => {
    const eventSwiperEl = section.querySelector('.event-swiper');
    const nextButton = section.querySelector('.event-custom-button-next');
    const prevButton = section.querySelector('.event-custom-button-prev');
    const paginationEl = section.querySelector('.event-swiper-pagination');

    if (!eventSwiperEl) return;

    const swiper = new Swiper(eventSwiperEl, {
      loop: false,
      observer: true,
      observeParents: true,
      navigation: {
        nextEl: nextButton || null,
        prevEl: prevButton || null,
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      simulateTouch: true,
      slidesPerView: 1,
      spaceBetween: 24,
      pagination: {
        el: paginationEl || null,
        clickable: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
        1440: {
          slidesPerView: 3,
          spaceBetween: 24,
        },
      },
    });

    swiper.update();

    function updateButtonStates() {
      if (prevButton) {
        if (swiper.isBeginning) {
          prevButton.classList.remove('active-swiper-btn');
        } else {
          prevButton.classList.add('active-swiper-btn');
        }
      }

      if (nextButton) {
        if (swiper.isEnd) {
          nextButton.classList.remove('active-swiper-btn');
        } else {
          nextButton.classList.add('active-swiper-btn');
        }
      }
    }

    updateButtonStates();

    swiper.on('slideChange', () => {
      updateButtonStates();
    });

    window.addEventListener('resize', () => {
      swiper.update();
      updateButtonStates();
    });
  });
});
