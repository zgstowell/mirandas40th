import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// For Vercel, we'll use a temporary storage approach
// In production, consider using a database or Vercel KV

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'POST') {
        try {
            // Validate required fields
            const { name, email, attending } = req.body;
            if (!name || !email || !attending) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            // Log the RSVP (in production, save to database)
            console.log('New RSVP:', {
                ...req.body,
                submittedAt: new Date().toISOString()
            });

            // Try to write to local file system (works in Vercel for serverless)
            try {
                const rsvpDir = path.join(process.cwd(), 'public');
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
                    ...req.body,
                    timestamp: new Date().toISOString()
                });

                // Write back to file
                fs.writeFileSync(rsvpPath, JSON.stringify(rsvpData, null, 2));
            } catch (fileError) {
                console.warn('Note: Local file storage not available. RSVP logged but not persisted:', fileError.message);
            }

            return res.status(200).json({
                success: true,
                message: 'RSVP received! Thank you for responding.'
            });
        } catch (error) {
            console.error('Error processing RSVP:', error);
            return res.status(500).json({ error: 'Failed to process RSVP' });
        }
    }

    if (req.method === 'GET') {
        try {
            const rsvpPath = path.join(process.cwd(), 'public', 'rsvps.json');

            if (fs.existsSync(rsvpPath)) {
                const content = fs.readFileSync(rsvpPath, 'utf8');
                const rsvpData = JSON.parse(content);
                return res.status(200).json(rsvpData);
            }

            return res.status(200).json({ rsvps: [] });
        } catch (error) {
            console.error('Error retrieving RSVPs:', error);
            return res.status(500).json({ error: 'Failed to retrieve RSVPs' });
        }
    }

    res.status(405).json({ error: 'Method not allowed' });
}
