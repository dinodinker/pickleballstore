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
            th.textContent = headerText === "Image URL" ? "Image" : headerText;
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
                if (headers[index] === "Image") {
                    let imageUrl = cellData;
                    if (imageUrl.includes("drive.google.com")) {
                        const fileId = imageUrl.match(/[-\w]{25,}/);
                        if (fileId) {
                            imageUrl = `https://drive.google.com/uc?export=view&id=${fileId[0]}`;
                        }
                    }
                    // Ensure the image icon is visible and full image opens on click
                    td.innerHTML = `
                        <img src="${imageUrl}" alt="Image" style="width: 40px; height: 40px; border-radius: 5px; cursor: pointer;" 
                        onclick="showFullImage('${imageUrl}')">
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

// Function to show full image in a modal
function showFullImage(imageUrl) {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    
    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.maxWidth = '90%';
    img.style.maxHeight = '90%';
    img.style.borderRadius = '10px';
    
    modal.appendChild(img);
    document.body.appendChild(modal);
    
    // Close modal on click
    modal.onclick = function() {
        document.body.removeChild(modal);
    };
}
