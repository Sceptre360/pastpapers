// api/register.js
import { put } from '@vercel/blob';

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

    // Check if the user already exists
    if (users.some(user => user.username === username)) {
      return res.status(400).json({ message: 'User already exists!' });
    }

    // Add the new user
    users.push({ username, password, status: 'active' });

    // Save the updated users array to Blob Storage
    const { url } = await put('users.json', JSON.stringify(users), {
      access: 'public',
    });

    res.status(200).json({ message: 'User registered successfully!', url });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};