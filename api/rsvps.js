import { put, get } from "@vercel/blob";

const BLOB_KEY = 'rsvps.json';

// Helper function to send JSON response
function sendJSON(res, statusCode, data) {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
}

// Helper function to parse request body
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (err) {
                reject(err);
            }
        });
        req.on('error', reject);
    });
}

async function getAndParseRsvps() {
    const dbData = await get(BLOB_KEY, { access: 'public' });
    if (dbData.statusCode === 200 && dbData.blob) {
        try {
            const response = await fetch(dbData.blob.url);
            if (response.ok) {
                const rsvps = await response.json();
                console.log('RSVPs retrieved from blob storage:', rsvps);
                return rsvps;
            } else {
                console.error('Failed to fetch blob content, status:', response.status);
                return { rsvps: [] };
            }
        } catch (err) {
            console.error('Error fetching blob content:', err);
            return { rsvps: [] };
        }
    } else {
        console.warn('No existing RSVPs found in blob storage or error occurred');
        return { rsvps: [] };
    }
}

export default async function handler(req, res) {
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
        console.log('Received POST request for RSVP');
        try {
            // Parse body if it's a string
            let body = await parseBody(req);
            if (typeof body === 'string') {
                body = JSON.parse(body);
            }
            console.log('Parsed request body:', body || 'No body');

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

            // Write RSVP data to Vercel Blob storage.
            try {
                const { rsvps } = await getAndParseRsvps();

                if (!!rsvps) {
                    rsvps.push({
                        ...body,
                        timestamp: new Date().toISOString()
                    });
                }

                const { url } = await put(BLOB_KEY, JSON.stringify({ rsvps }), {
                    access: 'public',
                    addRandomSuffix: false, // Ensures the same pathname is used
                    contentType: 'application/json',
                    allowOverwrite: true,
                });
                console.log('RSVP data stored in blob storage at:', url);
            } catch (fileError) {
                console.warn('Note: DB error', fileError.message);
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
        console.log('Received GET request for RSVPs');
        try {
            const { rsvps } = await getAndParseRsvps();
            console.log('RSVPs data:', rsvps);
            return sendJSON(res, 200, rsvps);
        } catch (error) {
            console.log('Error retrieving RSVPs:', error);
            return sendJSON(res, 500, { error: 'Failed to retrieve RSVPs' });
        }
    }

    sendJSON(res, 405, { error: 'Method not allowed' });
}
