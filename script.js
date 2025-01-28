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
        const headers = rows[0].map(header => header.trim().replace(/"/g, ''));
        const dataRows = rows.slice(1).filter(row => row.length >= headers.length); // Remove empty rows

        dataRows.forEach(rowData => {
            const cleanedRow = rowData.map(cell => cell.trim().replace(/"/g, ''));
            const imageUrl = cleanedRow[headers.indexOf("Image URL")];
            const name = cleanedRow[headers.indexOf("Name")];
            const type = cleanedRow[headers.indexOf("Type")];
            const condition = cleanedRow[headers.indexOf("Condition")];
            const price = parseFloat(cleanedRow[headers.indexOf("Price")]).toFixed(2);
            const rentalPrice = parseFloat(cleanedRow[headers.indexOf("Rental Price")]).toFixed(2);
            const description = cleanedRow[headers.indexOf("Description")];
            const stock = cleanedRow[headers.indexOf("Stock")];
            const rented = cleanedRow[headers.indexOf("Rented")];
            const notes = cleanedRow[headers.indexOf("Notes")];
            
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
