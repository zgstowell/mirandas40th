let allRsvps = [];
let filteredRsvps = [];
let currentFilter = 'all';
console.log('Dashboard script loaded');
// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    loadRsvps();
    setupEventListeners();
});

function setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            filterAndDisplay();
        });
    });

    // Search input
    document.getElementById('searchInput').addEventListener('input', (e) => {
        filterAndDisplay(e.target.value);
    });

    // Export button
    document.getElementById('exportBtn').addEventListener('click', exportAsCSV);
}

async function loadRsvps() {
    try {
        const response = await fetch('https://mirandas40th.vercel.app/api/rsvps');
        const data = await response.json();
        allRsvps = data.rsvps || [];
        filterAndDisplay();
        updateStats();
    } catch (error) {
        console.error('Error loading RSVPs:', error);
        document.getElementById('guestsList').innerHTML =
            '<tr><td colspan="8" class="error">Error loading guest responses</td></tr>';
    }
}

function filterAndDisplay(searchTerm = '') {
    let filtered = allRsvps;

    // Filter by status
    if (currentFilter !== 'all') {
        filtered = filtered.filter(rsvp => rsvp.attending === currentFilter);
    }

    // Filter by search term
    if (searchTerm) {
        filtered = filtered.filter(rsvp =>
            rsvp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rsvp.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    filteredRsvps = filtered;
    displayGuests();
}

function displayGuests() {
    const tbody = document.getElementById('guestsList');

    if (filteredRsvps.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="no-data">No guest responses found</td></tr>';
        return;
    }

    tbody.innerHTML = filteredRsvps.map(rsvp => {
        const status = getStatusBadge(rsvp.attending);
        const submittedDate = new Date(rsvp.timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
            <tr>
                <td class="name-cell">${escapeHtml(rsvp.name)}</td>
                <td class="email-cell"><a href="mailto:${escapeHtml(rsvp.email)}">${escapeHtml(rsvp.email)}</a></td>
                <td class="phone-cell">${escapeHtml(rsvp.phone || '-')}</td>
                <td class="status-cell">${status}</td>
                <td class="guests-cell">${rsvp.guests || 1}</td>
                <td class="dietary-cell">${escapeHtml(rsvp.dietary || '-')}</td>
                <td class="comments-cell">${escapeHtml(rsvp.comments || '-')}</td>
                <td class="date-cell">${submittedDate}</td>
            </tr>
        `;
    }).join('');
}

function updateStats() {
    const attending = allRsvps.filter(r => r.attending === 'yes').length;
    const declining = allRsvps.filter(r => r.attending === 'no').length;
    const maybe = allRsvps.filter(r => r.attending === 'maybe').length;
    const totalGuests = allRsvps.reduce((sum, r) => sum + (r.guests || 1), 0);

    document.getElementById('totalResponses').textContent = allRsvps.length;
    document.getElementById('attendingCount').textContent = attending;
    document.getElementById('declineCount').textContent = declining;
    document.getElementById('maybeCount').textContent = maybe;
    document.getElementById('totalGuests').textContent = totalGuests;

    displayDietaryRestrictions();
}

function displayDietaryRestrictions() {
    const dietaryList = document.getElementById('dietaryList');
    const dietaryItems = allRsvps
        .filter(r => r.dietary && r.dietary.trim())
        .map(r => ({
            name: r.name,
            dietary: r.dietary
        }));

    if (dietaryItems.length === 0) {
        dietaryList.innerHTML = '<p class="no-dietary">No dietary restrictions reported</p>';
        return;
    }

    dietaryList.innerHTML = dietaryItems.map(item => `
        <div class="dietary-item">
            <strong>${escapeHtml(item.name)}:</strong> ${escapeHtml(item.dietary)}
        </div>
    `).join('');
}

function getStatusBadge(status) {
    const badges = {
        'yes': '<span class="badge badge-yes">✓ Attending</span>',
        'no': '<span class="badge badge-no">✗ Declining</span>',
        'maybe': '<span class="badge badge-maybe">? Maybe</span>'
    };
    return badges[status] || '<span class="badge">Unknown</span>';
}

function exportAsCSV() {
    const headers = ['Name', 'Email', 'Phone', 'Attending', 'Guests', 'Dietary Restrictions', 'Comments', 'Submitted Date'];

    const rows = allRsvps.map(rsvp => [
        rsvp.name,
        rsvp.email,
        rsvp.phone || '',
        rsvp.attending,
        rsvp.guests || 1,
        rsvp.dietary || '',
        rsvp.comments || '',
        new Date(rsvp.timestamp).toLocaleString()
    ]);

    // Escape CSV values
    const csvContent = [
        headers.map(h => `"${h}"`).join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mirandas-40th-rsvps-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
