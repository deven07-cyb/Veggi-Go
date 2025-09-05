import { useRouter } from 'next/navigation';

export  function capitalizeFirstChar(str) {
    if (!str) return str; // Check for empty string
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export  function validateYouTubeURL(inputURL) {
    const regex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[A-Za-z0-9_-]{11}$/;
    if(regex.test(inputURL)) {
      return true;
    } else {
      return false;
    }
  };

export  function userType(type) {
    const UserType = {
        GOOGLE: "GOOGLE",
        FACEBOOK: "FACEBOOK",
        NONE: "NONE"
    };
    
    return UserType[type] ? UserType[type] : UserType.NONE;
}

export function checkURL(url) {
  const pattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(:[0-9]+)?(\/[^\s]*)?$/;
  if(pattern.test(url)) {
    return true;
  } else {
    return false;
  }
}

export function navigateTo(router, path) {
  router.push(path);
}

// Method 1: Export to CSV (Excel-compatible) - No external libraries needed
export function exportToCSV(columns, data, filename = "data.csv") {
  if (!data || data.length === 0) {
    alert("No data to export");
    return;
  }

  // Create CSV header
  const headers = columns.map(col => col.header).join(',');
  
  // Create CSV rows
  const csvRows = data.map(row => 
    columns.map(col => {
      const value = row[col.key] || '';
      // Escape commas and quotes in CSV
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(',')
  );

  // Combine header and rows
  const csvContent = [headers, ...csvRows].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// Method 2: Export to Excel (XLSX format) using HTML table method
// Fixed Excel export - Direct download as XLS file
export function exportToExcelFile(columns, data, filename = "data.xls") {
  if (typeof window === 'undefined') return; // Ensure client-side

  if (!data || data.length === 0) {
    alert("No data to export");
    return;
  }

  let html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" 
          xmlns:x="urn:schemas-microsoft-com:office:excel" 
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="UTF-8" />
    </head>
    <body>
      <table border="1">
        <thead><tr>`;

  columns.forEach(col => {
    html += `<th>${col.header}</th>`;
  });

  html += '</tr></thead><tbody>';

  data.forEach(row => {
    html += '<tr>';
    columns.forEach(col => {
      html += `<td>${row[col.key] || ''}</td>`;
    });
    html += '</tr>';
  });

  html += '</tbody></table></body></html>';

  const blob = new Blob([html], {
    type: 'application/vnd.ms-excel'
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}


// Fixed PDF export - Direct download as HTML file for print-to-PDF
export function exportToPDFFile(columns, data, filename = "data.html", title = "Data Export") {
  if (typeof window === 'undefined') return; // Ensure client-side

  if (!data || data.length === 0) {
    alert("No data to export");
    return;
  }

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 12px; color: #333; margin: 20px; }
        h1 { text-align: center; margin-bottom: 10px; }
        .export-date { text-align: center; color: #777; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        th { background: #eee; }
        tr:nth-child(even) { background: #f9f9f9; }
        .print-button { display: none; }
        @media print {
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="text-align:center; margin-bottom:10px;">
        <button onclick="window.print()" style="padding:10px 20px; font-size:14px;">🖨️ Print to PDF</button>
      </div>
      <h1>${title}</h1>
      <div class="export-date">Generated on: ${new Date().toLocaleDateString()}</div>
      <table>
        <thead><tr>`;

  columns.forEach(col => {
    html += `<th>${col.header}</th>`;
  });

  html += `</tr></thead><tbody>`;

  data.forEach(row => {
    html += '<tr>';
    columns.forEach(col => {
      html += `<td>${row[col.key] || ''}</td>`;
    });
    html += '</tr>';
  });

  html += `
        </tbody>
      </table>
    </body>
    </html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}


// Method 4: Download as JSON
export function exportToJSON(data, filename = "data.json") {
  if (!data || data.length === 0) {
    alert("No data to export");
    return;
  }

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Method 5: HTML table download (opens in new tab)
export function exportToHTML(columns, data, title = "Data Export") {
  if (!data || data.length === 0) {
    alert("No data to export");
    return;
  }

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #4CAF50; color: white; }
        tr:nth-child(even) { background-color: #f2f2f2; }
        h1 { color: #333; text-align: center; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <table>
        <thead><tr>
  `;

  columns.forEach(col => {
    html += `<th>${col.header}</th>`;
  });

  html += '</tr></thead><tbody>';

  data.forEach(row => {
    html += '<tr>';
    columns.forEach(col => {
      const value = row[col.key] || '';
      html += `<td>${value}</td>`;
    });
    html += '</tr>';
  });

  html += '</tbody></table></body></html>';

  // Open in new window
  const newWindow = window.open();
  newWindow.document.write(html);
  newWindow.document.close();
}


export function getUserRolePermission(name) {

  if (typeof window === 'undefined') {
    return false;
  }
  const toBoolean = (value) => {
    return value?.toLowerCase() === "true";
  }
  const commentPermission = localStorage.getItem("comment_permission") ? toBoolean(localStorage.getItem("comment_permission")) : false;
  const ReadPermission = localStorage.getItem("read_permission") ? toBoolean(localStorage.getItem("read_permission")) : false;
  const ExportPermission = localStorage.getItem("export_permission") ? toBoolean(localStorage.getItem("export_permission")) : false;
  const OfferPermission = localStorage.getItem("offer_permission") ? toBoolean(localStorage.getItem("offer_permission")) : false;
  const WritePermission = localStorage.getItem("write_permission") ? toBoolean(localStorage.getItem("write_permission")) : false;

  switch (name) {
    case "comment":
      return commentPermission;
    case "read":
      return ReadPermission;
    case "export":
      return ExportPermission;
    case "offer":
      return OfferPermission;
    case "write":
      return WritePermission;
    default:
      console.warn("Unknown permission type:", name);
      return false;
  }
};

export function getUserRoleName() {

 if (typeof window === 'undefined') return false; // Guard for SSR

  const name = localStorage.getItem("role") || "admin";
  return name.toLowerCase(); // Normalize if needed
}

export function InitialAvatar ({ fullName }){
  const initial = fullName ? fullName.charAt(0).toUpperCase() : '?';
  const bgColor = getColorFromName(fullName || '');

  return (
    <div
      className="user-name-avatar"
      style={{ backgroundColor: bgColor }}
    >
      {initial.toUpperCase() }
    </div>
  );
};

// Usage examples:
// const columns = [
//   {header: 'Name', key: 'name', width: 30},
//   {header: 'Email', key: 'email', width: 50},
//   {header: 'Mobile', key: 'mobile', width: 20},
//   {header: 'Date', key: 'date', width: 50}
// ];

// const visits = [
//   {name: 'Real Estate', email: 'realestate@gmail.com', mobile: '11', date: '5/28/2025'}, 
//   {name: 'swastik', email: 'swastikpromot@gmail.com', mobile: '1', date: '5/27/2025'},
//   {name: 'OB Real Estate', email: 'contact@obrealestate.ma', mobile: '628282882', date: '4/24/2025'},
//   {name: 'Groupe Mtilak', email: 'contact@groupemtilak.com', mobile: '524431031', date: '2/25/2025'}
// ];

// How to use:
// exportToCSV(columns, visits, 'visits.csv');
// exportToExcelFile(columns, visits, 'visits.xlsx');
// exportToPDFFile(columns, visits, 'Property Visits Report');
// exportToJSON(visits, 'visits.json');
// exportToHTML(columns, visits, 'Property Visits Report');