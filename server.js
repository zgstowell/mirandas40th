const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const rsvpFilePath = path.join(__dirname, 'rsvps.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Initialize RSVP file if it doesn't exist
function initializeRsvpFile() {
    if (!fs.existsSync(rsvpFilePath)) {
        fs.writeFileSync(rsvpFilePath, JSON.stringify({ rsvps: [] }, null, 2));
    }
}

// Get all RSVPs
app.get('/api/rsvps', (req, res) => {
    try {
        const data = fs.readFileSync(rsvpFilePath, 'utf8');
        const rsvpData = JSON.parse(data);
        res.json(rsvpData);
    } catch (error) {
        console.error('Error reading RSVPs:', error);
        res.status(500).json({ error: 'Failed to read RSVPs' });
    }
});

// Save RSVP
app.post('/api/rsvp', (req, res) => {
    try {
        // Validate required fields
        if (!req.body.name || !req.body.email || !req.body.attending) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Read existing RSVPs
        const data = fs.readFileSync(rsvpFilePath, 'utf8');
        const rsvpData = JSON.parse(data);

        // Add new RSVP
        rsvpData.rsvps.push(req.body);

        // Write back to file
        fs.writeFileSync(rsvpFilePath, JSON.stringify(rsvpData, null, 2));

        console.log(`New RSVP from ${req.body.name} (${req.body.attending})`);
        res.json({ success: true, message: 'RSVP saved successfully' });
    } catch (error) {
        console.error('Error saving RSVP:', error);
        res.status(500).json({ error: 'Failed to save RSVP' });
    }
});

// Serve index.html for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Initialize RSVP file and start server
initializeRsvpFile();

app.listen(PORT, () => {
    console.log(`🎉 Birthday RSVP server running at http://localhost:${PORT}`);
    console.log(`📝 RSVPs are saved to: ${rsvpFilePath}`);
});
