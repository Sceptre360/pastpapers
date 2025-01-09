// Initialize Supabase
const supabaseUrl = 'https://xkzjjdwalnuiwidjslvm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrempqZHdhbG51aXdpZGpzbHZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MDE1MTgsImV4cCI6MjA1MTk3NzUxOH0.LC0Y09mty1-8W2jqX0XFYvbAlvCuicG_E9x_2_g0KgY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Current user session (stored in localStorage)
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

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
    if (!pdfGrid) {
        console.error('PDF grid element not found!');
        return;
    }

    pdfGrid.innerHTML = ''; // Clear existing content

    if (pdfs.length === 0) {
        console.warn('No PDFs found in the array.');
        pdfGrid.innerHTML = '<p>No PDFs available.</p>'; // Display a message if no PDFs are found
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
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredPDFs = pdfs.filter(pdf =>
        pdf.title.toLowerCase().includes(searchTerm)
    );

    const pdfGrid = document.getElementById('pdfGrid');
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
    const category = document.getElementById('categorySelect').value;
    const subcategory = document.getElementById('subcategorySelect').value;

    const filteredPDFs = pdfs.filter(pdf => {
        return (
            (category === '' || pdf.category === category) &&
            (subcategory === '' || pdf.subcategory === subcategory)
        );
    });

    const pdfGrid = document.getElementById('pdfGrid');
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

// Toggle menu for mobile devices
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

// Show login modal
function showLogin() {
    document.getElementById('loginModal').style.display = 'block';
}

// Show register modal
function showRegister() {
    document.getElementById('registerModal').style.display = 'block';
}

// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Handle login form submission
async function handleLogin(event) {
    event.preventDefault();
    const regNumber = document.getElementById('loginReg').value;
    const password = document.getElementById('loginPassword').value;

    // Check for admin credentials
    if (regNumber === 'admin' && password === 'admin123') {
        currentUser = { regNumber, password, isAdmin: true };
        localStorage.setItem('currentUser', JSON.stringify(currentUser)); // Store in local storage
        alert('Admin login successful!');
        document.getElementById('userManagement').style.display = 'block'; // Show user management
        updateNavigation();
        closeModal('loginModal');
        return;
    }

    // Validate user from Supabase
    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('regNumber', regNumber)
        .eq('password', password)
        .single();

    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser)); // Store in local storage
        alert('Login successful!');
        updateNavigation();
        closeModal('loginModal');
    } else {
        alert('Invalid credentials. Please check your details.');
    }
}

// Handle register form submission
async function handleRegister(event) {
    event.preventDefault();
    const regNumber = document.getElementById('regNumber').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

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
        updateUserTable(); // Refresh the user table
    }
}

// Update user table
async function updateUserTable() {
    const userTableBody = document.getElementById('userTableBody');
    if (!userTableBody) {
        console.error('User table body element not found!');
        return;
    }

    userTableBody.innerHTML = ''; // Clear existing content

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

// Delete user
async function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', userId);

        if (error) {
            console.error('Error deleting user: ', error);
            alert('An error occurred. Please try again.');
        } else {
            alert('User deleted successfully.');
            updateUserTable(); // Refresh the table
        }
    }
}

// Update navigation based on login status
function updateNavigation() {
    const navLinks = document.getElementById('navLinks');
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

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser'); // Clear local storage
    document.getElementById('userManagement').style.display = 'none'; // Hide user management on logout
    updateNavigation();
}

// Initialize the application
window.onload = function () {
    console.log('Initializing application...');
    initializePDFs(); // Initialize PDF display
    updateUserTable(); // Initialize user table
    updateNavigation(); // Initialize navigation

    // Attach event listeners to login and register forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);

    // Attach event listener to menu toggle button
    document.querySelector('.menu-toggle').addEventListener('click', toggleMenu);
};