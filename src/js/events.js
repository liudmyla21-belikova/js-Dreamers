import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
document.addEventListener('DOMContentLoaded', () => {
  const eventsSwiperEl = document.querySelector('.events-swiper');
  let eventsSwiperInstance = null;
  const enableEventsSwiper = () => {
    if (eventsSwiperInstance) return;
    eventsSwiperInstance = new Swiper(eventsSwiperEl, {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: false,
      simulateTouch: true,
      keyboard: { enabled: true, onlyInViewport: true },
      navigation: {
        nextEl: '.events-button-next',
        prevEl: '.events-button-prev',
      },
      pagination: { el: '.events-pagination', clickable: true },
      breakpoints: { 768: { slidesPerView: 2 }, 1440: { enabled: false } },
    });
  };
  const disableEventsSwiper = () => {
    if (eventsSwiperInstance) {
      eventsSwiperInstance.destroy(true, true);
      eventsSwiperInstance = null;
    }
  };
  const handleResize = () => {
    if (window.innerWidth >= 1440) {
      disableEventsSwiper();
    } else {
      enableEventsSwiper();
    }
  };
  handleResize();
  window.addEventListener('resize', handleResize);
});
