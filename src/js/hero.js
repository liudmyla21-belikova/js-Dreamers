import Swiper from 'swiper';
import { Navigation } from 'swiper/modules'; // ✅ додаємо модуль
import 'swiper/css';
import 'swiper/css/navigation';

Swiper.use([Navigation]); // ✅ реєструємо Navigation

const prevBtnHero = document.querySelector('.hero-btn-slide-prev');
const nextBtnHero = document.querySelector('.hero-btn-slide-next');

const swiperHero = new Swiper('.swiper', {
  slidesPerView: 1,
  spaceBetween: 16,
  loop: false,
  navigation: {
    nextEl: '.hero-btn-slide-next',
    prevEl: '.hero-btn-slide-prev',
  },
  on: {
    slideChange: () => {
      const { isBeginning, isEnd } = swiperHero;
      prevBtnHero.disabled = isBeginning;
      nextBtnHero.disabled = isEnd;
    },
  },
});

// Ініціальна перевірка
prevBtnHero.disabled = swiperHero.isBeginning;
nextBtnHero.disabled = swiperHero.isEnd;
