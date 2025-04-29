const API_BASE = 'http://localhost:5000/api/leaderboard';

async function loadLeaderboard() {
    const filter = document.getElementById('filter').value;
    const url = `${API_BASE}?filter=${filter}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        renderTable(data);
    } catch (err) {
        console.error('Error loading leaderboard:', err);
    }
}

async function searchUser() {
    const userId = document.getElementById('searchId').value;
    const res = await fetch(`${API_BASE}/search?userId=${userId}`);
    const data = await res.json();
    renderTable(data);
    document.getElementById('searchId').value = '';
}

async function recalculate() {
    try {
        const res = await fetch(`${API_BASE}/recalculate`, {
            method: 'POST'
        });

        if (!res.ok) throw new Error('Failed to recalculate');

        alert('Ranks recalculated!');
        loadLeaderboard(); // Refresh leaderboard after recalc
    } catch (err) {
        console.error('Error recalculating:', err);
    }
}

function renderTable(data) {
    console.log('data => ', data);
    const tbody = document.querySelector('#leaderboardTable tbody');
    tbody.innerHTML = '';

    if (data.error) {
        tbody.innerHTML = '<tr><td colspan="4">No data found</td></tr>';
        return;
    }

    data.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.userId}</td>
            <td>${user.name}</td>
            <td>${user.totalPoints}</td>
            <td>${user.rank}</td>
        `;
        tbody.appendChild(row);
    });
}

window.onload = loadLeaderboard;