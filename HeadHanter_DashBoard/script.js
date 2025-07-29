// Настройки
const TSV_URL = "https://cors-anywhere.herokuapp.com/https://docs.google.com/spreadsheets/d/1kyYzOMVS1tgz1xeR7AVQbYaaSxqTLDmEtsY81W27LvI/export?format=tsv&gid=0";
const DATE_COLUMN = "published_a";

// Получаем текущую дату в формате DD.MM.YYYY
function getTodayDate() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}.${month}.${year}`;
}

// Основная функция
async function loadData() {
  const loader = document.getElementById('loader');
  const status = document.getElementById('status');
  const totalCount = document.getElementById('totalCount');
  const todayCount = document.getElementById('todayCount');
  const todayDate = document.getElementById('todayDate');
  const dataTable = document.getElementById('dataTable');
  
  const today = getTodayDate();
  todayDate.textContent = today;
  
  try {
    const response = await fetch(TSV_URL);
    if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
    
    const tsvData = await response.text();
    const rows = tsvData.split('\n').filter(row => row.trim() !== '');
    
    if (rows.length < 2) throw new Error('Таблица пуста');
    
    // Парсим заголовки
    const headers = rows[0].split('\t');
    const dateIndex = headers.findIndex(h => h.trim() === DATE_COLUMN);
    if (dateIndex === -1) throw new Error(`Столбец '${DATE_COLUMN}' не найден`);
    
    // Создаем таблицу
    let tableHTML = '<thead><tr>';
    headers.forEach(header => {
      tableHTML += `<th>${header}</th>`;
    });
    tableHTML += '</tr></thead><tbody>';
    
    let total = 0;
    let todayRows = 0;
    
    // Заполняем данными
    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].split('\t');
      total++;
      
      if (cells[dateIndex] && cells[dateIndex].trim() === today) {
        todayRows++;
        tableHTML += '<tr>';
        cells.forEach(cell => {
          tableHTML += `<td>${cell || ''}</td>`;
        });
        tableHTML += '</tr>';
      }
    }
    
    tableHTML += '</tbody>';
    dataTable.innerHTML = tableHTML;
	setupTableSorting();
    
    // Обновляем счетчики
    totalCount.textContent = total;
    todayCount.textContent = todayRows;
    
    // Статус
    status.textContent = `Загружено ${todayRows} строк за сегодня`;
    status.className = 'status success';
    
  } catch (error) {
    status.textContent = `Ошибка: ${error.message}`;
    status.className = 'status error';
    console.error(error);
  } finally {
    loader.style.display = 'none';
  }
}

// Запускаем при загрузке страницы
document.addEventListener('DOMContentLoaded', loadData);


/// Простая сортировка при клике на заголовок
function setupTableSorting() {
  const thElements = document.querySelectorAll('#dataTable th');
  
  thElements.forEach((th, index) => {
    th.style.cursor = 'pointer';
    let sortDirection = 1; // 1 - по возрастанию, -1 - по убыванию
    
    th.addEventListener('click', () => {
      const table = document.getElementById('dataTable');
      const tbody = table.querySelector('tbody');
      const rows = Array.from(tbody.rows);
      
      // Определяем тип данных в столбце
      const sampleValue = rows[0]?.cells[index]?.textContent.trim();
      const isNumeric = !isNaN(parseFloat(sampleValue)) && isFinite(sampleValue);
      
      rows.sort((a, b) => {
        const aText = a.cells[index].textContent.trim();
        const bText = b.cells[index].textContent.trim();
        
        if (isNumeric) {
          const aNum = parseFloat(aText.replace(',', '.'));
          const bNum = parseFloat(bText.replace(',', '.'));
          return (aNum - bNum) * sortDirection;
        } else {
          return aText.localeCompare(bText) * sortDirection;
        }
      });
      
      // Удаляем все строки
      while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
      }
      
      // Добавляем отсортированные строки
      rows.forEach(row => tbody.appendChild(row));
      
      // Меняем направление сортировки
      sortDirection *= -1;
      
      // Обновляем индикаторы сортировки
      thElements.forEach(header => {
        header.textContent = header.textContent.replace(' ↑', '').replace(' ↓', '');
      });
      th.textContent += sortDirection > 0 ? ' ↑' : ' ↓';
    });
  });
}

// Вызываем эту функцию после загрузки данных
// Вставьте этот вызов в конце вашего loadData(), после заполнения таблицы:
// setupTableSorting();
