import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

document.addEventListener('DOMContentLoaded', () => {
  const feedbackSwiperEl = document.querySelector('.feedback-swiper');

  if (feedbackSwiperEl) {
    const swiper = new Swiper(feedbackSwiperEl, {
      loop: false,
      navigation: {
        nextEl: '.feedback-custom-button-next',
        prevEl: '.feedback-custom-button-prev',
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      simulateTouch: true,
      slidesPerView: 1,
      spaceBetween: 24,
      pagination: {
        el: '.feedback-swiper-pagination',
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

    window.addEventListener('resize', () => {
      swiper.update();
    });
  }
});