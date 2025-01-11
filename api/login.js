// api/login.js
export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    if (!req.body || !req.body.username || !req.body.password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const { username, password } = req.body;
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    try {
        // Add error handling for empty credentials
        if (!trimmedUsername || !trimmedPassword) {
            return res.status(400).json({ message: 'Username and password cannot be empty' });
        }

        // Fetch existing users from Blob Storage with detailed error handling
        let users = [];
        try {
            console.log('Attempting to fetch users from Blob Storage...');
            const blobUrl = 'https://xgfyqlneoat12ohc.public.blob.vercel-storage.com/users.json';
            console.log('Blob URL:', blobUrl);

            const blobResponse = await fetch(blobUrl);
            console.log('Blob Response Status:', blobResponse.status);
            console.log('Blob Response Status Text:', blobResponse.statusText);

            if (!blobResponse.ok) {
                // If file doesn't exist, initialize with default admin user
                if (blobResponse.status === 404) {
                    console.log('Users file not found. Using default users array.');
                    users = [{
                        username: 'admin',
                        password: 'admin123',
                        status: 'active'
                    }];
                } else {
                    throw new Error(`Failed to fetch users: ${blobResponse.statusText}`);
                }
            } else {
                users = await blobResponse.json();
                console.log('Successfully fetched users. Count:', users.length);
            }
        } catch (fetchError) {
            console.error('Detailed fetch error:', fetchError);
            return res.status(500).json({ 
                message: 'Error accessing user database',
                debug: process.env.NODE_ENV === 'development' ? fetchError.message : undefined
            });
        }

        // Find the user (case-insensitive username comparison, case-sensitive password)
        const user = users.find(
            user => user.username.toLowerCase() === trimmedUsername.toLowerCase() &&
                    user.password === trimmedPassword
        );

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        if (user.status !== 'active') {
            return res.status(403).json({ message: 'Your account is not active' });
        }

        // Success case
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
            message: 'Internal server error',
            debug: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};