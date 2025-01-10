// app.js

// Utility to handle modal visibility
function showModal(modalId) {
  document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

// Toggle navigation menu on mobile
function toggleMenu() {
  const navLinks = document.getElementById("navLinks");
  navLinks.classList.toggle("active");
}

// Show login modal
function showLogin() {
  showModal("loginModal");
}

// Show register modal
function showRegister() {
  showModal("registerModal");
}

// Handle user registration
async function handleRegister(event) {
  event.preventDefault();
  const regNumber = document.getElementById("regNumber").value;
  const regPassword = document.getElementById("regPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (regPassword !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  // Send data to the serverless function
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: regNumber, password: regPassword }),
    });

    const result = await response.json();
    if (response.ok) {
      alert("Registration successful!");
      closeModal("registerModal");
    } else {
      alert(result.message || 'Registration failed!');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Registration failed!');
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const loginReg = document.getElementById("loginReg").value;
  const loginPassword = document.getElementById("loginPassword").value;

  // Log the payload being sent
  console.log('Sending login request:', { username: loginReg, password: loginPassword });

  // Send data to the serverless function
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: loginReg, password: loginPassword }),
    });

    // Log the raw response for debugging
    console.log('Raw response:', response);

    // Parse the response as JSON
    const result = await response.json();
    console.log('Parsed response:', result);

    if (response.ok) {
      alert("Login successful!");
      closeModal("loginModal");
      // Show welcome message
      document.getElementById("userGreeting").innerText = `Welcome, ${loginReg}!`;
      document.getElementById("userGreeting").style.display = "block";
    } else {
      // Display the error message from the serverless function
      alert(result.message || 'Login failed!');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Login failed!');
  }
}
     
// Filter PDFs by category and subcategory
function filterPDFs() {
  const category = document.getElementById("categorySelect").value;
  const subcategory = document.getElementById("subcategorySelect").value;

  const allCards = document.querySelectorAll(".pdf-card");
  allCards.forEach(card => {
    const title = card.querySelector("h3").textContent;
    const matchesCategory = !category || title.includes(category);
    const matchesSubcategory = !subcategory || title.includes(subcategory);
    card.style.display = matchesCategory && matchesSubcategory ? "block" : "none";
  });
}

// Search PDFs by title
function searchPDFs() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const allCards = document.querySelectorAll(".pdf-card");

  allCards.forEach(card => {
    const title = card.querySelector("h3").textContent.toLowerCase();
    card.style.display = title.includes(query) ? "block" : "none";
  });
}

// View PDF placeholder
function viewPDF(title) {
  alert(`Opening PDF: ${title}`);
}

// Attach event listeners
document.getElementById("registerForm").addEventListener("submit", handleRegister);
document.getElementById("loginForm").addEventListener("submit", handleLogin);
document.getElementById("categorySelect").addEventListener("change", filterPDFs);
document.getElementById("subcategorySelect").addEventListener("change", filterPDFs);
document.getElementById("searchInput").addEventListener("input", searchPDFs);