// ============================
// cart.js — all cart logic
// ============================
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { getBookId } from './books';

// ======= DOM refs =======
const refs = {
  backdrop: document.getElementById('cart-modal-backdrop'),
  list: document.getElementById('cart-items-list'),
  total: document.getElementById('cart-total-price'),
  openBtn: document.getElementById('open-cart-btn'),
  closeBtn: document.getElementById('cart-close-btn'),
  buyBtn: document.getElementById('cart-buy-btn'),
  countBadge: document.getElementById('cart-count-badge'),
};

// ======= Storage helpers =======
export function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

export function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// ======= Core API =======
export function addToCart(book, qty = 1, openCartAfter = false) {
  if (!book || !qty) return;
  const id = getBookId(book);
  if (!id) {
    console.error('Book has no stable id – cannot add to cart');
    return;
  }

  const cart = getCart();
  const existing = cart.find(i => i.id === id);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id,
      title: book.title,
      author: book.author,
      price: book.price,
      image: book.book_image || book.image || '',
      qty,
    });
  }

  saveCart(cart);
  iziToast.success({
    title: '🛒',
    message: 'Додано до корзини!',
    backgroundColor: '#198754',
    titleColor: '#fff',
    messageColor: '#fff',
    position: 'bottomRight',
  });

  renderCart();
  updateCartBadge();
  if (openCartAfter) openCart();
}

export function removeFromCart(id) {
  const cart = getCart().filter(i => String(i.id) !== String(id));
  saveCart(cart);
  renderCart();
  updateCartBadge();
}

function formatPrice(v) {
  return `$${(+v).toFixed(2)}`;
}

export function renderCart() {
  if (!refs.list) return;
  const cart = getCart();
  refs.list.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    refs.list.innerHTML = '<li>Your cart is empty.</li>';
  } else {
    for (const item of cart) {
      const itemTotal = +item.price * item.qty;
      total += itemTotal;

      const li = document.createElement('li');
      li.innerHTML = `
        <div class="cart-item">
          <img class="cart-item-image" src="${item.image}" alt="${
        item.title
      }" />
          <div class="cart-item-info">
            <strong>${item.title}</strong><br />
            <small>by ${item.author}</small><br />
            Price: ${formatPrice(item.price)} × ${item.qty} = ${formatPrice(
        itemTotal
      )}<br />
            <button class="remove-from-cart-btn" data-id="${
              item.id
            }">Remove</button>
          </div>
        </div>`;
      refs.list.appendChild(li);
    }
  }

  refs.total.textContent = formatPrice(total);

  refs.list.querySelectorAll('.remove-from-cart-btn').forEach(btn => {
    btn.onclick = e => {
      e.stopPropagation();
      removeFromCart(btn.dataset.id);
    };
  });
}

function updateCartBadge() {
  if (!refs.countBadge) return;
  const cart = getCart();
  const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
  refs.countBadge.textContent = totalQty > 0 ? totalQty : '';
}

export function openCart() {
  renderCart();
  refs.backdrop.classList.remove('hidden');
}

export function closeCart() {
  refs.backdrop.classList.add('hidden');
}

// ======= Wire up buttons =======
if (refs.openBtn) refs.openBtn.onclick = openCart;
if (refs.closeBtn) refs.closeBtn.onclick = closeCart;
if (refs.backdrop)
  refs.backdrop.addEventListener('click', e => {
    if (e.target === refs.backdrop) closeCart();
  });

// ======= Buy button logic =======
if (refs.buyBtn)
  refs.buyBtn.onclick = () => {
    const cart = getCart();
    if (cart.length === 0) {
      iziToast.warning({
        title: '😕',
        message: 'Кошик порожній!',
        position: 'topRight',
      });
      return;
    }

    localStorage.removeItem('cart');
    renderCart();
    updateCartBadge();
    closeCart();

    iziToast.success({
      title: '✅',
      message: 'Дякуємо за замовлення! Ми з вами зв’яжемося найближчим часом.',
      position: 'center',
      timeout: 5000,
      backgroundColor: '#28a745',
      titleColor: '#fff',
      messageColor: '#fff',
    });
  };

// ======= External trigger support =======
window.openCart = openCart;
window.addToCart = addToCart;
window.updateCartBadge = updateCartBadge;

// ======= Initialize badge on load =======
updateCartBadge();
