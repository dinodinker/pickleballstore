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

        // Remove the header row before displaying
        rows.slice(1).forEach(rowData => {
            if (rowData.length < 10) return; // Ensure correct column count
            
            const tableRow = document.createElement('tr');
            tableRow.innerHTML = `
                <td><img src="${rowData[9].trim()}" alt="${rowData[0].trim()}" style="width: 80px; height: auto; border-radius: 5px;"></td>
                <td>${rowData[0].trim()}</td>
                <td>${rowData[1].trim()}</td>
                <td>${rowData[2].trim()}</td>
                <td>$${parseFloat(rowData[3].trim()).toFixed(2)}</td>
                <td>$${parseFloat(rowData[4].trim()).toFixed(2)}</td>
                <td>${rowData[5].trim()}</td>
                <td>${rowData[6].trim()}</td>
                <td>${rowData[7].trim()}</td>
                <td>${rowData[8].trim()}</td>
            `;
            tableBody.appendChild(tableRow);
        });
    } catch (error) {
        console.error('Error loading Google Sheets data:', error);
    }
});
