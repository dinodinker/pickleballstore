document.addEventListener('DOMContentLoaded', async function() {
    const sheetID = "1C1WMjPcvikenjGzUdOv47l1pUSC759dVYXzb3tsGxs0";  // Your actual Google Sheet ID
    const sheetName = "Sheet1"; // Change if your sheet has a different name
    const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

    try {
        const response = await fetch(url);
        let text = await response.text();
        text = text.substring(47, text.length - 2); // Remove unnecessary Google Sheets response headers
        const json = JSON.parse(text);
        const rows = json.table.rows;

        const table = document.querySelector('#paddleTable');
        const tableHead = table.querySelector('thead');
        const tableBody = table.querySelector('tbody');

        tableHead.innerHTML = '';
        tableBody.innerHTML = '';

        // Extract headers
        const headers = json.table.cols.map(col => col.label);
        const headerRow = document.createElement('tr');
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText === "Image URL" ? "Image" : headerText;
            headerRow.appendChild(th);
        });
        tableHead.appendChild(headerRow);

        // Load Data Rows
        rows.forEach(row => {
            const rowData = row.c.map(cell => (cell && cell.v) ? cell.v : "N/A");
            const tableRow = document.createElement('tr');

            rowData.forEach((cellData, index) => {
                const td = document.createElement('td');
                if (headers[index] === "Image") {
                    let imageUrl = cellData;

                    // If it's a Google Sheets embedded image, extract the <img> tag URL
                    if (imageUrl.includes("<img")) {
                        const srcMatch = imageUrl.match(/src="([^"]+)"/);
                        if (srcMatch) {
                            imageUrl = srcMatch[1];
                        }
                    }

                    // If the image URL is missing, use a placeholder
                    if (!imageUrl || imageUrl === "N/A") {
                        imageUrl = "https://via.placeholder.com/40";
                    }

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
