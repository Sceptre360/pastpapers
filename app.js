// Existing functions (unchanged)
function showModal(modalId) {
  document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

function toggleMenu() {
  const navLinks = document.getElementById("navLinks");
  navLinks.classList.toggle("active");
}

function showLogin() {
  showModal("loginModal");
}

function showRegister() {
  showModal("registerModal");
}

// Enhanced registration handler
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

      // Store user data in localStorage
      const userData = { username: regNumber, password: regPassword };
      localStorage.setItem('userData', JSON.stringify(userData));

      closeModal("registerModal");
    } else {
      alert(result.message || 'Registration failed!');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Registration failed!');
  }
}

// Enhanced login handler
async function handleLogin(event) {
  event.preventDefault();

  const loginReg = document.getElementById("loginReg").value.trim();
  const loginPassword = document.getElementById("loginPassword").value.trim();

  // Enhanced frontend validation
  if (!loginReg || !loginPassword) {
    alert("Please enter both username and password");
    return;
  }

  if (loginReg.length < 6) {
    alert("Username must be at least 6 characters long");
    return;
  }

  if (loginPassword.length < 6) {
    alert("Password must be at least 6 characters long");
    return;
  }

  // Check localStorage for user data
  const storedUserData = localStorage.getItem('userData');
  if (storedUserData) {
    const userData = JSON.parse(storedUserData);
    if (userData.username === loginReg && userData.password === loginPassword) {
      alert("Login successful!");
      closeModal("loginModal");
      document.getElementById("userGreeting").innerText = `Welcome, ${userData.username}!`;
      document.getElementById("userGreeting").style.display = "block";
      return; // Exit early if localStorage validation succeeds
    }
  }

  // If localStorage validation fails, proceed with server login
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: loginReg,
        password: loginPassword
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Login successful!");
      closeModal("loginModal");
      document.getElementById("userGreeting").innerText = `Welcome, ${result.user.username}!`;
      document.getElementById("userGreeting").style.display = "block";

      // Clear form
      document.getElementById("loginReg").value = "";
      document.getElementById("loginPassword").value = "";
    } else {
      alert(result.message || 'Login failed. Please try again.');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Network error. Please try again.');
  }
}

// Existing functions (unchanged)
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

function searchPDFs() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const allCards = document.querySelectorAll(".pdf-card");

  allCards.forEach(card => {
    const title = card.querySelector("h3").textContent.toLowerCase();
    card.style.display = title.includes(query) ? "block" : "none";
  });
}

function viewPDF(title) {
  alert(`Opening PDF: ${title}`);
}

// Attach event listeners
document.getElementById("registerForm").addEventListener("submit", handleRegister);
document.getElementById("loginForm").addEventListener("submit", handleLogin);
document.getElementById("categorySelect").addEventListener("change", filterPDFs);
document.getElementById("subcategorySelect").addEventListener("change", filterPDFs);
document.getElementById("searchInput").addEventListener("input", searchPDFs);