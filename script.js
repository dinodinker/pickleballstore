document.addEventListener('DOMContentLoaded', async function() {
    const sheetID = "1C1WMjPcvikenjGzUdOv47l1pUSC759dVYXzb3tsGxs0";  // Your actual Google Sheet ID
    const sheetName = "Sheet1"; // Change if your sheet has a different name
    const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;

    try {
        const response = await fetch(url);
        const text = await response.text();
        const rows = text.split("\n").map(row => row.split(",")); // Parse CSV data

        const table = document.querySelector('#paddleTable');
        const tableHead = table.querySelector('thead');
        const tableBody = table.querySelector('tbody');

        tableHead.innerHTML = '';
        tableBody.innerHTML = '';

        // Extract headers and create table headers
        const headers = rows[0].map(header => header.trim().replace(/"/g, ''));
        const headerRow = document.createElement('tr');
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        tableHead.appendChild(headerRow);

        // Remove empty rows
        const dataRows = rows.slice(1).filter(row => row.length >= headers.length);

        dataRows.forEach(rowData => {
            const cleanedRow = rowData.map(cell => cell.trim().replace(/"/g, ''));
            const tableRow = document.createElement('tr');

            cleanedRow.forEach((cellData, index) => {
                const td = document.createElement('td');

                if (headers[index] === "Image URL") {
                    let imageUrl = cellData;

                    // Ensure Google Drive image links are converted correctly
                    if (imageUrl.includes("drive.google.com")) {
                        const fileId = imageUrl.match(/[-\w]{25,}/);
                        if (fileId) {
                            imageUrl = `https://drive.google.com/uc?export=view&id=${fileId[0]}`;
                        }
                    }

                    // If the image URL is empty, use a placeholder
                    if (!imageUrl || imageUrl === "N/A") {
                        imageUrl = "https://via.placeholder.com/40"; // Placeholder image
                    }

                    td.innerHTML = `
                        <img src="${imageUrl}" alt="Image" style="width: 40px; height: 40px; border-radius: 5px; cursor: pointer;" 
                        onmouseover="this.style.width='200px'; this.style.height='200px';" 
                        onmouseout="this.style.width='40px'; this.style.height='40px';">
                    `;
                } else {
                    td.textContent = cellData;
                }

                tableRow.appendChild(td);
            });

            tableBody.appendChild(tableRow);
        });

    } catch (error) {
        console.error('Error loading Google Sheets data:', error);
    }
});
