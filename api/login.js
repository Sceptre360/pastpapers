// api/login.js
export default async (req, res) => {
    if (req.method === 'POST') {
        const { username, password } = req.body;
        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();

        try {
            console.log('Attempting login for user:', trimmedUsername);
            
            // Fetch existing users from Blob Storage
            let users = [];
            const blobResponse = await fetch('https://xgfyqlneoat12ohc.public.blob.vercel-storage.com/users.json');
            
            if (blobResponse.ok) {
                users = await blobResponse.json();
                console.log('Successfully loaded users. Count:', users.length);
            } else {
                console.error('Failed to fetch users:', blobResponse.statusText);
                return res.status(500).json({ message: 'Error accessing user database' });
            }

            // Find the user (exact match for both username and password)
            const user = users.find(
                user => user.username === trimmedUsername && 
                        user.password === trimmedPassword
            );

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
            return res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        return res.status(405).json({ message: 'Method not allowed' });
    }
};