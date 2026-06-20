const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS) from the current directory
app.use(express.static(path.join(__dirname, '/')));

// Handle the contact form submission
app.post('/send-message', (req, res) => {
    const { name, email, message } = req.body;
    
    // In a real project, you would save this to a Database or send an Email here.
    console.log('--- New Message Received ---');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Message: ${message}`);
    
    // Send a success alert and redirect back to the site
    res.send(`
        <script>
            alert('Thank you ${name}! Your message has been received on the Node.js backend.');
            window.location.href = '/';
        </script>
    `);
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`Welcome to Krushna's Portfolio Server!`);
});