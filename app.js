// Array of PDF files in the media folder
const pdfFiles = [
  { title: "Mechanical Year 1", file: "media/Mech2.pdf" },
  { title: "Mechanical Year 2", file: "media/MECH1.pdf" },
  { title: "Mechanical Year 3", file: "media/mech3.pdf" },
  { title: "Geospatial Year 1", file: "media/Civil.pdf" },
  { title: "Geospatial Year 2", file: "media/PASTPAPERS GEO.pdf" },
  { title: "Geospatial Year 3", file: "media/Geo3.pdf" },
  { title: "Civil Year 1", file: "media/Civil.pdf" },
  { title: "Civil Year 2", file: "media/Civil2.pdf" },
  { title: "Civil Year 3", file: "media/Civil.pdf" },
  { title: "Electrical Year 1", file: "media/Civil.pdf" },
  { title: "Electrical Year 2", file: "media/elec.pdf" },
  { title: "Electrical Year 3", file: "media/elec3.pdf" },
  { title: "Biosystems Year 1", file: "media/Civil.pdf" },
  { title: "Biosystems Year 2", file: "media/PASTPAPERS GEO.pdf" }
  { title: "Biosystems Year 3", file: "media/PASTPAPERS GEO.pdf" }
];

// Function to dynamically create PDF cards
function loadPDFs() {
  const pdfGrid = document.getElementById("pdfGrid");

  pdfFiles.forEach(pdf => {
      const pdfCard = document.createElement("div");
      pdfCard.className = "pdf-card";

      const pdfThumbnail = document.createElement("div");
      pdfThumbnail.className = "pdf-thumbnail";
      pdfThumbnail.textContent = "PDF";

      const pdfTitle = document.createElement("h3");
      pdfTitle.textContent = pdf.title;

      const viewButton = document.createElement("button");
      viewButton.textContent = "View PDF";
      viewButton.onclick = () => viewPDF(pdf.file);

      pdfCard.appendChild(pdfThumbnail);
      pdfCard.appendChild(pdfTitle);
      pdfCard.appendChild(viewButton);

      pdfGrid.appendChild(pdfCard);
  });
}

// Function to open PDF in a new tab (with login check)
function viewPDF(pdfFile) {
  // Check if the user is logged in using localStorage
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn) {
      alert("You Have To Register then Login To View.");
      showRegister(); // Show the register modal
      return; // Stop further execution
  }
  window.open(pdfFile, "_blank");
}

// functions
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

  // Password validation logic
  const hasUppercase = /[A-Z]/.test(regPassword); // At least one uppercase letter
  const hasNonLetter = /[^a-zA-Z]/.test(regPassword); // At least one non-letter character
  const isLengthValid = regPassword.length >= 6; // At least six characters

  if (regPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
  }

  if (!isLengthValid) {
      alert("Password must be at least six characters long.");
      return;
  }

  if (!hasUppercase) {
      alert("Password must contain at least one uppercase letter.");
      return;
  }

  if (!hasNonLetter) {
      alert("Password must contain at least one non-letter character (e.g., a number or symbol).");
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

  // Password validation logic
  const hasUppercase = /[A-Z]/.test(loginPassword); // At least one uppercase letter
  const hasNonLetter = /[^a-zA-Z]/.test(loginPassword); // At least one non-letter character
  const isLengthValid = loginPassword.length >= 6; // At least six characters

  if (!isLengthValid) {
      alert("Password must be at least six characters long.");
      return;
  }

  if (!hasUppercase) {
      alert("Password must contain at least one uppercase letter.");
      return;
  }

  if (!hasNonLetter) {
      alert("Password must contain at least one non-letter character (e.g., a number or symbol).");
      return;
  }

  // Check localStorage for user data
  const storedUserData = localStorage.getItem('userData');
  if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      if (userData.username === loginReg && userData.password === loginPassword) {
          alert("Login successful!");
          closeModal("loginModal");

          // Set login state
          localStorage.setItem("isLoggedIn", "true");

          // Display the logged-in username
          document.getElementById("userGreeting").innerText = `Welcome, ${userData.username}!`;
          document.getElementById("userGreeting").style.display = "block";

          // Update the login/logout buttons
          document.getElementById("navLinks").innerHTML = `
              <button onclick="handleLogout()">Logout</button>
          `;
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

          // Set login state
          localStorage.setItem("isLoggedIn", "true");

          // Display the logged-in username
          document.getElementById("userGreeting").innerText = `Welcome, ${result.user.username}!`;
          document.getElementById("userGreeting").style.display = "block";

          // Update the login/logout buttons
          document.getElementById("navLinks").innerHTML = `
              <button onclick="handleLogout()">Logout</button>
          `;

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

// Logout handler
function handleLogout() {
  // Clear only the login state
  localStorage.removeItem('isLoggedIn');

  // Hide the user greeting
  document.getElementById("userGreeting").style.display = "none";

  // Reset the login/logout buttons
  document.getElementById("navLinks").innerHTML = `
      <button onclick="showLogin()">Login</button>
      <button onclick="showRegister()">Register</button>
  `;

  alert("You have been logged out.");
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

// Attach event listeners
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("registerForm").addEventListener("submit", handleRegister);
  document.getElementById("loginForm").addEventListener("submit", handleLogin);
  document.getElementById("categorySelect").addEventListener("change", filterPDFs);
  document.getElementById("subcategorySelect").addEventListener("change", filterPDFs);
  document.getElementById("searchInput").addEventListener("input", searchPDFs);
});

// Check if the user is already logged in on page load and load PDFs
window.onload = function () {
  // Load PDFs
  loadPDFs();

  // Check if the user is already logged in
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const storedUserData = localStorage.getItem('userData');

  if (isLoggedIn && storedUserData) {
      const userData = JSON.parse(storedUserData);

      // Display the logged-in username
      document.getElementById("userGreeting").innerText = `Welcome, ${userData.username}!`;
      document.getElementById("userGreeting").style.display = "block";

      // Update the login/logout buttons
      document.getElementById("navLinks").innerHTML = `
          <button onclick="handleLogout()">Logout</button>
      `;
  }
};