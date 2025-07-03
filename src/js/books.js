import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const BASE_URL = 'https://books-backend.p.goit.global/books';

const refs = {
  dropdownList: document.querySelector('.dropdown-list'),
  categoryList: document.querySelector('.category-list'),
  dropdownBtn: document.querySelector('.category-dropdown-btn'),
  categoryList: document.querySelector('.category-list'),
  booksList: document.querySelector('.books-list'),
  showMoreBtn: document.querySelector('.pagination-btn'),
  counter: document.querySelector('.books-count'),
};

let visibleBooks = 0;
let allBooks = [];
let booksPerPage = window.innerWidth < 768 ? 10 : 24;

export async function initBooksSection() {
  await initDropdown();
  await loadTrendingBooks();
  refs.showMoreBtn.addEventListener('click', loadMoreBooks);
  refs.categoryList.addEventListener('click', onCategoryClick);
}

async function initDropdown() {
  try {
    const response = await axios.get(`${BASE_URL}/category-list`);
    const categories = [
      'All categories',
      ...response.data.map(cat => cat.list_name),
    ];
    const dropdownMarkup = categories
      .map(
        name => `<li class="dropdown-item" data-category="${name}">${name}</li>`
      )
      .join('');
    refs.dropdownList.innerHTML = dropdownMarkup;

    const categoryListMarkup = categories
      .map(
        name =>
          `<li class="category-item"><button class="category-btn" data-category="${name}">${name}</button></li>`
      )
      .join('');
    refs.categoryList.innerHTML = categoryListMarkup;

    refs.dropdownBtn.addEventListener('click', () => {
      refs.dropdownList.classList.toggle('is-open');
    });

    refs.dropdownList.addEventListener('click', event => {
      const li = event.target.closest('li[data-category]');
      if (!li) return;

      const selectedCategory = li.dataset.category;
      refs.dropdownBtn.textContent = selectedCategory;
      refs.dropdownList.classList.remove('is-open');

      onCategoryClick(selectedCategory);
    });

    refs.categoryList.addEventListener('click', event => {
      const btn = event.target.closest('[data-category]');
      if (!btn) return;
      const selectedCategory = btn.dataset.category;
      onCategoryClick(selectedCategory);
    });
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
      ({ book_image, title, author, _id }) => `
        <li class="book-card">
          <img src="${book_image}" alt="${title}" width="340" height="484" />
          <div class="book-card-elements-wrapper">
              <div class="book-card-title-wrapper">
                  <h4>${title}</h4>
                  <p>${author}</p>
              </div>
              <p>9,99 $</p>
          </div>
          <button class="learn-more-btn" data-id="${_id}">Learn More</button>
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

async function onCategoryClick(category) {
  if (category === 'All categories') {
    await loadTrendingBooks();
    return;
  }

  try {
    const response = await axios.get(
      `${BASE_URL}/category?category=${category}`
    );
    allBooks = response.data;
    renderInitialBooks();
  } catch (error) {
    iziToast.error({ message: 'Failed to load category books' });
  }
}

initBooksSection();
