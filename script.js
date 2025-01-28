document.addEventListener('DOMContentLoaded', async function() {
    const sheetID = "1C1WMjPcvikenjGzUdOv47l1pUSC759dVYXzb3tsGxs0";  // Your actual Google Sheet ID
    const sheetName = "Sheet1"; // Change if your sheet has a different name
    const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;

    try {
        const response = await fetch(url);
        const text = await response.text();
        const rows = text.split("\n").map(row => row.split(",")); // Parse CSV data

        const tableBody = document.querySelector('#paddleTable tbody');
        tableBody.innerHTML = '';

        // Ensure first row is treated as a header and removed
        const headers = rows[0].map(header => header.trim());
        const dataRows = rows.slice(1).filter(row => row.length >= headers.length); // Remove empty rows

        dataRows.forEach(rowData => {
            const imageUrl = rowData[headers.indexOf("Image URL")].trim();
            const name = rowData[headers.indexOf("Name")].trim();
            const type = rowData[headers.indexOf("Type")].trim();
            const condition = rowData[headers.indexOf("Condition")].trim();
            const price = parseFloat(rowData[headers.indexOf("Price")].trim()).toFixed(2);
            const rentalPrice = parseFloat(rowData[headers.indexOf("Rental Price")].trim()).toFixed(2);
            const description = rowData[headers.indexOf("Description")].trim();
            const stock = rowData[headers.indexOf("Stock")].trim();
            const rented = rowData[headers.indexOf("Rented")].trim();
            const notes = rowData[headers.indexOf("Notes")].trim();
            
            const tableRow = document.createElement('tr');
            tableRow.innerHTML = `
                <td><img src="${imageUrl}" alt="${name}" style="width: 80px; height: auto; border-radius: 5px;"></td>
                <td>${name}</td>
                <td>${type}</td>
                <td>${condition}</td>
                <td>$${price}</td>
                <td>$${rentalPrice}</td>
                <td>${description}</td>
                <td>${stock}</td>
                <td>${rented}</td>
                <td>${notes}</td>
            `;
            tableBody.appendChild(tableRow);
        });
    } catch (error) {
        console.error('Error loading Google Sheets data:', error);
    }
});
