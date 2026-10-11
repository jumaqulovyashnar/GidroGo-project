/**
 * Utility to export data to real CSV format with UTF-8 BOM support for Excel
 * @param {string} filename - name of the exported file (without extension)
 * @param {string[]} headers - array of column names
 * @param {Array<Array<any>>} rows - 2D array of row data
 */
export function exportToCsv(filename, headers, rows) {
  if (!rows || rows.length === 0) {
    return false
  }

  const escapeCell = (cell) => {
    const str = String(cell ?? "").replace(/"/g, '""')
    return `"${str}"`
  }

  const csvContent = [
    headers.map(escapeCell).join(";"),
    ...rows.map((row) => row.map(escapeCell).join(";")),
  ].join("\r\n")

  // \uFEFF is UTF-8 BOM so Excel displays Uzbek Cyrillic/Latin characters properly
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename || "export"}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  return true
}
