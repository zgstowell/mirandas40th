// Handle form submission
document.getElementById('rsvpForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        attending: document.getElementById('attending').value,
        guests: parseInt(document.getElementById('guests').value),
        dietary: document.getElementById('dietary').value,
        comments: document.getElementById('comments').value
    };

    const messageEl = document.getElementById('formMessage');

    try {
        const response = await fetch('/api/rsvp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            messageEl.textContent = '✓ RSVP submitted successfully! Thank you for responding.';
            messageEl.classList.add('success');
            messageEl.classList.remove('error');
            document.getElementById('rsvpForm').reset();

            // Hide message after 5 seconds
            setTimeout(() => {
                messageEl.classList.remove('success');
            }, 5000);
        } else {
            throw new Error('Failed to submit RSVP');
        }
    } catch (error) {
        console.error('Error:', error);
        messageEl.textContent = '✗ Error submitting RSVP. Please try again.';
        messageEl.classList.add('error');
        messageEl.classList.remove('success');
    }
});