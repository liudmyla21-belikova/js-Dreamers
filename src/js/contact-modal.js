// Ensure DOM is loaded before attaching listeners
document.addEventListener('DOMContentLoaded', () => {
  const contactModal = document.getElementById('contact-modal');
  const contactModalCloseBtn = contactModal?.querySelector(
    '.contact-modal-close'
  );
  const contactModalForm = document.getElementById('contact-modal-form');
  const openContactModalBtn = document.getElementById('open-contact-modal-btn');

  if (
    !contactModal ||
    !contactModalCloseBtn ||
    !contactModalForm ||
    !openContactModalBtn
  ) {
    console.error('Contact Modal: One or more required elements are missing.');
    return;
  }

  // Open modal
  openContactModalBtn.addEventListener('click', () => {
    contactModal.classList.remove('is-hidden');
    document.body.style.overflow = 'hidden';
    contactModal.querySelector('input[name="name"]').focus();
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

    if (!name || !email || !message) {
      alert('Please fill out all fields correctly.');
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

  // Close modal function
  function closeContactModal() {
    contactModal.classList.add('is-hidden');
    document.body.style.overflow = '';
    contactModalForm.reset();
  }
});
