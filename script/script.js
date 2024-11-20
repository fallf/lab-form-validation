// Get form elements
const registrationForm = document.getElementById("registration");
const loginForm = document.getElementById("login");
const errorDisplay = document.getElementById("errorDisplay");

// Display error messages in the provided error display container
function showError(message) {
  errorDisplay.textContent = message;
  errorDisplay.style.display = "block";
}

// Clear error messages
function clearError() {
  errorDisplay.style.display = "none";
}

// Username validation for registration form
function validateUsername(username) {
  const usernameVal = username.value.trim().toLowerCase();
  const uniqueChars = new Set(usernameVal).size;

  if (usernameVal.length < 4) {
    showError("Username must be at least 4 characters long.");
    username.focus();
    return false;
  }
  if (uniqueChars < 2) {
    showError("Username must contain at least two unique characters.");
    username.focus();
    return false;
  }
  if (!/^[a-z0-9]+$/i.test(usernameVal)) {
    showError("Username cannot contain special characters or whitespace.");
    username.focus();
    return false;
  }
  if (localStorage.getItem(usernameVal)) {
    showError("That username is already taken.");
    username.focus();
    return false;
  }
  return usernameVal;
}

// Email validation for registration form
function validateEmail(email) {
  const emailVal = email.value.trim().toLowerCase();
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal) ||
    emailVal.endsWith("@example.com")
  ) {
    showError(
      "Please enter a valid email address and avoid using 'example.com'."
    );
    email.focus();
    return false;
  }
  return emailVal;
}

// Password validation for registration form
function validatePassword(password, confirmPassword, username) {
  const passwordVal = password.value;
  const confirmPasswordVal = confirmPassword.value;
  if (passwordVal.length < 12) {
    showError("Password must be at least 12 characters long.");
    password.focus();
    return false;
  }
  if (!/[A-Z]/.test(passwordVal) || !/[a-z]/.test(passwordVal)) {
    showError("Password must contain both uppercase and lowercase letters.");
    password.focus();
    return false;
  }
  if (!/[0-9]/.test(passwordVal)) {
    showError("Password must contain at least one number.");
    password.focus();
    return false;
  }
  if (!/[\W_]/.test(passwordVal)) {
    showError("Password must contain at least one special character.");
    password.focus();
    return false;
  }
  if (
    passwordVal.toLowerCase().includes("password") ||
    passwordVal.toLowerCase().includes(username.toLowerCase())
  ) {
    showError("Password cannot contain 'password' or the username.");
    password.focus();
    return false;
  }
  if (passwordVal !== confirmPasswordVal) {
    showError("Passwords must match.");
    confirmPassword.focus();
    return false;
  }
  return passwordVal;
}

// Validate terms checkbox for registration form
function validateTerms(terms) {
  if (!terms.checked) {
    showError("You must agree to the Terms of Use.");
    terms.focus();
    return false;
  }
  return true;
}

// Registration form submission
registrationForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  clearError();

  const username = validateUsername(registrationForm.elements["username"]);
  const email = validateEmail(registrationForm.elements["email"]);
  const password = validatePassword(
    registrationForm.elements["password"],
    registrationForm.elements["passwordCheck"],
    username
  );
  const termsAccepted = validateTerms(registrationForm.elements["terms"]);

  if (username && email && password && termsAccepted) {
    // Store user data in localStorage
    localStorage.setItem(username, JSON.stringify({ email, password }));

    // Clear form fields and show success message
    registrationForm.reset();
    alert("Registration successful!");
  }
});

// Login form submission
loginForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  clearError();

  const usernameVal = loginForm.elements["username"].value.trim().toLowerCase();
  const passwordVal = loginForm.elements["password"].value;

  if (!usernameVal) {
    showError("Username cannot be blank.");
    loginForm.elements["username"].focus();
    return;
  }
  if (!passwordVal) {
    showError("Password cannot be blank.");
    loginForm.elements["password"].focus();
    return;
  }

  const user = JSON.parse(localStorage.getItem(usernameVal));
  if (!user || user.password !== passwordVal) {
    showError("Invalid username or password.");
    return;
  }

  // Clear form fields and show success message
  loginForm.reset();
  alert(
    "Login successful!" +
      (loginForm.elements["persist"].checked
        ? " You will remain logged in."
        : "")
  );
});
