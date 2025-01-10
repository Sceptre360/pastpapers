export default async (req, res) => {
    if (req.method === 'POST') {
      const { username, password } = req.body;
  
      try {
        // Fetch existing users from Blob Storage
        let users = [];
        const blobResponse = await fetch('https://blob.vercel-storage.com/users.json');
        if (blobResponse.ok) {
          users = await blobResponse.json();
        }
  
        // Find the user
        const user = users.find(user => user.username === username && user.password === password);
  
        if (!user) {
          return res.status(400).json({ message: 'Invalid username or password!' });
        }
  
        if (user.status !== 'active') {
          return res.status(400).json({ message: 'Your account is not active!' });
        }
  
        res.status(200).json({ message: 'Login successful!', user });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  };