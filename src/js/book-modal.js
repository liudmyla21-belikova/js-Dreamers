import Accordion from 'accordion-js';
import 'accordion-js/dist/accordion.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { addToCart } from './cart.js';

// ======= DOM refs =======
const refs = {
  backdrop: document.getElementById('books-modal-backdrop'),
  modal: document.getElementById('books-modal'),
  modalClose: document.getElementById('books-modal-close'),
  qtyInput: document.getElementById('books-qty-input'),
  qtyDec: document.getElementById('books-qty-dec'),
  qtyInc: document.getElementById('books-qty-inc'),
  addToCart: document.getElementById('books-add-to-cart'),
  modalForm: document.getElementById('books-modal-form'),
  detailsTxt: document.getElementById('books-details-text'),
  shippingTxt: document.getElementById('books-shipping-text'),
  returnsTxt: document.getElementById('books-returns-text'),
  modalImage: document.getElementById('books-modal-image'),
  modalTitle: document.getElementById('books-modal-title'),
  modalAuthor: document.getElementById('books-modal-author'),
  modalPrice: document.getElementById('books-modal-price'),
};

let currentBook = null;
let scrollY = 0;
const DEFAULT_SHIPPING =
  'We ship across the Ukraine within 2–5 business days. All orders are processed through USPS or a reliable courier service. Enjoy free standard shipping on orders over $50.';
const DEFAULT_RETURNS =
  'You can return an item within 14 days of receiving your order, provided it hasn’t been used and is in its original condition. To start a return, please contact our support team — we’ll guide you through the process quickly and hassle-free.';

let booksAccordionInstance = null;

function resetAccordion() {
  document.querySelectorAll('.accordion-container .ac').forEach(item => {
    item.classList.remove('is-active');
  });
  document.querySelectorAll('.accordion-container .ac-panel').forEach(p => {
    p.style.maxHeight = '';
  });
  document.querySelectorAll('.accordion-container .ac-trigger').forEach(t => {
    t.setAttribute('aria-expanded', 'false');
    t.classList.remove('is-active');
  });
}

function fillModal(book) {
  refs.modalImage.src = book.book_image || book.image || '';
  refs.modalTitle.textContent = book.title || '';
  refs.modalAuthor.textContent = book.author || '';
  refs.modalPrice.textContent = book.price || '';
  refs.detailsTxt.textContent =
    book.description?.trim() || 'No details available';
  refs.shippingTxt.textContent = book.shipping?.trim() || DEFAULT_SHIPPING;
  refs.returnsTxt.textContent = book.returns?.trim() || DEFAULT_RETURNS;
  refs.qtyInput.value = 1;
}

// ======= Modal control =======
export function openModal(id) {
  const raw = localStorage.getItem(`book-${id}`);
  if (!raw) return;

  currentBook = JSON.parse(raw);
  refs.modal.dataset.bookId = id; // fallback id

  fillModal(currentBook);

  if (booksAccordionInstance) booksAccordionInstance.destroy();
  resetAccordion();
  booksAccordionInstance = new Accordion('.accordion-container', {
    duration: 200,
    showMultiple: true,
  });

  scrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';

  refs.backdrop.classList.add('books-modal-backdrop--visible');
  document.body.classList.add('no-scroll');
}

export function closeModal() {
  refs.backdrop.classList.remove('books-modal-backdrop--visible');
  document.body.classList.remove('no-scroll');
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  window.scrollTo(0, scrollY);

  if (booksAccordionInstance) {
    booksAccordionInstance.closeAll();
    booksAccordionInstance.destroy();
    booksAccordionInstance = null;
  }

  resetAccordion();
  currentBook = null;
  refs.qtyInput.value = 1;
}

// ======= Event listeners =======
function initModalEvents() {
  refs.modalClose.onclick = closeModal;

  refs.backdrop.addEventListener('click', e => {
    if (!refs.modal.contains(e.target)) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  refs.qtyDec.onclick = () => {
    refs.qtyInput.value = Math.max(1, +refs.qtyInput.value - 1);
  };
  refs.qtyInc.onclick = () => {
    refs.qtyInput.value = +refs.qtyInput.value + 1;
  };

  refs.addToCart.onclick = () => {
    if (!currentBook) {
      iziToast.error({
        title: '❌',
        message: 'Книга не загружена',
        position: 'topRight',
      });
      return;
    }
    addToCart(currentBook, +refs.qtyInput.value);
  };

  refs.modalForm.onsubmit = e => {
    e.preventDefault();

    const qty = +refs.qtyInput.value;
    const bookId = refs.modal.dataset.bookId;
    const raw = localStorage.getItem(`book-${bookId}`);
    if (!raw) return;

    const book = JSON.parse(raw);
    addToCart(book, qty, true); // <== теперь true — это открыть корзину
  };
}

initModalEvents();
// window.openCart = openCart;
