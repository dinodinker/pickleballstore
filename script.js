document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('inventory.json');
        const data = await response.json();
        const tableBody = document.querySelector('#paddleTable tbody');
        tableBody.innerHTML = '';

        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.type}</td>
                <td>$${item.price}</td>
                <td>$${item.rental_price}</td>
                <td>${item.description}</td>
                <td>${item.stock}</td>
                <td>${item.rented}</td>
                <td><button onclick="requestPaddle('${item.name}')">Request</button></td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading inventory:', error);
    }
});

function requestPaddle(paddleName) {
    const recipientEmail = "naqvi_sn@yahoo.com";
    const subject = encodeURIComponent("Pickleball Paddle Request");
    const body = encodeURIComponent(`Hello,\n\nI would like to request the paddle: ${paddleName}.\n\nThank you.`);
    
    window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
}
