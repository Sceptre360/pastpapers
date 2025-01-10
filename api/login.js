// api/login.js
export default async (req, res) => {
    if (req.method === 'POST') {
      const { username, password } = req.body;
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();
  
      try {
        // Log the received username and password
        console.log('Received login request:', { trimmedUsername, trimmedPassword });
  
        // Fetch existing users from Blob Storage
        let users = [];
        const blobResponse = await fetch('https://xgfyqlneoat12ohc.public.blob.vercel-storage.com/users-PUyoROV6UOXi6jtpR7ev5Uk5CjpSyW.json');
        if (blobResponse.ok) {
          users = await blobResponse.json();
        }
  
        // Log the fetched users
        console.log('Fetched users:', users);
  
        // Find the user (case-sensitive comparison)
        const user = users.find(
          user => user.username === trimmedUsername &&
                  user.password === trimmedPassword
        );
  
        if (!user) {
          console.log('User not found or password mismatch');
          return res.status(400).json({ message: 'Invalid username or password!' });
        }
  
        if (user.status !== 'active') {
          console.log('User account is not active');
          return res.status(400).json({ message: 'Your account is not active!' });
        }
  
        console.log('Login successful for user:', user);
        res.status(200).json({ message: 'Login successful!', user });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  };