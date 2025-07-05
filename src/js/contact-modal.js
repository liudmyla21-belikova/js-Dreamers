const contactModal = document.getElementById('contact-modal'); //
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

  // Close modal on backdrop click
  contactModal.addEventListener('click', e => {
    if (e.target === contactModal) {
      closeContactModal();
    }
  });

  // Close modal on Escape key press
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

    if (!name || !email) {
      alert('Please fill out all required fields.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    console.log('Name:', name, 'Email:', email, 'Message:', message);
    alert(`Thank you, ${name}! Your message has been sent.`);
    closeContactModal();
  });

  function closeContactModal() {
    contactModal.classList.add('is-hidden');
    document.body.style.overflow = '';
    contactModalForm.reset();
    contactModalSubtitle.textContent = '';
  }
}
