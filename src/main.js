import { getCategories } from './js/books';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

getCategories()
  .then(categories => {
    renderCategories(['All categories', ...categories]);
  })
  .catch(() => {
    iziToast.error({ message: 'Categories could not be loaded!' });
  });
