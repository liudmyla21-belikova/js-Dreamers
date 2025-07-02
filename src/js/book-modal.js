

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

const bookModal = document.querySelector('.book-modal');
const closeBtnBookModal = document.querySelector('.close-btn-book-modal');

const bookImageModal = document.querySelector('.book-image-book-modal');
const bookTitleModal = document.querySelector('.book-title-book-modal');
const bookAuthorModal = document.querySelector('.book-author-book-modal');
const bookPriceModal = document.querySelector('.book-price-book-modal');

const quantityInputModal = document.querySelector('.quantity-input-book-modal');
const decreaseBtnModal = document.querySelector('.decrease-btn-book-modal');
const increaseBtnModal = document.querySelector('.increase-btn-book-modal');
const addToCartBtnModal = document.querySelector('.add-to-cart-btn-book-modal');
const buyNowBtnModal = document.querySelector('.buy-now-btn-book-modal');

const bookAccordionModal = document.querySelector('.book-accordion-book-modal');


export async function openBookModal(bookId) {
    if (!bookId) {
        console.error('No book ID provided to openBookModal.');
        iziToast.error({ message: 'Book ID is missing. Cannot open details.', position: 'topRight' });
        return;
    }

    
    const loaderElement = document.querySelector('.some-loader-class');
    if (loaderElement) loaderElement.classList.remove('is-hidden');

    try {
        const bookData = await getBookDetails(bookId);

        bookImageModal.src = bookData.book_image;
        bookImageModal.alt = bookData.title + ' cover';
        bookTitleModal.textContent = bookData.title;
        bookAuthorModal.textContent = bookData.author;
        bookPriceModal.textContent = `Price: $${(typeof bookData.price === 'number' ? bookData.price : 0).toFixed(2)}`;
        quantityInputModal.value = 1;

       
        renderAccordion(bookData);

        bookModal.classList.remove('is-hidden');
        document.body.classList.add('window-book-modal-open'); 


        window.addEventListener('keydown', onEscapePress);

    } catch (error) {
        console.error('Error opening book modal:', error);
    } finally {
        if (loaderElement) loaderElement.classList.add('is-hidden');
    }
}


function closeBookModal() {
    bookModal.classList.add('is-hidden');
    document.body.classList.remove('window-book-modal-open'); 
    window.removeEventListener('keydown', onEscapePress); 
}


function onEscapePress(event) {
    if (event.key === 'Escape') {
        closeBookModal();
    }
}


closeBtnBookModal.addEventListener('click', closeBookModal);


bookModal.addEventListener('click', (event) => {
    if (event.target === bookModal) { 
        closeBookModal();
    }
});



decreaseBtnModal.addEventListener('click', () => {
    let quantity = parseInt(quantityInputModal.value);
    if (quantity > 1) {
        quantityInputModal.value = quantity - 1;
    }
});


increaseBtnModal.addEventListener('click', () => {
    let quantity = parseInt(quantityInputModal.value);
    quantityInputModal.value = quantity + 1;
});

addToCartBtnModal.addEventListener('click', () => {
    const quantity = parseInt(quantityInputModal.value);
    console.log(`Додано до кошика: ${quantity} книга(книги)`);
    iziToast.success({
        message: `Додано ${quantity} книга(книги) до кошика!`,
        position: 'bottomRight'
    });
});

buyNowBtnModal.addEventListener('click', (event) => {
    event.preventDefault();
    iziToast.success({
        message: 'Дякуємо за покупку!',
        position: 'topCenter'
    });
    closeBookModal();
});


function renderAccordion(bookData) {
    
    bookAccordionModal.innerHTML = '';


    const detailsContent = bookData.description || 'I Will Find You is a gripping thriller by the master of suspense, Harlan Coben. The story follows David Burroughs, a former prisoner wrongfully convicted of murdering his own son. When he discovers a clue suggesting his son might still be alive, David escapes from prison to uncover the truth. Fast-paced, emotional, and full of unexpected twists — this novel will keep you hooked until the very last page.';
    const shippingContent = bookData.shipping_info || 'We ship across the United States within 2–5 business days. All orders are processed through USPS or a reliable courier service. Enjoy free standard shipping on orders over $50.';
    const returnsContent = bookData.return_policy || 'You can return an item within 14 days of receiving your order, provided it hasn’t been used and is in its original condition. To start a return, please contact our support team — we’ll guide you through the process quickly and hassle-free.';

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