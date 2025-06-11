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
});