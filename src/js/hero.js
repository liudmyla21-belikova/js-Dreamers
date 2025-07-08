import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

Swiper.use([Navigation]);

const prevBtnHero = document.querySelector('.hero-btn-slide-prev');
const nextBtnHero = document.querySelector('.hero-btn-slide-next');

const swiperHero = new Swiper('.hero-swiper', {
  slidesPerView: 1,
  spaceBetween: 16,
  loop: false,
  navigation: {
    nextEl: '.hero-btn-slide-next',
    prevEl: '.hero-btn-slide-prev',
  },
  keyboard: {
    enabled: true,
    onlyInViewport: true,
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
