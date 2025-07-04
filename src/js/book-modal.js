

import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import Accordion from 'accordion-js';
import 'accordion-js/dist/accordion.min.css';

const BASE_URL = 'https://books-backend.p.goit.global';

async function getBookDetails(bookId) {
    try {
        const response = await axios.get(`${BASE_URL}/books/${bookId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching book details for ID "${bookId}":`, error);
        iziToast.error({ message: 'Failed to fetch book details. Please check your network.', position: 'topRight' });
        throw error;
    }
}

let bookModal = document.querySelector('.book-modal');

let closeBtnBookModal = null;
let bookImageModal = null;
let bookTitleModal = null;
let bookAuthorModal = null;
let bookPriceModal = null;
let quantityInputModal = null;
let decreaseBtnModal = null;
let increaseBtnModal = null;
let addToCartBtnModal = null;
let buyNowBtnModal = null;
let bookAccordionModal = null;


function createModalContent() {
    if (!bookModal) {
        console.error('Initial .book-modal container not found in HTML. Cannot create content.');
        return;
    }

    const modalContentMarkup = `
        <div class="window-book-modal">
            <button type="button" class="close-btn-book-modal">
                <svg class="close-icon-book-modal" width="32" height="32">
                    <use href="/img/webp/sprite.svg#icon-x"></use>
                </svg>
            </button>

            <div class="book-details-book-modal">
                <img src="" alt="Book Cover" class="book-image-book-modal">
                <div class="book-info-book-modal">
                    <h2 class="book-title-book-modal"></h2>
                    <p class="book-author-book-modal"></p>
                    <p class="book-price-book-modal"></p>
                    
                    <form class="order-form-book-modal">
                        <div class="quantity-control-book-modal">
                            <button type="button" class="quantity-btn-book-modal decrease-btn">
                                <svg class="plus-icon-book-modal" width="22" height="22">
                                    <use href="/img/webp/sprite.svg#con-minus"></use>
                                </svg>
                            </button>
                            <input type="number" class="quantity-input-book-modal" value="1" min="1" readonly>
                            <button type="button" class="quantity-btn-book-modal increase-btn">
                                <svg class="minus-icon-book-modal" width="22" height="22">
                                    <use href="/img/webp/sprite.svg#icon-plus"></use>
                                </svg>
                            </button>
                        </div>
                        <div class="btn-order-book-modal">
                            <button type="button" class="add-to-cart-btn-book-modal">Add To Cart</button>
                            <button type="submit" class="buy-now-btn-book-modal">Buy Now</button>
                        </div>
                    </form>
                    
                    <div class="book-accordion-book-modal">
                    </div>
                </div>
            </div>
        </div>
    `;

    bookModal.innerHTML = modalContentMarkup;

    
    closeBtnBookModal = bookModal.querySelector('.close-btn-book-modal');
    bookImageModal = bookModal.querySelector('.book-image-book-modal');
    bookTitleModal = bookModal.querySelector('.book-title-book-modal');
    bookAuthorModal = bookModal.querySelector('.book-author-book-modal');
    bookPriceModal = bookModal.querySelector('.book-price-book-modal');
    quantityInputModal = bookModal.querySelector('.quantity-input-book-modal');
    decreaseBtnModal = bookModal.querySelector('.decrease-btn-book-modal');
    increaseBtnModal = bookModal.querySelector('.increase-btn-book-modal');
    addToCartBtnModal = bookModal.querySelector('.add-to-cart-btn-book-modal');
    buyNowBtnModal = bookModal.querySelector('.buy-now-btn-book-modal');
    bookAccordionModal = bookModal.querySelector('.book-accordion-book-modal');


    addModalEventListeners();
}

function addModalEventListeners() {
    if (closeBtnBookModal) {
        closeBtnBookModal.addEventListener('click', closeBookModal);
    } else {
        console.warn('Close button for book modal not found after content creation.');
    }

    if (bookModal) { 
        bookModal.addEventListener('click', (event) => {
            if (event.target === bookModal) {
                closeBookModal();
            }
        });
    }

    
    if (decreaseBtnModal && quantityInputModal) decreaseBtnModal.addEventListener('click', () => {
        let quantity = parseInt(quantityInputModal.value);
        if (quantity > 1) {
            quantityInputModal.value = quantity - 1;
        }
    });

    if (increaseBtnModal && quantityInputModal) increaseBtnModal.addEventListener('click', () => {
        let quantity = parseInt(quantityInputModal.value);
        quantityInputModal.value = quantity + 1;
    });


    if (addToCartBtnModal) addToCartBtnModal.addEventListener('click', () => {
        const quantity = parseInt(quantityInputModal.value);
        console.log(`Додано до кошика: ${quantity} книга(книги)`);
        iziToast.success({
            message: `Додано ${quantity} книга(книги) до кошика!`,
            position: 'bottomRight'
        });
    });

    if (buyNowBtnModal) buyNowBtnModal.addEventListener('click', (event) => {
        event.preventDefault();
        iziToast.success({
            message: 'Дякуємо за покупку!',
            position: 'topCenter'
        });
        closeBookModal();
    });
}
 
export async function openBookModal(bookId) {
    if (!bookId) {
        console.error('No book ID provided to openBookModal.');
        iziToast.error({ message: 'Book ID is missing. Cannot open details.', position: 'topRight' });
        return;
    }

    if (!bookModal || !bookModal.querySelector('.window-book-modal')) {
        createModalContent();
    }

    if (loaderElement) loaderElement.classList.remove('is-hidden');

    try {
        const bookData = await getBookDetails(bookId);

        if (bookImageModal) bookImageModal.src = bookData.book_image;
        if (bookImageModal) bookImageModal.alt = bookData.title + ' cover';
        if (bookTitleModal) bookTitleModal.textContent = bookData.title;
        if (bookAuthorModal) bookAuthorModal.textContent = bookData.author;
        if (bookPriceModal) bookPriceModal.textContent = `Price: $${(typeof bookData.price === 'number' ? bookData.price : 0).toFixed(2)}`;
        if (quantityInputModal) quantityInputModal.value = 1;

    
        renderAccordion(bookData);

    
        if (bookModal) bookModal.classList.remove('is-hidden');
        document.body.classList.add('window-book-modal-open');

    
        window.addEventListener('keydown', onEscapePress);

    } catch (error) {
        console.error('Error opening book modal:', error);
    } finally {
        if (loaderElement) loaderElement.classList.add('is-hidden');
    }
}

function closeBookModal() {
    if (bookModal) {
        bookModal.classList.add('is-hidden');
    }
    document.body.classList.remove('window-book-modal-open');
    window.removeEventListener('keydown', onEscapePress);
}

function onEscapePress(event) {
    if (event.key === 'Escape') {
        closeBookModal();
    }
}

function renderAccordion(bookData) {
    if (!bookAccordionModal) {
        console.warn('Accordion container for book modal not found.');
        return;
    }
    bookAccordionModal.innerHTML = '';

    const detailsContent = bookData.description || 'No detailed description available.';
    const shippingContent = bookData.shipping_info || 'Shipping information not available.';
    const returnsContent = bookData.return_policy || 'Return policy not available.';

    const accordionMarkup = `
        <div class="accordion-container-book-modal">
            <div class="ac">
                <h2 class="ac-header">
                    <button type="button" class="ac-trigger">Details</button>
                </h2>
                <div class="ac-panel">
                    <p class="ac-text">${detailsContent}</p>
                </div>
            </div>

            <div class="ac">
                <h2 class="ac-header">
                    <button type="button" class="ac-trigger">Shipping</button>
                </h2>
                <div class="ac-panel">
                    <p class="ac-text">${shippingContent}</p>
                </div>
            </div>

            <div class="ac">
                <h2 class="ac-header">
                    <button type="button" class="ac-trigger">Returns</button>
                </h2>
                <div class="ac-panel">
                    <p class="ac-text">${returnsContent}</p>
                </div>
            </div>
        </div>
    `;

    bookAccordionModal.insertAdjacentHTML('beforeend', accordionMarkup);

    new Accordion('.accordion-container-book-modal', {
        duration: 300,
        showMultiple: false,
    });
}

