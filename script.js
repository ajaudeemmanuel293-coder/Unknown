let currentCategory = 'all';

document.addEventListener('DOMContentLoaded', () => {
    fetchAgencyCatalog(); // Load products instantly
    initializeMatrixRain(); // Fire up the falling 1s and 0s matrix rain loop!

    // Bind search typing events
    document.getElementById('catalog-search').addEventListener('input', () => {
        fetchAgencyCatalog();
    });

    // Sidebar tab filters handler
    const tabs = document.querySelectorAll('.nav-links li');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active-tab'));
            e.target.classList.add('active-tab');
            currentCategory = e.target.getAttribute('data-cat');
            fetchAgencyCatalog();
        });
    });
});

// --- THE HACKER 1s AND 0s CANVAS ANIMATION ENGINE ---
function initializeMatrixRain() {
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');

    // Scale canvas to exactly fit the monitor window resolution bounds
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Binary code stream elements (flowing ones and zeroes)
    const binarySymbols = ["1", "0"];
    const fontSize = 16;
    
    // Calculate columns baseline count based on width dimensions
    const columns = canvas.width / fontSize;
    
    // Set initial vertical fall starting parameters for each individual column
    const rainDrops = [];
    for (let x = 0; x < columns; x++) {
        rainDrops[x] = 1; 
    }

    // The high-frequency drawing loop frame routine
    function drawMatrixStream() {
        // Paint a faint black background layer to trail previous text steps gracefully
        ctx.fillStyle = 'rgba(5, 7, 15, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00ff66'; // Glowing terminal matrix text color
        ctx.font = fontSize + 'px monospace';

        // Map column coordinates loops
        for (let i = 0; i < rainDrops.length; i++) {
            // Pick a randomized binary string indicator node
            const symbol = binarySymbols[Math.floor(Math.random() * binarySymbols.length)];
            
            const xCoord = i * fontSize;
            const yCoord = rainDrops[i] * fontSize;

            ctx.fillText(symbol, xCoord, yCoord);

            // If string cascades past viewport frame coordinates, reset random trigger index parameters
            if (yCoord > canvas.height && Math.random() > 0.975) {
                rainDrops[i] = 0;
            }
            rainDrops[i]++; // Drop vertical positions down on next tick cycle
        }
    }

    // Keep loop execution fluid by refreshing columns if screen windows adapt sizing bounds
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // Run the animation rendering loop at a smooth pace
    setInterval(drawMatrixStream, 33);
}

// --- DIGITAL CATALOG PIPELINE ---
async function fetchAgencyCatalog() {
    const searchVal = document.getElementById('catalog-search').value;
    const grid = document.getElementById('catalog-grid');

    const payload = { category: currentCategory, search: searchVal };

    try {
        const response = await fetch('/api/catalog', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const items = await response.json();
        grid.innerHTML = ''; 

        if (items.length === 0) {
            grid.innerHTML = `<p class="no-results">No active database records match query strings in this sector.</p>`;
            return;
        }

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'service-card';
            const escapedName = item.name.replace(/'/g, "\\'");
            const telegramQuery = encodeURIComponent(`Hello UNKNOWN Agency, I want to purchase: ${item.name}`);
            const telegramUrl = `https://t.me{telegramQuery}`;

            card.innerHTML = `
                <div class="card-top">
                    <span class="platform-badge">🌐 ${item.platform}</span>
                    <h4>${item.name}</h4>
                    <p>${item.desc}</p>
                </div>
                <div>
                    <div class="price-tag">${item.price}</div>
                    <div class="action-row">
                        <button class="btn btn-secondary" onclick="logInspectionTrack('${escapedName}', '${item.price}')">👁️ Inspect</button>
                        <a href="${telegramUrl}" target="_blank" class="btn btn-primary">📱 Buy Now</a>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error('Data pipeline translation fault:', error);
    }
}

function logInspectionTrack(name, price) {
    const cartBox = document.getElementById('cart-box');
    cartBox.innerHTML = `
        <div class="cart-card">
            <h5>${name}</h5>
            <p>${price}</p>
            <div style="font-size: 0.75rem; color: #00aa44; line-height: 1.4; margin-top: 0.5rem;">
                [STATUS: ACCESS_GRANTED] Packet tracking verified. Select checkout route to finalize handover payload arrays.
            </div>
        </div>
    `;
}
