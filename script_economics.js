// script_economics.js - This script is specifically for loading and displaying tables

document.addEventListener('DOMContentLoaded', () => {
    // Function to parse CSV text into an object containing headers and data
    function parseCSV(csvText) {
        const lines = csvText.split('\n').filter(line => line.trim() !== '');
        if (lines.length === 0) {
            return { headers: [], data: [] }; // Return empty structure
        }

        const headers = lines[0].split(',').map(header => header.trim());
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const currentLine = lines[i];
            const values = currentLine.split(',').map(value => value.trim()); 
            
            // Basic check to skip completely empty lines or malformed rows at the end of file
            if (values.length === 1 && values[0] === '') {
                continue; 
            }

            if (values.length === headers.length) {
                let rowObject = {};
                headers.forEach((header, index) => {
                    rowObject[header] = values[index];
                });
                data.push(rowObject);
            } else {
                // Keep this warning as it indicates a CSV formatting issue
                console.warn(`parseCSV: Skipping malformed row (value count mismatch): "${currentLine}" (Expected ${headers.length} values, got ${values.length}). Please check CSV formatting (e.g., unquoted commas in data).`);
            }
        }
        return { headers: headers, data: data }; // Return both headers and data
    }

    // Function to build and display the table
    async function loadCSVTable(tableId, messageId, csvFilePath) {
        const table = document.getElementById(tableId);
        const messageElement = document.getElementById(messageId);
        const tableHead = table.querySelector('thead');
        const tableBody = table.querySelector('tbody');

        messageElement.textContent = 'Cargando datos...';
        messageElement.classList.remove('error-message'); // Clear any previous error

        try {
            const response = await fetch(csvFilePath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} from ${csvFilePath}`);
            }
            const csvText = await response.text();
            
            // Get both headers and data from parseCSV
            const { headers, data } = parseCSV(csvText);

            if (data.length === 0 || headers.length === 0) {
                messageElement.textContent = 'No hay datos disponibles o encabezados para esta tabla.';
                messageElement.classList.add('error-message');
                return;
            }

            // Clear message and display table
            messageElement.style.display = 'none';

            // Create table headers using the 'headers' array directly
            const headersToDisplay = headers;

            let headerRowHTML = '<tr>';
            headersToDisplay.forEach(header => {
                headerRowHTML += `<th>${header}</th>`;
            });
            headerRowHTML += '</tr>';
            tableHead.innerHTML = headerRowHTML;

            // Create table rows
            let bodyRowsHTML = '';
            data.forEach(rowData => {
                bodyRowsHTML += '<tr>';
                headersToDisplay.forEach((header, index) => {
                    // Check if it's table4 and the first column (index 0)
                    if (tableId === 'table4' && index === 0) {
                        bodyRowsHTML += `<td><strong>${rowData[header]}</strong></td>`;
                    } else {
                        bodyRowsHTML += `<td>${rowData[header]}</td>`;
                    }
                });
                bodyRowsHTML += '</tr>';
            });
            tableBody.innerHTML = bodyRowsHTML;

        } catch (error) {
            console.error(`Error loading table ${tableId} from ${csvFilePath}:`, error);
            messageElement.textContent = `Error al cargar los datos para esta tabla: ${error.message}. Asegúrate de que los archivos CSV estén en el servidor y su formato sea correcto.`;
            messageElement.classList.add('error-message');
        }
    }

    // Call the function for each table on the data-tables.html page
    loadCSVTable('table1', 'loadingMessage1', 'economics/Costos_Iniciales.csv');
    loadCSVTable('table2', 'loadingMessage2', 'economics/Componentes.csv');
    loadCSVTable('table3', 'loadingMessage3', 'economics/Proyecciones_5_anios.csv');
    loadCSVTable('table5', 'loadingMessage5', 'economics/Years_sales.csv');
});

async function loadCSVAndRenderTable4() {
      // Make sure your_data.csv is in the same directory as this HTML file
      const csvFilePath = 'economics/Conclusions.csv';
      const table = document.getElementById('table4');

      if (!table) {
        console.error('Table with ID "table4" not found.');
        return;
      }

      try {
        const response = await fetch(csvFilePath);
        // Check if the network request was successful
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csvText = await response.text();
        const data = parseCSV(csvText); // Simple CSV parser

        if (data.length === 0) {
          table.innerHTML = '<thead><tr><th>No data found in CSV.</th></tr></thead><tbody></tbody>';
          return;
        }

        // Clear existing content to avoid duplication on re-render
        table.innerHTML = '';

        // Create thead for column headers (Concepto, Valor)
        const thead = table.createTHead();
        const headerRow = thead.insertRow();

        // Create <th> elements for the header row (Concepto, Valor)
        const thConcepto = document.createElement('th');
        thConcepto.textContent = 'Concepto';
        headerRow.appendChild(thConcepto);

        const thValor = document.createElement('th');
        thValor.textContent = 'Valor';
        headerRow.appendChild(thValor);

        // Create tbody for data rows
        const tbody = table.createTBody();

        // Iterate through each row of the parsed CSV data
        data.forEach(rowData => {
          // Skip malformed rows (e.g., empty lines or lines with less than 2 columns)
          if (rowData.length < 2) {
            console.warn('Skipping malformed CSV row:', rowData);
            return;
          }

          const tr = tbody.insertRow();
          const concept = rowData[0]; // First item in CSV row is the concept/label
          const value = rowData[1];   // Second item is the value

          // Create a <th> for the concept (this acts as the vertical header for the row)
          const th = document.createElement('th');
          th.textContent = concept;
          tr.appendChild(th);

          // Create a <td> for the value
          const td = document.createElement('td');
          td.textContent = value;
          tr.appendChild(td);
        });

      } catch (error) {
        console.error('Error loading or parsing CSV:', error);
        table.innerHTML = '<thead><tr><th>Error loading data.</th></tr></thead><tbody></tbody>';
      }
    }

    /**
     * Simple CSV parser function.
     * Assumes no commas within data fields and simple line breaks.
     * For production environments with complex CSVs (e.g., quoted commas),
     * consider using a dedicated library like Papa Parse.
     * @param {string} csv - The raw CSV string.
     * @returns {Array<Array<string>>} - An array of arrays, where each inner array is a row.
     */
    function parseCSV(csv) {
      // Trim to remove leading/trailing whitespace, then split by new line
      const lines = csv.trim().split('\n');
      // Map each line to an array of strings by splitting by comma
      return lines.map(line => line.split(','));
    }

    // Call the function to load and render the table when the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', loadCSVAndRenderTable4);