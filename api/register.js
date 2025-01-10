import { put } from '@vercel/blob';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    try {
      // Fetch existing users from Blob Storage
      let users = [];
      const blobResponse = await fetch('https://xgfyqlneoat12ohc.public.blob.vercel-storage.com/users.json');
      if (blobResponse.ok) {
        users = await blobResponse.json();
      }

      // Check if the user already exists
      if (users.some(user => user.username === trimmedUsername)) {
        return res.status(400).json({ message: 'User already exists!' });
      }

      // Add the new user
      users.push({ username: trimmedUsername, password: trimmedPassword, status: 'active' });

      // Save the updated users array to Blob Storage
      const { url } = await put('users.json', JSON.stringify(users), {
        access: 'public',
      });

      res.status(200).json({ message: 'User registered successfully!', url });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};