// api/login.js
export default async (req, res) => {
    if (req.method === 'POST') {
      const { username, password } = req.body;
  
      // Fetch existing users from Blob Storage
      let users = [];
      try {
        const blobResponse = await fetch('https://your-blob-storage-url/users.json');
        if (blobResponse.ok) {
          users = await blobResponse.json();
        }
      } catch (error) {
        console.error('Error fetching users:', error);
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
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  };