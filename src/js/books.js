import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const BASE_URL = 'https://books-backend.p.goit.global/books';

const refs = {
  categoryList: document.querySelector('.category-list'),
  booksList: document.querySelector('.books-list'),
  showMoreBtn: document.querySelector('.pagination-btn'),
  counter: document.querySelector('#books-count'),
  booksCategoryList: document.querySelector('#categorySelect'),
};

let visibleBooks = 0;
let allBooks = [];
let booksPerPage = window.innerWidth < 768 ? 10 : 24;

export async function initBooksSection() {
  await loadCategories();
  await loadTrendingBooks();
  refs.showMoreBtn.addEventListener('click', loadMoreBooks);
  refs.categoryList.addEventListener('click', onCategoryClick);
}

async function loadCategories() {
  try {
    const response = await axios.get(`${BASE_URL}/category-list`);
    const markup = [
      '<option value="">All categories</option>',
      ...response.data.map(
        ({ list_name }) =>
          `
      <option value="${list_name}">${list_name}</option>`
      ),
    ].join('');
    refs.booksCategoryList.innerHTML = markup;
  } catch (error) {
    iziToast.error({ message: 'Failed to load categories' });
  }
}

async function loadTrendingBooks() {
  try {
    const response = await axios.get(`${BASE_URL}/top-books`);
    allBooks = response.data.flatMap(item => item.books);
    renderInitialBooks();
  } catch (error) {
    iziToast.error({ message: 'Failed to load trending books' });
  }
}

function renderInitialBooks() {
  refs.booksList.innerHTML = '';
  visibleBooks = 0;
  loadMoreBooks();
}

// розібратися
function loadMoreBooks() {
  const nextBatch = allBooks.slice(visibleBooks, visibleBooks + 10);
  renderBooks(nextBatch, { append: true });
  visibleBooks += nextBatch.length;
  updateCounter(visibleBooks, allBooks.length);

  if (visibleBooks >= allBooks.length) {
    refs.showMoreBtn.classList.add('hidden');
  } else {
    refs.showMoreBtn.classList.remove('hidden');
  }
}

function renderBooks(books, { append = false } = {}) {
  const markup = books
    .map(
      book => `
        <li class="book-card">
          <img src="${book.book_image}" alt="${book.title}" />
          <h4>${book.title}</h4>
          <p>${book.author}</p>
          <p>${book.price} $</p>
          <button class="learn-more-btn" data-id="${book._id}">Learn More</button>
        </li>
      `
    )
    .join('');

  if (append) {
    refs.booksList.insertAdjacentHTML('beforeend', markup);
  } else {
    refs.booksList.innerHTML = markup;
  }
}

function updateCounter(visible, total) {
  refs.counter.textContent = `Showing ${visible} of ${total}`;
}

async function onCategoryClick(e) {
  const btn = e.target.closest('button[data-category]');
  if (!btn) return;

  const category = btn.dataset.category;

  if (category === 'All categories') {
    await loadTrendingBooks();
    return;
  }

  try {
    const response = await axios.get(
      `${BASE_URL}/category?category=${encodeURIComponent(category)}`
    );
    allBooks = response.data;
    renderInitialBooks();
  } catch (error) {
    iziToast.error({ message: 'Failed to load category books' });
  }
}

initBooksSection();
