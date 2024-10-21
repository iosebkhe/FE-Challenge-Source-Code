import { populateResultsData } from './results';

function toggleLoadingSection(show) {
  const loadingSection = document.getElementById('loading');
  const mainContent = document.getElementById('main-content');

  if (show) {
    // Show the loading section and hide the main content
    loadingSection.classList.remove('d-none');
    mainContent.classList.add('d-none');
  } else {
    // Hide the loading section and show the main content
    loadingSection.classList.add('d-none');
    mainContent.classList.remove('d-none');
  }
}

function showResultsSection() {
  const mainFormSection = document.getElementById('main-form');
  const searchAgainSection = document.getElementById('search-again');
  const featuresSection = document.getElementById('features');
  const resultsSection = document.getElementById('results');

  populateResultsData();

  mainFormSection.classList.add('d-none');
  featuresSection.classList.add('d-none');
  searchAgainSection.classList.remove('d-none');
  resultsSection.classList.remove('d-none');

  // Hide the loading section and show the main content
  toggleLoadingSection(false);
}

// Email validation function
function validateEmail(email) {
  const emailRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailRegEx.test(email);
}

// Phone validation function
function validatePhone(phone) {
  // Phone number validation (10 digits only)
  const phoneRegEx = /^\d{10}$/;
  return phoneRegEx.test(phone);
}

// Helper functions for showing and clearing errors
function showError(input) {
  input.parentNode.classList.add('error');
}

function clearError(input) {
  input.parentNode.classList.remove('error');
}

function initInputValidation() {
  document.querySelectorAll('input[type="text"]').forEach(function (input) {
    input.addEventListener('keypress', function (event) {
      const inputType = input.getAttribute('name');
      let isValid = false;

      // Clear error before validation
      clearError(input);

      if (inputType === 'email') {
        const email = input.value.toLowerCase();
        isValid = validateEmail(email);
      } else if (inputType === 'phone') {
        const phone = input.value;
        isValid = validatePhone(phone);
      }

      const keycode = event.keyCode ? event.keyCode : event.which;
      if (keycode == '13') {
        event.preventDefault();
        localStorage.clear();

        if (isValid) {
          // Show loading section and hide main content
          toggleLoadingSection(true);

          const proxyurl = '';
          const url = inputType === 'email'
            ? 'https://ltvdataapi.devltv.co/api/v1/records?email=' + input.value
            : 'https://ltvdataapi.devltv.co/api/v1/records?phone=' + input.value;

          fetch(proxyurl + url)
            .then(function (response) {
              return response.text();
            })
            .then(function (contents) {
              localStorage.setItem('userObject', contents);
              showResultsSection();
            })
            .catch(function (e) {
              console.log(e);
            }).finally(function () {
              // Hide loading section and show main content
              toggleLoadingSection(false);
            });
        } else {
          // Show error for invalid input
          showError(input);
        }
      }
    });
  });
}

function initSearchButton() {
  document.querySelectorAll('.js-btn-search').forEach(function (button) {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.clear(); // Clears storage for next request
      const selector = e.currentTarget.dataset.form;
      const emailInput = document.getElementById(`email-${selector}-input`);
      const phoneInput = document.getElementById(`phone-${selector}-input`);
      const email = emailInput ? emailInput.value.toLowerCase() : '';
      const phone = phoneInput ? phoneInput.value : '';

      let isValid = false;

      // Clear previous errors
      clearError(emailInput);
      clearError(phoneInput);

      // Check for empty inputs
      if (!email && !phone) {
        showError(emailInput);
        showError(phoneInput);
      } else if (email && validateEmail(email)) {
        isValid = true;
        clearError(emailInput);
      } else if (phone && validatePhone(phone)) {
        isValid = true;
        clearError(phoneInput);
      }

      if (isValid) {
        // Show loading section and hide main content
        toggleLoadingSection(true);

        const proxyurl = '';
        const url = email
          ? 'https://ltvdataapi.devltv.co/api/v1/records?email=' + email
          : 'https://ltvdataapi.devltv.co/api/v1/records?phone=' + phone;

        fetch(proxyurl + url)
          .then(function (response) {
            return response.text();
          })
          .then(function (contents) {
            localStorage.setItem('userObject', contents);
            showResultsSection();
          })
          .catch(function (e) {
            console.log(e);
          }).finally(function () {
            // Hide loading section and show main content
            toggleLoadingSection(false);
          });
      } else {
        // Show error for email
        if (email) showError(emailInput);
        // Show error for phone
        if (phone) showError(phoneInput);
      }
    });
  });
}

export { initInputValidation, initSearchButton };
