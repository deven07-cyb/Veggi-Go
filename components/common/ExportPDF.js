import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function exportToPDFFile(columns, data, filename = "data.pdf") {
  if (!data || data.length === 0) {
    alert("No data to export");
    return;
  }

  const doc = new jsPDF();

  const headers = columns.map(col => col.header);
  const rows = data.map(row => columns.map(col => row[col.key] ?? ""));

  // Call autoTable passing the doc explicitly
  autoTable(doc, {
    head: [headers],
    body: rows,
    styles: { halign: 'center', valign: 'middle' },
    headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
  });

  doc.save(filename);
}
