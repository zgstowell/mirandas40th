# Miranda's 40th Birthday RSVP Website

A beautiful, responsive birthday party website with an RSVP form. **Built as a serverless app with Vercel for easy GitHub deployment.**

## Features

- 🎉 Beautiful, responsive design with gradient styling
- 📋 Comprehensive RSVP form with:
  - Guest name and contact info
  - Attendance confirmation
  - Number of guests
  - Dietary restrictions
  - Comments/special requests
- 🚀 **Serverless architecture** - deployed with Vercel
- 💾 Persistent data storage in `rsvps.json`
- ✅ Form validation and success/error messages
- 📱 Mobile-friendly responsive layout
- 🔗 One-click deployment from GitHub

## Quick Start - Local Development

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run locally:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:3000`

## Deploy to Vercel

### Option 1: One-Click Deployment (Recommended)

1. Push your repository to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" and import your GitHub repository
4. Vercel will auto-detect the configuration
5. Click "Deploy"

Your site will be live at a URL like `mirandas40th.vercel.app`

### Option 2: Deploy via CLI

1. Make sure you're in the project directory
2. Run:
   ```bash
   vercel
   ```
3. Follow the prompts and authenticate with your Vercel account
4. Your site will be deployed automatically

### GitHub Integration

Once connected to Vercel:
- Every push to `main` branch triggers automatic deployment
- Pull requests get preview deployments
- Rollback to previous deployments anytime from Vercel dashboard

## File Structure

```
/
├── index.html                    # Main website page
├── pages/
│   └── dashboard.html           # Guest list dashboard
├── css/
│   ├── style.css                # Main styling and responsive design
│   └── dashboard.css            # Dashboard-specific styles
├── js/
│   ├── index.js                 # Frontend form handling
│   └── dashboard.js             # Dashboard functionality
├── api/
│   └── rsvp.js                  # Vercel serverless function for RSVP handling
├── data/
│   └── rsvps.json               # Database file (auto-created on first RSVP)
├── vercel.json                  # Vercel deployment configuration
├── package.json                 # Project dependencies
└── README.md                    # This file
```

## API Endpoints

- `GET /api/rsvp` - Retrieve all RSVP entries
- `POST /api/rsvp` - Submit a new RSVP entry

## Customization

Edit the following in `index.html`:
- Party date, time, and location
- Dress code and any other details
- Person's name (currently "Miranda's 40th")

All party details are in the HTML structure and can be easily customized.

## Data Storage

All RSVPs are automatically saved to `rsvps.json` in the following format:
```json
{
  "rsvps": [
    {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "555-1234",
      "attending": "yes",
      "guests": 2,
      "dietary": "Vegetarian",
      "comments": "Can't wait!",
      "timestamp": "2026-05-14T10:30:00.000Z"
    }
  ]
}
```

## Troubleshooting

**Vercel deployment not working?**
- Ensure `vercel.json` is in the root directory
- Check that `api/rsvp.js` exists and is formatted correctly
- Review deployment logs in Vercel dashboard

**RSVPs not saving?**
- Vercel's serverless functions have read-only file systems in production
- For persistent storage, consider upgrading to use Vercel Postgres or a database service
- For now, RSVPs are logged and can be retrieved via GET endpoint
