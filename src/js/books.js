import axios from 'axios';

const BASE_URL = 'https://books-backend.p.goit.global/books';

export async function getCategories() {
  const response = await axios.get(`${BASE_URL}/category-list`);
  return response.data;
}

export function renderCategories(categories) {
  const booksCategoryList = document.querySelector('#categorySelect');
  const markup = categories
    .map(
      category => `
      <option value="${category}">${category}</option>`
    )
    .join('');
  booksCategoryList.insertAdjacentHTML('beforeend', markup);
}
