// Current user session
let currentUser = null;
let users = JSON.parse(localStorage.getItem('users')) || []; // Load users from local storage

// Check for existing user in local storage on page load
window.onload = function () {
    const regNumber = localStorage.getItem('regNumber');
    const password = localStorage.getItem('password');

    if (regNumber && password) {
        currentUser = { regNumber, password };
        updateNavigation();
    }
    updateUserTable();
    initializePDFs(); // Initialize PDF display
};

// Mock data for PDFs
const pdfs = [
    { id: 1, title: 'Mechanics PDF 1', category: 'Mechanics', subcategory: '1' },
    { id: 2, title: 'Mechanics PDF 2', category: 'Mechanics', subcategory: '2' },
    { id: 3, title: 'Geospatial PDF 1', category: 'Geospatial', subcategory: '1' },
    { id: 4, title: 'Geospatial PDF 2', category: 'Geospatial', subcategory: '2' },
    { id: 5, title: 'Civil PDF 1', category: 'Civil', subcategory: '1' },
    { id: 6, title: 'Civil PDF 2', category: 'Civil', subcategory: '2' },
];

// Initialize PDF display
function initializePDFs() {
    const pdfGrid = document.getElementById('pdfGrid');
    pdfGrid.innerHTML = '';

    pdfs.forEach(pdf => {
        const card = createPDFCard(pdf);
        pdfGrid.appendChild(card);
    });
}

// Create PDF card element
function createPDFCard(pdf) {
    const card = document.createElement('div');
    card.className = 'pdf-card';
    card.innerHTML = `
        <div class="pdf-thumbnail">PDF</div>
        <h3>${pdf.title}</h3>
        <p>Category: ${pdf.category}</p>
        <p>Subcategory: ${pdf.subcategory}</p>
        <button onclick="viewPDF(${pdf.id})">View PDF</button>
    `;
    return card;
}

// Search PDFs
function searchPDFs() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredPDFs = pdfs.filter(pdf =>
        pdf.title.toLowerCase().includes(searchTerm)
    );

    const pdfGrid = document.getElementById('pdfGrid');
    pdfGrid.innerHTML = '';
    filteredPDFs.forEach(pdf => {
        const card = createPDFCard(pdf);
        pdfGrid.appendChild(card);
    });
}

// Authentication functions
function showLogin() {
    document.getElementById('loginModal').style.display = 'block';
}

function showRegister() {
    document.getElementById('registerModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function handleLogin(event) {
    event.preventDefault();
    const regNumber = document.getElementById('loginReg').value;
    const password = document.getElementById('loginPassword').value;

    // Check for admin credentials
    if (regNumber === 'admin' && password === 'admin123') {
        currentUser = { regNumber, password, isAdmin: true };
        alert('Admin login successful!');
        document.getElementById('userManagement').style.display = 'block'; // Show user management
        updateNavigation();
        return;
    }

    // Validate user from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const user = storedUsers.find(user => user.regNumber === regNumber && user.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('regNumber', regNumber);
        localStorage.setItem('password', password);
        alert('Login successful!');
        updateNavigation();
    } else {
        alert('Invalid credentials. Please check your details.');
    }
}

function handleRegister(event) {
    event.preventDefault();
    const regNumber = document.getElementById('regNumber').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = storedUsers.find(user => user.regNumber === regNumber);

    if (existingUser) {
        alert('Username already exists. Please choose a different one.');
        return;
    }

    // Store user information in local storage
    const newUser = { regNumber, password, status: 'Active' };
    storedUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(storedUsers));
    users = storedUsers; // Update the users array
    alert('Registration successful! You can now log in.');
    closeModal('registerModal');
    updateUserTable(); // Update the user management table
}

function updateUserTable() {
    const userTableBody = document.getElementById('userTableBody');
    userTableBody.innerHTML = '';

    users.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.regNumber}</td>
            <td>${user.password}</td>
            <td>${user.status}</td>
            <td><button onclick="deleteUser(${index})">Delete</button></td>
        `;
        userTableBody.appendChild(row);
    });
}

function deleteUser(index) {
    if (index >= 0 && index < users.length) {
        users.splice(index, 1); // Remove the user at the specified index
        localStorage.setItem('users', JSON.stringify(users)); // Update local storage
        updateUserTable(); // Update the table
        alert('User deleted successfully.');
    } else {
        alert('Invalid user index.');
    }
}

function updateNavigation() {
    const navLinks = document.getElementById('navLinks');
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

function logout() {
    currentUser = null;
    localStorage.removeItem('regNumber');
    localStorage.removeItem('password');
    document.getElementById('userManagement').style.display = 'none'; // Hide user management on logout
    updateNavigation();
}

// View PDF function (mock implementation)
function viewPDF(pdfId) {
    if (!currentUser) {
        alert('Please login to view PDFs');
        return;
    }
    alert(`Viewing PDF ${pdfId}`);
}

// Array of images and motivational messages
const motivations = [
    { image: 'images/jack1.jpg', message: 'You can do it!' },
    { image: 'images/jack2.jpg', message: 'You have mastered the content!' },
    { image: 'images/jack3.jpg', message: 'Just believe in yourself!' },
    { image: 'images/jack4.jpg', message: 'You are smart enough!' }
];

let currentMotivationIndex = 0;

// Function to display a random motivation
function displayMotivation() {
    const motivation = motivations[currentMotivationIndex];
    const imageElement = document.getElementById('motivationImage');
    const messageElement = document.getElementById('motivationMessage');

    imageElement.src = motivation.image;
    messageElement.textContent = motivation.message;

    // Update the index for the next motivation
    currentMotivationIndex = (currentMotivationIndex + 1) % motivations.length;
}

// Change motivation every 5 seconds
setInterval(displayMotivation, 5000);

// Initialize the application
initializePDFs();

function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active'); // Toggle the active class to show/hide the menu
}
