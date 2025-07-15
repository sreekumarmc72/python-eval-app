// api/python-proxy.js
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Proxying request to Python API...');
    console.log('Request body:', req.body);

    const response = await fetch('http://4.188.74.28:4000/api/run-python', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Python API response:', data);
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error proxying to Python API:', error);
    res.status(500).json({ 
      error: 'Failed to connect to Python API',
      details: error.message 
    });
  }
}