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
                <td>${item.notes || 'N/A'}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading inventory:', error);
    }
});
