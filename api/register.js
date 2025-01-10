// api/register.js
import { put } from '@vercel/blob';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    try {
      // Log the received username and password
      console.log('Received registration request:', { trimmedUsername, trimmedPassword });

      // Fetch existing users from Blob Storage
      let users = [];
      const blobResponse = await fetch('https://blob.vercel-storage.com/users.json');
      if (blobResponse.ok) {
        users = await blobResponse.json();
      }

      // Log the fetched users
      console.log('Fetched users:', users);

      // Check if the user already exists (case-sensitive comparison)
      if (users.some(user => user.username === trimmedUsername)) {
        console.log('User already exists:', trimmedUsername);
        return res.status(400).json({ message: 'User already exists!' });
      }

      // Add the new user
      users.push({ username: trimmedUsername, password: trimmedPassword, status: 'active' });

      // Log the updated users array
      console.log('Updated users:', users);

      // Save the updated users array to Blob Storage
      const { url } = await put('users.json', JSON.stringify(users), {
        access: 'public',
      });

      console.log('User registered successfully:', { trimmedUsername, url });
      res.status(200).json({ message: 'User registered successfully!', url });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};