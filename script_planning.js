// script_planning.js

document.addEventListener('DOMContentLoaded', () => {

    const ganttData = [
  { task: "Definir objetivos y alcance", startWeek: 0, duration: 1 },
  { task: "Identificar stakeholders", startWeek: 0, duration: 1 },
  { task: "Elaborar cronograma inicial", startWeek: 0, duration: 1 },
  { task: "Estimar demanda anual", startWeek: 1, duration: 1 },
  { task: "Planificar recursos e infraestructura", startWeek: 1, duration: 1 },
  { task: "Planificación de capacidad", startWeek: 2, duration: 1 },
  { task: "Calcular costos de inversión", startWeek: 3, duration: 0.5 },
  { task: "Estimar costos operativos", startWeek: 3, duration: 0.5 },
  { task: "Mapeo de flujo de valor (VSM)", startWeek: 4, duration: 1 },
  { task: "Identificar desperdicios clave", startWeek: 4.5, duration: 0.5 },
  { task: "Modelado del gemelo digital", startWeek: 5, duration: 2 },
  { task: "Validación y simulación digital", startWeek: 7, duration: 1 },
  { task: "Instalación y puesta en marcha", startWeek: 8, duration: 1 },
  { task: "Diseño de celda robotizada", startWeek: 9, duration: 2 },
  { task: "Selección de software SCADA", startWeek: 9, duration: 1 },
  { task: "Configuración inicial", startWeek: 10, duration: 1 },
  { task: "Integración plataforma de datos", startWeek: 11, duration: 1 },
  { task: "Instalación sensores", startWeek: 12, duration: 0.5 },
  { task: "Recepción y verificación de componentes", startWeek: 12, duration: 2 },
  { task: "Programación de robot de soldadura", startWeek: 13, duration: 0.5 },
  { task: "Pruebas de cordones y parámetros", startWeek: 13.5, duration: 0.5 },
  { task: "Montaje de subensambles mecánicos", startWeek: 14, duration: 1 },
  { task: "Cableado principal y arneses", startWeek: 15, duration: 0.5 },
  { task: "Conexiones y testing eléctrico", startWeek: 15.5, duration: 1 },
  { task: "Pruebas dinámicas en banco", startWeek: 16.5, duration: 0.5 },
  { task: "Análisis de resultados", startWeek: 17, duration: 0.5 },
  { task: "Preparación de empaques", startWeek: 17.5, duration: 0.5 },
  { task: "Empaquetado final", startWeek: 18, duration: 0.5 }
];

    const weeksGrid = document.querySelector('.gantt-chart-weeks-row'); // Select the new weeks container
    const tasksContainer = document.querySelector('.gantt-chart-body'); // Select the new tasks container

    const totalWeeks = 20; // Maximum week number on the chart

    // Generate week labels (0 to totalWeeks with step of 2)
    // Create a label for each week slot (0 to 20), but only put text for even numbers
    for (let i = 0; i <= totalWeeks; i++) {
        const weekLabel = document.createElement('div');
        weekLabel.classList.add('week-label');
        if (i % 2 === 0) { // Only show text for even weeks
            weekLabel.textContent = i;
        } else {
            weekLabel.textContent = ''; // Keep empty for odd weeks to maintain grid structure
        }
        weeksGrid.appendChild(weekLabel);
    }

    // Generate tasks
    ganttData.forEach(item => {
        const row = document.createElement('div');
        row.classList.add('gantt-task-row');

        const label = document.createElement('div');
        label.classList.add('gantt-task-label');
        label.textContent = item.task;
        row.appendChild(label);

        const barWrapper = document.createElement('div');
        barWrapper.classList.add('gantt-task-bar-wrapper');

        const bar = document.createElement('div');
        bar.classList.add('gantt-task-bar');

        // Calculate bar position and width relative to the chart area (totalWeeks)
        // This calculation now works directly on the 1fr column width
        const barStartPx = (item.startWeek / totalWeeks) * 100;
        const barWidthPx = (item.duration / totalWeeks) * 100;

        bar.style.left = `${barStartPx}%`;
        bar.style.width = `${barWidthPx}%`;

        bar.title = `${item.task}\nSemana de inicio: ${item.startWeek}\nDuración: ${item.duration} semanas`;

        barWrapper.appendChild(bar);
        row.appendChild(barWrapper);
        tasksContainer.appendChild(row);
    });

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
    loadCSVTable('table1', 'loadingMessage1', 'EDT_APM.csv');
});