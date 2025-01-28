document.addEventListener('DOMContentLoaded', async function() {
    const sheetID = "1C1WMjPcvikenjGzUdOv47l1pUSC759dVYXzb3tsGxs0";  // Replace with your actual Google Sheet ID
    const sheetName = "Sheet1"; // Change if your sheet has a different name
    const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json`;

    try {
        const response = await fetch(url);
        let text = await response.text();
        text = text.substring(47, text.length - 2); // Clean the response
        const json = JSON.parse(text);
        const rows = json.table.rows;

        const tableBody = document.querySelector('#paddleTable tbody');
        tableBody.innerHTML = '';

        rows.forEach(row => {
            const rowData = row.c.map(cell => (cell ? cell.v : 'N/A'));
            const tableRow = document.createElement('tr');
            tableRow.innerHTML = `
                <td><img src="${rowData[9]}" alt="${rowData[0]}" style="width: 80px; height: auto; border-radius: 5px;"></td>
                <td>${rowData[0]}</td>
                <td>${rowData[1]}</td>
                <td>${rowData[2]}</td>
                <td>$${rowData[3]}</td>
                <td>$${rowData[4]}</td>
                <td>${rowData[5]}</td>
                <td>${rowData[6]}</td>
                <td>${rowData[7]}</td>
                <td>${rowData[8]}</td>
            `;
            tableBody.appendChild(tableRow);
        });
    } catch (error) {
        console.error('Error loading Google Sheets data:', error);
    }
});
