"use client"; // Required for browser-only modules like file-saver

import { saveAs } from "file-saver"; // ✅ Import saveAs directly

export async function exportToExcelFile(columns, data, filename = "data.xlsx") {
  if (!data || data.length === 0) {
    alert("No data to export");
    return;
  }

  try {
    const ExcelJS = await import("exceljs");

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    // Set columns
    worksheet.columns = columns.map(col => ({
      header: col.header,
      key: col.key,
      width: col.width || 20,
    }));

    // Add data
    data.forEach(item => worksheet.addRow(item));

    // Style the header and cells
    worksheet.getRow(1).font = { bold: true };
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    saveAs(blob, filename); // ✅ This now works properly
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    alert("Failed to export file.");
  }
}
