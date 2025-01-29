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
        const tableBody = document.querySelector('tbody');
        
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
                        const fileIdMatch = imageUrl.match(/[-\w]{25,}/);
                        if (fileIdMatch) {
                            imageUrl = `https://lh3.googleusercontent.com/d/${fileIdMatch[0]}=s220`;
                        }
                    }
                    // Ensure the image icon is visible and full image opens on click
                    td.innerHTML = `
                        <img src="${imageUrl}" alt="Image" style="width: 40px; height: 40px; border-radius: 5px; cursor: pointer; object-fit: cover;" 
                        onclick="showFullImage('${imageUrl}')" onerror="this.onerror=null; this.src='https://via.placeholder.com/40';">
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
    img.style.width = 'auto';
    img.style.height = 'auto';
    img.style.maxWidth = '95%';
    img.style.maxHeight = '95%';
    img.style.borderRadius = '10px';
    img.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.2)';
    
    modal.appendChild(img);
    document.body.appendChild(modal);
    
    // Close modal on click
    modal.onclick = function() {
        document.body.removeChild(modal);
    };
}
