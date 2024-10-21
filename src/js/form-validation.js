import { populateResultsData } from './results';

// Toggles the loading section visibility.
function toggleLoadingSection(show) {
  const loadingSection = document.getElementById('loading');
  const mainContent = document.getElementById('main-content');
  loadingSection.classList.toggle('d-none', !show);
  mainContent.classList.toggle('d-none', show);
}


//  Displays the results section and populates data.

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

// Validates email format using a regular expression.
function validateEmail(email) {
  const emailRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailRegEx.test(email);
}

// Validates phone number format (10 digits).
function validatePhone(phone) {
  // Checks for 10 digits only
  const phoneRegEx = /^\d{10}$/;
  return phoneRegEx.test(phone);
}

// Helper function to show an error on the input field.
function showError(input) {
  input.parentNode.classList.add('error');
}

// Helper function to clear the error from the input field.
function clearError(input) {
  input.parentNode.classList.remove('error');
}

// Initializes input validation by adding event listeners.
function initInputValidation() {
  document.querySelectorAll('input[type="email"], input[type="tel"]').forEach(function (input) {
    input.addEventListener('keypress', function (event) {
      const inputType = input.getAttribute('name');
      const keycode = event.keyCode || event.which;

      if (keycode === 13) { // Enter key
        event.preventDefault();
        const value = input.value.trim();

        // Clear error before validation
        clearError(input);

        // Check for empty input
        if (!value) {
          showError(input); // Show error if input is empty
          return;
        }

        // Validate input based on type
        const isValid = inputType === 'email' ? validateEmail(value) : validatePhone(value);

        if (isValid) {
          // / Trigger search if valid
          handleSearch(inputType, value);
        } else {
          // Show error if invalid
          showError(input);
        }
      }
    });
  });
}

//  Handles the search operation based on input type and value.
function handleSearch(inputType, value) {
  toggleLoadingSection(true);
  const proxyurl = '';
  const url = `https://ltvdataapi.devltv.co/api/v1/records?${inputType}=${value}`;

  fetch(proxyurl + url)
    .then(response => response.text())
    .then(contents => {
      localStorage.setItem('userObject', contents);
      showResultsSection();
    })
    .catch(console.error)
    .finally(() => {
      toggleLoadingSection(false);
    });
}

/**
 * Initializes the search button functionality.
 */
function initSearchButton() {
  document.querySelectorAll('.js-btn-search').forEach(function (button) {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.clear(); // Clear storage for next request
      const selector = e.currentTarget.dataset.form;
      const emailInput = document.getElementById(`email-${selector}-input`);
      const phoneInput = document.getElementById(`phone-${selector}-input`);

      const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';

      // Clear previous errors
      clearError(emailInput);
      clearError(phoneInput);

      let isValid = false;

      // Check for empty inputs
      if (!email) {
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
        handleSearch(email ? 'email' : 'phone', email || phone);
      } else {
        // Show error for empty or invalid inputs
        if (email) showError(emailInput);
        if (phone) showError(phoneInput);
      }
    });
  });
}

export { initInputValidation, initSearchButton };
