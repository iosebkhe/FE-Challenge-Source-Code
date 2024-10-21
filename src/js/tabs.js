// /**
//  * initTabs: Initializes the tab functionality for all forms with email and phone input fields.
//  * 
//  * - This function uses event delegation to handle clicks on tab buttons. It listens for clicks
//  *   on any element with the 'tab' class and applies the logic for switching between the 
//  *   "Email Address" and "Phone Number" input fields.
//  * 
//  * - The event listener is attached to the document, which allows it to handle clicks on
//  *   any tabs across multiple forms. This is more efficient and scalable than adding 
//  *   individual event listeners to each form.
//  * 
//  * - When a tab is clicked, the closest parent form is identified using `closest('form')`, 
//  *   and the appropriate email or phone input fields are shown or hidden based on the tab clicked.
//  * 
//  * This approach ensures:
//  *  1. Scalability for multiple forms.
//  *  2. Efficient handling of events by attaching only one listener at the document level.
//  *  3. Cleaner, more maintainable code by avoiding redundant event listener setups.
//  */

function initTabs() {
  // Add event listener to the document level to handle clicks on any tab
  document.addEventListener('click', function (event) {
    // Check if the clicked element is a tab
    if (event.target.classList.contains('tab')) {
      // Prevent the default behavior of the button (form submission)
      event.preventDefault();

      // Identify the parent form of the clicked tab
      const formContainer = event.target.closest('form');
      const emailInputContainer = formContainer.querySelector('.email-input');
      const phoneInputContainer = formContainer.querySelector('.phone-input');
      const emailInputField = formContainer.querySelector('input[name="email"]');
      const phoneInputField = formContainer.querySelector('input[name="phone"]');
      const tabs = formContainer.querySelectorAll('.tab');

      // Remove 'tab-active' class from all tabs in the current form
      tabs.forEach(t => t.classList.remove('tab-active'));

      // Add 'tab-active' class to the clicked tab
      event.target.classList.add('tab-active');

      // Show or hide input fields based on the clicked tab
      if (event.target.classList.contains("tab-email")) {
        emailInputContainer.classList.remove('d-none'); // Show email input
        phoneInputContainer.classList.add('d-none'); // Hide phone input
        phoneInputField.value = ''; // Clear phone input field
      } else if (event.target.classList.contains("tab-phone")) {
        emailInputContainer.classList.add('d-none'); // Hide email input
        phoneInputContainer.classList.remove('d-none'); // Show phone input
        emailInputField.value = ''; // Clear email input field
      }
    }
  });
}

// Initialize the tabs functionality
export { initTabs };
