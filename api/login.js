// api/login.js
export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Log the incoming request body (be careful with passwords in production)
    console.log('Login attempt with username:', req.body.username);
    
    if (!req.body || !req.body.username || !req.body.password) {
        console.log('Missing credentials in request');
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const { username, password } = req.body;
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    try {
        // Add error handling for empty credentials
        if (!trimmedUsername || !trimmedPassword) {
            console.log('Empty credentials after trimming');
            return res.status(400).json({ message: 'Username and password cannot be empty' });
        }

        // Initialize default users
        let users = [{
            username: 'admin',
            password: 'admin123',
            status: 'active'
        }];

        // Try to fetch from blob storage
        try {
            console.log('Attempting to fetch users from Blob Storage...');
            const blobUrl = 'https://xgfyqlneoat12ohc.public.blob.vercel-storage.com/users.json';
            const blobResponse = await fetch(blobUrl);
            
            if (blobResponse.ok) {
                users = await blobResponse.json();
                console.log('Successfully loaded users from storage. User count:', users.length);
            } else {
                console.log('Using default users array with admin account');
            }
        } catch (fetchError) {
            console.log('Blob storage error, using default users array');
        }

        // Log the available usernames (but not passwords)
        console.log('Available usernames:', users.map(u => u.username));

        // Find the user (case-insensitive username comparison, case-sensitive password)
        const user = users.find(
            user => user.username.toLowerCase() === trimmedUsername.toLowerCase() &&
                    user.password === trimmedPassword
        );

        if (!user) {
            console.log('Login failed: Invalid credentials for username:', trimmedUsername);
            return res.status(401).json({ 
                message: 'Invalid username or password',
                debug: 'Try using username: admin, password: admin123'
            });
        }

        if (user.status !== 'active') {
            console.log('Login failed: Inactive account for username:', trimmedUsername);
            return res.status(403).json({ message: 'Your account is not active' });
        }

        console.log('Login successful for username:', trimmedUsername);
        return res.status(200).json({
            message: 'Login successful',
            user: {
                username: user.username,
                status: user.status
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Frontend login handler (app.js)
async function handleLogin(event) {
    event.preventDefault();
    
    const loginReg = document.getElementById("loginReg");
    const loginPassword = document.getElementById("loginPassword");

    // Debug log (remove in production)
    console.log('Attempting login with username:', loginReg.value);

    // Validate inputs
    if (!loginReg.value.trim() || !loginPassword.value.trim()) {
        alert("Please enter both username and password");
        return;
    }

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: loginReg.value.trim(),
                password: loginPassword.value.trim()
            }),
        });

        const result = await response.json();

        if (response.ok) {
            alert("Login successful!");
            closeModal("loginModal");
            document.getElementById("userGreeting").innerText = `Welcome, ${result.user.username}!`;
            document.getElementById("userGreeting").style.display = "block";
            
            // Clear form
            loginReg.value = "";
            loginPassword.value = "";
        } else {
            // More detailed error message
            const errorMessage = result.debug || result.message;
            alert(errorMessage);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Network error. Please try again.');
    }
}