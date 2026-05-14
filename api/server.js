const fs = require('fs');
const path = require('path');
export default async function handler(req, res) {
    try {
        // Resolve the path to your HTML file
        // const filePath = path.join(process.cwd(), 'public', 'index.html');
        // console.log({ filePath })

        // Read the file content
        // const htmlContent = await fs.readFile('../index.html', 'utf8');
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Miranda's 40th Birthday Party</title>
            <link rel="stylesheet" href="public/css/style.css">
        </head>
        <body>
            <div class="container">
                <header class="header">
                    <h1>🎉 Miranda's 40th Birthday 🎉</h1>
                    <p class="subtitle">Join us for a celebration!</p>
                    <a href="public/pages/dashboard.html" class="dashboard-link">📊 View Guest List</a>
                </header>
                <section class="party-info">
                    <h2>Event Details</h2>
                    <p><strong>Date:</strong> Saturday, September 14th, 2024</p>
                    <p><strong>Time:</strong> 7:00 PM - Midnight</p>
                    <p><strong>Location:</strong> 123 Celebration Lane, Party City</p>
                    <p><strong>Dress Code:</strong> Cocktail Attire</p>
                </section>
                <footer class="footer">
                    <p>&copy; 2024 Miranda's Birthday Bash. All rights reserved.</p>
                </footer>
            </div>
            <script src="public/js/index.js"></script>
        </body>
        </html>     
        `
        // console.log({ htmlContent })

        // Send as HTML response
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 200;
        res.end(html);
    } catch (error) {
        res.statusCode = 500;
        res.end('Error reading HTML file');
    }
}