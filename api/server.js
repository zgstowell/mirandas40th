const fs = require('fs');
const path = require('path');
const rsvpsHandler = require('./rsvps');
module.exports = (req, res) => {
    console.log('Received request:', req.method, req.url);
    if (req.url === '/api/rsvps') {
        // Delegate to the rsvps handler
        return rsvpsHandler(req, res);
    }
    const indexHtmlPath = path.join(process.cwd(), 'public', 'index.html');
    fs.readFile(indexHtmlPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading index.html:', err);
            res.statusCode = 500;
            res.end('Internal Server Error');
            return;
        }
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 200;
        res.end(data);
    });

    // // For testing API endpoint
    // // Enable CORS
    // res.setHeader('Access-Control-Allow-Credentials', 'true');
    // res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    // res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    // res.statusCode = 200;
    // res.end(`Hello from a standalone serverless function! You requested ${req.url} with method ${req.method}`);
};