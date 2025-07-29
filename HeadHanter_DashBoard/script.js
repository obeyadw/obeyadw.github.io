// URL вашей Google Таблицы в CSV
const csvUrl = "https://docs.google.com/spreadsheets/d/1kyYzOMVS1tgz1xeR7AVQbYaaSxqTLDmEtsY81W27LvI/export?format=csv&gid=0";

// Загружаем CSV и считаем строки
fetch(csvUrl)
  .then(response => response.text())
  .then(csvData => {
    // Разбиваем CSV на строки (убираем пустые)
    const rows = csvData.split('\n').filter(row => row.trim() !== '');
    
    // Первая строка — заголовки, остальные — данные
    const headers = rows[0].split(',');
    const dataRows = rows.slice(1);
    
    console.log("Всего строк (с заголовком):", rows.length);
    console.log("Строк данных:", dataRows.length);
    
    // Можно вывести данные в HTML
    document.getElementById("rowCount").textContent = dataRows.length;
  })
  .catch(error => console.error("Ошибка загрузки CSV:", error));
