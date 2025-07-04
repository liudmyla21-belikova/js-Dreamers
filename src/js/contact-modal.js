import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const contactModal = document.getElementById('contact-modal');
const contactModalCloseBtn = contactModal?.querySelector(
  '.contact-modal-close'
);
const contactModalForm = document.getElementById('contact-modal-form');
const contactModalSubtitle = contactModal?.querySelector(
  '.contact-modal-subtitle'
);
const eventRegisterButtons = document.querySelectorAll('[data-event-title]');

if (
  !contactModal ||
  !contactModalCloseBtn ||
  !contactModalForm ||
  !contactModalSubtitle
) {
  console.error('Contact Modal: One or more required elements are missing.');
} else {
  // Open modal with dynamic event title
  eventRegisterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const eventTitle =
        button.getAttribute('data-event-title') || 'Event Registration';
      contactModalSubtitle.textContent = eventTitle;

      contactModal.classList.remove('is-hidden');
      document.body.style.overflow = 'hidden';
      contactModal.querySelector('input[name="name"]').focus();
    });
  });

  // Close modal on close button click
  contactModalCloseBtn.addEventListener('click', closeContactModal);
  contactModal.addEventListener('click', e => {
    if (e.target === contactModal) closeContactModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !contactModal.classList.contains('is-hidden')) {
      closeContactModal();
    }
  });

  // Handle form submission
  contactModalForm.addEventListener('submit', e => {
    e.preventDefault();

    const name = contactModalForm.elements.name.value.trim();
    const email = contactModalForm.elements.email.value.trim();
    const message = contactModalForm.elements.message.value.trim();
  // Check for required fields
    if (!name || !email) { 
      iziToast.error({
        title: 'Error',
        message: 'Please fill out all required fields.',
        position: 'topRight',
      });
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      iziToast.error({
        title: 'Error',
        message: 'Please enter a valid email address.',
        position: 'topRight',
      });
      return;
    }

    iziToast.success({
      title: 'Success',
      message: `Thank you, ${name}! Your message has been sent.`,
      position: 'topRight',
    });

    console.log('Name:', name, 'Email:', email, 'Message:', message);
    closeContactModal();
  });

  function closeContactModal() {
    contactModal.classList.add('is-hidden');
    document.body.style.overflow = '';
    contactModalForm.reset();
    contactModalSubtitle.textContent = '';
  }
}
