const fs = require('fs');
const path = require('path');

// Helper function to send JSON response
function sendJSON(res, statusCode, data) {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
}

module.exports = async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.statusCode = 200;
        res.end();
        return;
    }

    if (req.method === 'POST') {
        try {
            // Parse body if it's a string
            let body = req.body;
            if (typeof body === 'string') {
                body = JSON.parse(body);
            }

            // Validate required fields
            const { name, email, attending } = body;
            if (!name || !email || !attending) {
                return sendJSON(res, 400, { error: 'Missing required fields' });
            }

            // Log the RSVP (in production, save to database)
            console.log('New RSVP:', {
                ...body,
                submittedAt: new Date().toISOString()
            });

            // Try to write to local file system (works in Vercel for serverless)
            try {
                const rsvpDir = path.join(process.cwd(), 'data');
                const rsvpPath = path.join(rsvpDir, 'rsvps.json');

                // Ensure directory exists
                if (!fs.existsSync(rsvpDir)) {
                    fs.mkdirSync(rsvpDir, { recursive: true });
                }

                // Read existing RSVPs or create new file
                let rsvpData = { rsvps: [] };
                if (fs.existsSync(rsvpPath)) {
                    const content = fs.readFileSync(rsvpPath, 'utf8');
                    rsvpData = JSON.parse(content);
                }

                // Add new RSVP with timestamp
                rsvpData.rsvps.push({
                    ...body,
                    timestamp: new Date().toISOString()
                });

                // Write back to file
                fs.writeFileSync(rsvpPath, JSON.stringify(rsvpData, null, 2));
            } catch (fileError) {
                console.warn('Note: Local file storage not available. RSVP logged but not persisted:', fileError.message);
            }

            return sendJSON(res, 200, {
                success: true,
                message: 'RSVP received! Thank you for responding.'
            });
        } catch (error) {
            console.error('Error processing RSVP:', error);
            return sendJSON(res, 500, { error: 'Failed to process RSVP' });
        }
    }

    if (req.method === 'GET') {
        try {
            const rsvpPath = path.join(process.cwd(), 'data', 'rsvps.json');

            if (fs.existsSync(rsvpPath)) {
                console.log('Retrieving RSVPs from file system');
                const content = fs.readFileSync(rsvpPath, 'utf8');
                const rsvpData = JSON.parse(content);
                return sendJSON(res, 200, rsvpData);
            }

            console.log('No RSVPs found, returning empty list');
            return sendJSON(res, 200, { rsvps: [] });
        } catch (error) {
            console.error('Error retrieving RSVPs:', error);
            return sendJSON(res, 500, { error: 'Failed to retrieve RSVPs' });
        }
    }

    sendJSON(res, 405, { error: 'Method not allowed' });
}
