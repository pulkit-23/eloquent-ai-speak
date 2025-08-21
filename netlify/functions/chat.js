export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sender, message } = req.body;

    // Validate required fields
    if (!sender || !message) {
      return res.status(400).json({ error: 'Missing sender or message' });
    }

    // Forward request to Rasa server
    // You can change this URL to your deployed Rasa endpoint
    const rasaEndpoint = process.env.RASA_ENDPOINT || 'http://localhost:5005/webhooks/rest/webhook';
    
    const response = await fetch(rasaEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender,
        message
      })
    });

    if (!response.ok) {
      throw new Error(`Rasa server responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Rasa returns an array of response objects with 'text' field
    // Extract just the text messages
    const messages = data.map(item => item.text).filter(Boolean);
    
    return res.status(200).json({ messages });
  } catch (error) {
    console.error('Error calling Rasa:', error);
    return res.status(500).json({ 
      error: 'Failed to connect to Rasa server',
      details: error.message 
    });
  }
}