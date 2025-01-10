// Current user session (stored in localStorage)
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;


// DOM Elements
let navLinks, loginModal, registerModal, userManagement, userTableBody, pdfGrid, searchInput, categorySelect, subcategorySelect, menuToggle, loginForm, registerForm;

// Function to show login modal
function showLogin() {
  if (loginModal) {
    loginModal.style.display = 'block';
  } else {
    console.error('Login modal not found!');
  }
}

// Function to show register modal
function showRegister() {
  if (registerModal) {
    registerModal.style.display = 'block';
  } else {
    console.error('Register modal not found!');
  }
}

// Function to close modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
  } else {
    console.error(`Modal with ID ${modalId} not found!`);
  }
}

// Function to toggle menu for mobile devices
function toggleMenu() {
  if (navLinks) {
    navLinks.classList.toggle('active');
  } else {
    console.error('Navigation links element not found!');
  }
}

// Function to handle login form submission
async function handleLogin(event) {
  event.preventDefault();
  const regNumber = document.getElementById('loginReg').value;
  const password = document.getElementById('loginPassword').value;

  // Check for admin credentials (locally)
  if (regNumber === 'admin' && password === 'admin123') {
    currentUser = { regNumber, password, isAdmin: true };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    alert('Admin login successful!');
    userManagement.style.display = 'block';
    updateNavigation();
    closeModal('loginModal');
    return;
  }

  // Validate user locally (you can replace this with Supabase if needed)
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('regNumber', regNumber)
    .eq('password', password)
    .single();

  if (user) {
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    alert('Login successful!');
    updateNavigation();
    closeModal('loginModal');
  } else {
    alert('Invalid credentials. Please check your details.');
  }
}

// Function to handle register form submission
async function handleRegister(event) {
  event.preventDefault();
  const regNumber = document.getElementById('regNumber').value;
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  // Initialize Supabase only when needed
  const supabaseUrl = 'https://xkzjjdwalnuiwidjslvm.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrempqZHdhbG51aXdpZGpzbHZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MDE1MTgsImV4cCI6MjA1MTk3NzUxOH0.LC0Y09mty1-8W2jqX0XFYvbAlvCuicG_E9x_2_g0KgY';
  const supabase = supabase.createClient(supabaseUrl, supabaseKey);

  // Check if user already exists in Supabase
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('regNumber', regNumber)
    .single();

  if (existingUser) {
    alert('Username already exists. Please choose a different one.');
    return;
  }

  // Add new user to Supabase
  const { data, error } = await supabase
    .from('users')
    .insert([{ regNumber, password, status: 'Active' }]);

  if (error) {
    console.error('Error adding user: ', error);
    alert('Registration failed. Please try again.');
  } else {
    alert('Registration successful! You can now log in.');
    closeModal('registerModal');
    updateUserTable();
  }
}

// Function to update user table
async function updateUserTable() {
  if (!userTableBody) {
    console.error('User table body element not found!');
    return;
  }

  userTableBody.innerHTML = ''; // Clear existing content

  // Initialize Supabase only when needed
  const supabaseUrl = 'https://xkzjjdwalnuiwidjslvm.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrempqZHdhbG51aXdpZGpzbHZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MDE1MTgsImV4cCI6MjA1MTk3NzUxOH0.LC0Y09mty1-8W2jqX0XFYvbAlvCuicG_E9x_2_g0KgY';
  const supabase = supabase.createClient(supabaseUrl, supabaseKey);

  const { data: users, error } = await supabase
    .from('users')
    .select('*');

  if (error) {
    console.error('Error fetching users: ', error);
  } else {
    users.forEach((user) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.regNumber}</td>
        <td>${user.password}</td>
        <td>${user.status}</td>
        <td><button onclick="deleteUser('${user.id}')">Delete</button></td>
      `;
      userTableBody.appendChild(row);
    });
  }
}

// Function to delete user
async function deleteUser(userId) {
  if (confirm('Are you sure you want to delete this user?')) {
    // Initialize Supabase only when needed
    const supabaseUrl = 'https://xkzjjdwalnuiwidjslvm.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrempqZHdhbG51aXdpZGpzbHZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MDE1MTgsImV4cCI6MjA1MTk3NzUxOH0.LC0Y09mty1-8W2jqX0XFYvbAlvCuicG_E9x_2_g0KgY';
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Error deleting user: ', error);
      alert('An error occurred. Please try again.');
    } else {
      alert('User deleted successfully.');
      updateUserTable();
    }
  }
}

// Function to update navigation based on login status
function updateNavigation() {
  if (!navLinks) {
    console.error('Navigation links element not found!');
    return;
  }

  if (currentUser) {
    navLinks.innerHTML = `
      <span>Welcome, ${currentUser.regNumber}</span>
      <button onclick="logout()">Logout</button>
    `;
  } else {
    navLinks.innerHTML = `
      <button onclick="showLogin()">Login</button>
      <button onclick="showRegister()">Register</button>
    `;
  }
}

// Function to logout
function logout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  userManagement.style.display = 'none';
  updateNavigation();
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing application...');

  // Initialize DOM elements
  navLinks = document.getElementById('navLinks');
  loginModal = document.getElementById('loginModal');
  registerModal = document.getElementById('registerModal');
  userManagement = document.getElementById('userManagement');
  userTableBody = document.getElementById('userTableBody');
  pdfGrid = document.getElementById('pdfGrid');
  searchInput = document.getElementById('searchInput');
  categorySelect = document.getElementById('categorySelect');
  subcategorySelect = document.getElementById('subcategorySelect');
  menuToggle = document.querySelector('.menu-toggle');
  loginForm = document.getElementById('loginForm');
  registerForm = document.getElementById('registerForm');

  // Attach event listeners to forms
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  } else {
    console.error('Login form not found!');
  }

  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  } else {
    console.error('Register form not found!');
  }

  // Attach event listeners to buttons
  const loginButton = document.getElementById('loginButton');
  const registerButton = document.getElementById('registerButton');

  if (loginButton) {
    loginButton.addEventListener('click', showLogin);
  } else {
    console.error('Login button not found!');
  }

  if (registerButton) {
    registerButton.addEventListener('click', showRegister);
  } else {
    console.error('Register button not found!');
  }

  // Attach event listeners to close buttons inside modals
  const closeLoginModalButton = document.getElementById('closeLoginModal');
  const closeRegisterModalButton = document.getElementById('closeRegisterModal');

  if (closeLoginModalButton) {
    closeLoginModalButton.addEventListener('click', () => closeModal('loginModal'));
  }

  if (closeRegisterModalButton) {
    closeRegisterModalButton.addEventListener('click', () => closeModal('registerModal'));
  }

  // Initialize PDFs
  initializePDFs();

  // Initialize user table
  updateUserTable();

  // Initialize navigation
  updateNavigation();
});

// Initialize PDF display
function initializePDFs() {
  if (!pdfGrid) {
    console.error('PDF grid element not found!');
    return;
  }

  pdfGrid.innerHTML = ''; // Clear existing content

  if (pdfs.length === 0) {
    console.warn('No PDFs found in the array.');
    pdfGrid.innerHTML = '<p>No PDFs available.</p>';
    return;
  }

  pdfs.forEach(pdf => {
    const card = createPDFCard(pdf);
    if (card) {
      pdfGrid.appendChild(card);
    } else {
      console.error('Failed to create PDF card for:', pdf);
    }
  });
}

// Create PDF card element
function createPDFCard(pdf) {
  if (!pdf || !pdf.title || !pdf.category || !pdf.subcategory) {
    console.error('Invalid PDF data:', pdf);
    return null;
  }

  const card = document.createElement('div');
  card.className = 'pdf-card';
  card.innerHTML = `
    <div class="pdf-thumbnail">${pdf.title.charAt(0).toUpperCase()}</div>
    <h3>${pdf.title}</h3>
    <p>Category: ${pdf.category}</p>
    <p>Subcategory: ${pdf.subcategory}</p>
    <button onclick="viewPDF(${pdf.id})">View PDF</button>
  `;
  return card;
}

// View PDF function (mock implementation)
function viewPDF(pdfId) {
  if (!currentUser) {
    alert('Please login to view PDFs');
    return;
  }
  alert(`Viewing PDF ${pdfId}`);
}

// Search PDFs
function searchPDFs() {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredPDFs = pdfs.filter(pdf =>
    pdf.title.toLowerCase().includes(searchTerm)
  );

  if (!pdfGrid) {
    console.error('PDF grid element not found!');
    return;
  }

  pdfGrid.innerHTML = ''; // Clear existing content

  if (filteredPDFs.length === 0) {
    pdfGrid.innerHTML = '<p>No PDFs found matching your search.</p>';
    return;
  }

  filteredPDFs.forEach(pdf => {
    const card = createPDFCard(pdf);
    if (card) {
      pdfGrid.appendChild(card);
    } else {
      console.error('Failed to create PDF card for:', pdf);
    }
  });
}

// Filter PDFs by category and subcategory
function filterPDFs() {
  const category = categorySelect.value;
  const subcategory = subcategorySelect.value;

  const filteredPDFs = pdfs.filter(pdf => {
    return (
      (category === '' || pdf.category === category) &&
      (subcategory === '' || pdf.subcategory === subcategory)
    );
  });

  if (!pdfGrid) {
    console.error('PDF grid element not found!');
    return;
  }

  pdfGrid.innerHTML = ''; // Clear existing content

  if (filteredPDFs.length === 0) {
    pdfGrid.innerHTML = '<p>No PDFs found matching your filters.</p>';
    return;
  }

  filteredPDFs.forEach(pdf => {
    const card = createPDFCard(pdf);
    if (card) {
      pdfGrid.appendChild(card);
    } else {
      console.error('Failed to create PDF card for:', pdf);
    }
  });
}