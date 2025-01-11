// api/login.js
import { list } from '@vercel/blob';

export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Extract and validate request body
    const { username, password } = req.body;
    
    // Initial validation
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    // Enhanced validation
    if (trimmedUsername.length < 3) {
        return res.status(400).json({ message: 'Username must be at least 3 characters long' });
    }

    if (trimmedPassword.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    try {
        console.log('Attempting login for user:', trimmedUsername);
        
        // Get users data with better error handling
        let users = [];
        try {
            // First try to list the blob to ensure it exists
            const { blobs } = await list();
            console.log('Available blobs:', blobs.map(b => b.pathname));

            const blobResponse = await fetch('https://xgfyqlneoat12ohc.public.blob.vercel-storage.com/users.json');
            
            if (!blobResponse.ok) {
                throw new Error(`Failed to fetch users: ${blobResponse.statusText}`);
            }

            const responseText = await blobResponse.text();
            if (!responseText) {
                throw new Error('Empty response from database');
            }

            try {
                users = JSON.parse(responseText);
                console.log('Successfully loaded users. Count:', users.length);
            } catch (parseError) {
                console.error('Error parsing users JSON:', parseError);
                throw new Error('Invalid data format in database');
            }

        } catch (dbError) {
            console.error('Database error:', dbError);
            return res.status(500).json({ 
                message: 'Error accessing user database. Please try again later.',
                debug: process.env.NODE_ENV === 'development' ? dbError.message : undefined
            });
        }

        // Additional validation of users array
        if (!Array.isArray(users)) {
            console.error('Invalid users data structure');
            return res.status(500).json({ message: 'Invalid database structure' });
        }

        // Find and validate user
        const user = users.find(u => {
            // Additional validation for user object structure
            if (!u || typeof u.username !== 'string' || typeof u.password !== 'string') {
                console.error('Invalid user record found:', u);
                return false;
            }
            return u.username === trimmedUsername && u.password === trimmedPassword;
        });

        if (!user) {
            console.log('Login failed: Invalid credentials for username:', trimmedUsername);
            return res.status(401).json({ message: 'Invalid username or password' });
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
        return res.status(500).json({ 
            message: 'Internal server error. Please try again later.',
            debug: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};