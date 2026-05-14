const fs = require('fs');
const path = require('path');
export default async function handler(req, res) {
    try {
        // Resolve the path to your HTML file
        const filePath = path.join(process.cwd(), 'public', 'index.html');
        console.log({ filePath })

        // Read the file content
        const htmlContent = await fs.readFile(filePath, 'utf8');
        console.log({ htmlContent })

        // Send as HTML response
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 200;
        res.end(htmlContent);
    } catch (error) {
        res.statusCode = 500;
        res.end('Error reading HTML file');
    }
}