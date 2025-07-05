import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const footerFormEl = document.querySelector('.footer-form');
const footerEmailInputEl = document.querySelector('#user-email');

footerFormEl.addEventListener('submit', onHandleFooterForm);

function onHandleFooterForm(event) {
  event.preventDefault();

  const email = footerEmailInputEl.value.trim();
  const emailPattern = /^\w+(\.\w+)?@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

  // Валідація email
  if (!emailPattern.test(email)) {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a valid email address',
      position: 'topRight',
    });
    return;
  }

  // Отримання підписок з localStorage
  let subscribers = JSON.parse(localStorage.getItem('subscribers')) || [];

  // Перевірка на дублікати
  if (subscribers.includes(email)) {
    iziToast.warning({
      title: 'Notice',
      message: 'This email is already subscribed',
      position: 'topRight',
    });
    footerFormEl.reset();
    return;
  }

  // Збереження нового email
  subscribers.push(email);
  localStorage.setItem('subscribers', JSON.stringify(subscribers));

  // Повідомлення про успішну підписку
  iziToast.success({
    title: 'Success',
    message: 'Thank you for subscribing!',
    position: 'topRight',
  });

  // Очищення форми
  footerFormEl.reset();
}
