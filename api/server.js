const fs = require('fs');
const path = require('path');
export async function GET(req, res) {
    // Enable CORS
    // res.setHeader('Access-Control-Allow-Credentials', 'true');
    // res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    // res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    console.log('Received request:', { req });
    try {
        const indexHtmlPath = path.join(process.cwd(), 'public', 'index.html');
        fs.readFile(indexHtmlPath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading index.html:', err);
                // res.statusCode = 500;
                // res.end('Internal Server Error');
                return Response.json({ error: 'Internal Server Error' }, { status: 500 });
            }
            // res.setHeader('Content-Type', 'text/html');
            // res.statusCode = 200;
            // res.end(data);
            return Response.json({ html: data }, { status: 200 });
        });
    } catch (error) {
        console.error('Error handling request:', error);
        // res.statusCode = 500;
        // res.end('Internal Server Error');
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
        return;
    }

    // // For testing API endpoint
    // res.statusCode = 200;
    // res.end(`Hello from a standalone serverless function! You requested ${req.url} with method ${req.method}`);
};