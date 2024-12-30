const BASE_URL = "http://localhost:3000/api/";

function displayMessage(elementId, message, isError = false) {
  const messageElement = document.getElementById(elementId);
  messageElement.textContent = message;
  messageElement.className = isError ? "error" : "success";
}

function validateEmail(email) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}

document.getElementById("signup-button").addEventListener("click", async (event) => {
  event.preventDefault(); // Prevent default form submission

  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  if (!name || !email || !password) {
    displayMessage("signup-message", "All fields are required!", true);
    return;
  }

  if (!validateEmail(email)) {
    displayMessage("signup-message", "Please enter a valid email address!", true);
    return;
  }

  try {
    const response = await axios.post(`${BASE_URL}signup`, { name, email, password });

    if (response.status === 200 || response.status === 201) {
      displayMessage("signup-message", "Sign-Up successful!");
      document.getElementById("signup-name").value = "";
      document.getElementById("signup-email").value = "";
      document.getElementById("signup-password").value = "";
    } else {
      displayMessage("signup-message", response.data.error || "Sign-Up failed!", true);
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      displayMessage("signup-message", error.response.data.error || "Invalid credentials", true);
    } else {
      displayMessage("signup-message", "Something went wrong!", true);
    }
  }
});

document.getElementById("login-button").addEventListener("click", async (event) => {
  event.preventDefault(); // Prevent default form submission

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    displayMessage("login-message", "All fields are required!", true);
    return;
  }

  if (!validateEmail(email)) {
    displayMessage("login-message", "Please enter a valid email address!", true);
    return;
  }

  try {
    const response = await axios.post(`http://localhost:3000/api/login`, { email, password });

    if (response.status === 200) {
      displayMessage("login-message", "Login successful!");
      console.log(response.data.isPremium);
      window.localStorage.setItem('user', response.data.UserId);
      window.localStorage.setItem('token',response.data.token);
      window.localStorage.setItem('email',email);

      window.localStorage.setItem('isPremium' ,response.data.isPremium);
      window.location.href = "../Expense/expense.html";
    } else {
      displayMessage("login-message", response.data.error || "Login failed!", true);
    }
  } catch (error) {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          displayMessage("login-message", "Email and password are required", true);
          break;
        case 404:
          displayMessage("login-message", "User with this email does not exist", true);
          break;
        case 401:
          displayMessage("login-message", "Incorrect password", true);
          break;
        default:
          displayMessage("login-message", "Login failed! Please try again later.", true);
      }
    } else {
      displayMessage("login-message", "An unexpected error occurred!", true);
    }
  }
});

document.getElementById("show-signup").addEventListener("click", () => {
  document.getElementById("signup-form").style.display = "block";
  document.getElementById("login-form").style.display = "none";
});

document.getElementById("show-login").addEventListener("click", () => {
  document.getElementById("signup-form").style.display = "none";
  document.getElementById("login-form").style.display = "block";
});

document.getElementById("login-form").style.display = "block";
document.getElementById("signup-form").style.display = "none";
