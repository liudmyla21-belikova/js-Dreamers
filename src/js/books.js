import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import './book-modal.js';

const BASE_URL = 'https://books-backend.p.goit.global/books';
const BASE_URL_NYT = 'https://api.nytimes.com/svc/books/v3';
const API_KEY = import.meta.env.VITE_NYT_API_KEY;

const refs = {
  counter: document.querySelector('.books-count'),
  categoryDropdown: document.querySelector('.category-dropdown'),
  dropdownBtn: document.querySelector('.category-dropdown-btn'),
  dropdownList: document.querySelector('.dropdown-list'),
  categoryDropdownLabel: document.querySelector('.category-dropdown-label'),
  categoryList: document.querySelector('.category-list'),
  booksList: document.querySelector('.books-list'),
  showMoreBtn: document.querySelector('.pagination-btn'),
  loader: document.querySelector('.inline-loader'),
};

let visibleBooks = 0;
let allBooks = [];
const BATCH_SIZE = 4;
let categories = [];
let currentCategory = 'All categories';
let booksPerPage = 0;
const bookCache = new Map();

async function fetchNYTOverview() {
  try {
    const { data } = await axios.get(`${BASE_URL_NYT}/lists/overview.json`, {
      params: { 'api-key': API_KEY },
    });
    const books = data.results.lists.flatMap(list => list.books);
    return books;
  } catch (error) {
    console.error('NYT Overview Error:', error.message);
    return [];
  }
}

async function loadNYTBestSellers() {
  showLoader();
  const nytBooks = await fetchNYTOverview();
  const filtered = filterDuplicateBooks(nytBooks);
  await renderFirstBooks(filtered);
  hideLoader();
}

function getFakeRandomPrice(id, min = 4.9, max = 25.0) {
  if (typeof id !== 'string' || !id.length) {
    id = 'default-id';
  }
  const step = 0.1;
  const stepsCount = Math.floor((max - min) / step) + 1;

  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }

  const stepIndex = Math.abs(hash) % stepsCount;
  return (min + stepIndex * step).toFixed(2);
}

export function getBookId(book) {
  const title = book.title?.trim() || '';
  const author = book.author?.trim() || '';
  const isbn = book.primary_isbn13 || book.primary_isbn10 || '';
  const rawId = book._id || isbn || `${title}|${author}`;

  if (!rawId) {
    console.warn('Book has no valid ID fallback, generating hash');
    return btoa(`${title}-${author}`).slice(0, 12); // base64 хеш, обрізаний
  }

  return rawId;
}

function cacheBook(book) {
  const id = getBookId(book);
  if (!id) return;

  const bookWithPrice = {
    ...book,
    price: getFakeRandomPrice(id),
  };

  bookCache.set(id, bookWithPrice);

  if (!localStorage.getItem(`book-${id}`)) {
    localStorage.setItem(`book-${id}`, JSON.stringify(bookWithPrice));
  }

  return bookWithPrice;
}

function getBooksPerPage() {
  return window.innerWidth < 768 ? 10 : 24;
}

async function fetchCategories() {
  try {
    const { data } = await axios.get(`${BASE_URL}/category-list`);
    const categoryNames = data.map(cat => cat.list_name);
    const booksArrays = await Promise.all(
      categoryNames.map(name => fetchBooksByCategory(name))
    );
    const filtered = categoryNames.filter(
      (name, idx) => booksArrays[idx].length > 0
    );
    return ['NYT Bestsellers', 'All categories', ...filtered];
  } catch (error) {
    iziToast.error({ message: 'Failed to load categories' });
    return [];
  }
}

function renderDropdown(categories) {
  refs.dropdownList.innerHTML = categories
    .map(
      name => `<li class="dropdown-item" data-category="${name}">${name}</li>`
    )
    .join('');
}

function renderCategoryList(categories) {
  refs.categoryList.innerHTML = categories
    .map(
      name =>
        `<li class="category-item"><button class="category-btn" data-category="${name}">${name}</button></li>`
    )
    .join('');
}

function setActiveCategory(category) {
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === category);
  });
  document.querySelectorAll('.dropdown-item').forEach(item => {
    item.classList.toggle('active', item.dataset.category === category);
  });
}

async function renderFirstBooks(books) {
  booksPerPage = getBooksPerPage();
  visibleBooks = 0;
  allBooks = books;

  const initialBooks = books.slice(0, booksPerPage);

  initialBooks.forEach(book => {
    const id = book._id || book.primary_isbn13 || book.title?.trim();
    if (!id) return;

    const cached = bookCache.get(id);
    if (!cached) {
      const bookWithPrice = {
        ...book,
        price: getFakeRandomPrice(id),
      };
      bookCache.set(id, bookWithPrice);

      if (!localStorage.getItem(`book-${id}`)) {
        localStorage.setItem(`book-${id}`, JSON.stringify(bookWithPrice));
      }
    }
  });

  renderBooks(initialBooks);
  visibleBooks = initialBooks.length;
  updateCounter(visibleBooks, books.length);

  if (visibleBooks < allBooks.length) {
    refs.showMoreBtn.classList.remove('hidden');
  } else {
    refs.showMoreBtn.classList.add('hidden');
  }
}

function renderBooks(books, { append = false } = {}) {
  const markup = books
    .map(book => {
      const id = book._id || book.primary_isbn13 || book.title || 'default-id';
      const cached = bookCache.get(id);
      const price = cached?.price || getFakeRandomPrice(id);
      return `
      <li class="book-card">
        <img src="${book.book_image}" alt="${book.title}" width="340" height="484" loading="lazy"/>
        <div class="book-card-elements-wrapper">
          <div class="book-card-title-wrapper">
            <h4>${book.title}</h4>
            <p>${book.author}</p>
          </div>
          <p>${price} $</p>
        </div>
        <button class="learn-more-btn" data-id="${id}">Learn More</button>
      </li>
    `;
    })
    .join('');

  if (append) {
    const fragment = document.createRange().createContextualFragment(markup);
    refs.booksList.appendChild(fragment);
    const newCards = Array.from(refs.booksList.children).slice(-books.length);

    requestAnimationFrame(() => {
      newCards.forEach((card, index) => {
        setTimeout(() => card.classList.add('animate-in'), index * 40);
      });
      hideLoader();
    });
  } else {
    refs.booksList.innerHTML = markup;
    const newCards = refs.booksList.querySelectorAll('.book-card');

    requestAnimationFrame(() => {
      newCards.forEach((card, index) => {
        setTimeout(() => card.classList.add('animate-in'), index * 40);
      });
      hideLoader();
    });
  }
}

function filterDuplicateBooks(books) {
  const seen = new Set();
  return books.filter(book => {
    const key = `${book.author?.trim().toLowerCase()}||${book.title
      ?.trim()
      .toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function fetchBooksByCategory(category) {
  if (!category || category.trim() === '') {
    return [];
  }

  try {
    const { data } = await axios.get(
      `${BASE_URL}/category?category=${category}`
    );
    return data;
  } catch (error) {
    iziToast.error({ message: 'Failed to load books by category' });
    return [];
  }
}

async function fetchTopBooks() {
  try {
    const { data } = await axios.get(`${BASE_URL}/top-books`);
    return data.flatMap(item => item.books);
  } catch (error) {
    iziToast.error({ message: 'Failed to load trending books' });
    return [];
  }
}

function updateCategoryView(categoriesData) {
  if (!categoriesData || !categoriesData.length) return;

  const width = window.innerWidth;

  if (width < 1440) {
    renderDropdown(categoriesData);
    refs.categoryList.innerHTML = '';
    refs.categoryDropdown.classList.remove('hidden');
    refs.categoryList.classList.add('hidden');
  } else {
    renderCategoryList(categoriesData);
    refs.dropdownList.innerHTML = '';
    refs.categoryDropdown.classList.add('hidden');
    refs.categoryList.classList.remove('hidden');
  }
}

function updateCounter(visible, total) {
  refs.counter.textContent = `Showing ${visible} of ${total}`;
}

async function loadMoreBooks() {
  showLoader();
  const nextBatch = allBooks.slice(visibleBooks, visibleBooks + BATCH_SIZE);

  nextBatch.forEach(book => {
    cacheBook(book);
  });

  renderBooks(nextBatch, { append: true });
  visibleBooks += nextBatch.length;
  updateCounter(visibleBooks, allBooks.length);

  await waitForImagesToLoad(refs.booksList);
  hideLoader();

  if (visibleBooks >= allBooks.length) {
    refs.showMoreBtn.classList.add('hidden');
  }
}

async function loadTrendingBooks() {
  showLoader();
  const books = await fetchTopBooks();
  const filtered = filterDuplicateBooks(books);
  await renderFirstBooks(filtered);
  hideLoader();
}

async function loadBooksByCategory(category) {
  showLoader();
  currentCategory = category;
  if (category === 'NYT Bestsellers') {
    await loadNYTBestSellers();
    hideLoader();
    return;
  }

  let books = [];
  if (category === 'All categories') {
    books = await fetchTopBooks();
  } else {
    books = await fetchBooksByCategory(category);
  }
  const filtered = filterDuplicateBooks(books);
  await renderFirstBooks(filtered);
  hideLoader();
}

function showLoader() {
  refs.loader.classList.remove('hidden');
}

function hideLoader() {
  refs.loader.classList.add('hidden');
}

function waitForImagesToLoad(container) {
  const images = container.querySelectorAll('img');
  const promises = Array.from(images).map(
    img =>
      new Promise(resolve => {
        if (img.complete) {
          resolve();
        } else {
          img.addEventListener('load', resolve);
          img.addEventListener('error', resolve);
        }
      })
  );
  return Promise.all(promises);
}

async function initBooksSection() {
  booksPerPage = getBooksPerPage();
  categories = await fetchCategories();

  updateCategoryView(categories);

  if (window.innerWidth >= 1440) {
    currentCategory = 'All categories';
    setActiveCategory(currentCategory);
  }

  window.addEventListener('resize', () => {
    const newBooksPerPage = getBooksPerPage();
    const layoutChanged = newBooksPerPage !== booksPerPage;

    booksPerPage = newBooksPerPage;
    updateCategoryView(categories);

    if (layoutChanged && allBooks.length) {
      const sliced = allBooks.slice(0, booksPerPage);
      visibleBooks = sliced.length;
      renderBooks(sliced);
      updateCounter(visibleBooks, allBooks.length);
      refs.showMoreBtn.classList.toggle(
        'hidden',
        visibleBooks >= allBooks.length
      );
    }
  });

  refs.dropdownBtn.addEventListener('click', () => {
    const isOpen = refs.dropdownList.classList.toggle('is-open');
    refs.dropdownBtn.classList.toggle('open', isOpen);
  });

  refs.dropdownList.addEventListener('click', e => {
    const li = e.target.closest('li[data-category]');
    if (!li) return;
    currentCategory = li.dataset.category;

    refs.categoryDropdownLabel.textContent = currentCategory;

    loadBooksByCategory(currentCategory);
    setActiveCategory(currentCategory);
    refs.dropdownList.classList.remove('is-open');
    refs.dropdownBtn.classList.remove('open');
  });

  refs.categoryList.addEventListener('click', e => {
    const btn = e.target.closest('[data-category]');
    if (!btn) return;
    currentCategory = btn.dataset.category;
    loadBooksByCategory(currentCategory);
    setActiveCategory(currentCategory);
  });

  refs.showMoreBtn.addEventListener('click', loadMoreBooks);

  await loadTrendingBooks();

  document.addEventListener('click', e => {
    const btn = e.target.closest('.learn-more-btn');
    if (!btn) return;
    const bookId = btn.dataset.id;
    if (!bookId) return;
    import('./book-modal.js')
      .then(({ openModal }) => {
        openModal(bookId);
      })
      .catch(err => {
        console.log('Failed to open modal:', err);
      });
  });

  document.addEventListener('click', e => {
    const isClickInside =
      refs.dropdownBtn.contains(e.target) ||
      refs.dropdownList.contains(e.target);

    if (!isClickInside) {
      refs.dropdownList.classList.remove('is-open');
      refs.dropdownBtn.classList.remove('open');
    }
  });
}

initBooksSection();
