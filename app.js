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

  const users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.some(user => user.username === regNumber)) {
      alert("User with this registration number already exists!");
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
      users.push({ username: regNumber, password: regPassword, status: "active" });
      localStorage.setItem("users", JSON.stringify(users));
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

// Handle user login
function handleLogin(event) {
  event.preventDefault();
  const loginReg = document.getElementById("loginReg").value;
  const loginPassword = document.getElementById("loginPassword").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(user => user.username === loginReg && user.password === loginPassword);

  if (!user) {
      alert("Invalid registration number or password!");
      return;
  }

  if (user.status !== "active") {
      alert("Your account is not active!");
      return;
  }

  alert("Login successful!");
  closeModal("loginModal");
  document.getElementById("userManagement").style.display = "block";
  populateUserTable();
}

// Populate user table in admin panel
function populateUserTable() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const tableBody = document.getElementById("userTableBody");
  tableBody.innerHTML = "";

  users.forEach((user, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${user.username}</td>
          <td>${user.password}</td>
          <td>${user.status}</td>
          <td>
              <button onclick="deleteUser(${index})">Delete</button>
              <button onclick="toggleStatus(${index})">
                  ${user.status === "active" ? "Deactivate" : "Activate"}
              </button>
          </td>
      `;
      tableBody.appendChild(row);
  });
}

// Delete a user
function deleteUser(index) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  users.splice(index, 1);
  localStorage.setItem("users", JSON.stringify(users));
  populateUserTable();
}

// Toggle user status
function toggleStatus(index) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  users[index].status = users[index].status === "active" ? "inactive" : "active";
  localStorage.setItem("users", JSON.stringify(users));
  populateUserTable();
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