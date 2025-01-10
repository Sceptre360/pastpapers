// api/register.js
module.exports = async (req, res) => {
    if (req.method === 'POST') {
      const { username, password } = req.body;
  
      // Here you can add logic to save the user data to a database
      // For now, we'll just log the data and send a success response
      console.log('Received user data:', { username, password });
  
      res.status(200).json({ message: 'User registered successfully!' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  };