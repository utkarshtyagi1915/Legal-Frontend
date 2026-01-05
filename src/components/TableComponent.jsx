import React, { useMemo } from "react";

const ROW_HEIGHT = 38;
const HEADER_HEIGHT = 48;
const MAX_VISIBLE_ROWS = 10;

const TableComponent = ({
  tableData,
  columns,
  darkMode,
  maxColumns = 10,
}) => {
  if (!Array.isArray(tableData) || tableData.length === 0) {
    return null;
  }

  // 🔹 Remove markdown divider rows
  const filteredData = tableData.filter(row =>
    !Object.values(row).some(
      val =>
        typeof val === "string" &&
        val.replace(/[-:|]/g, "").trim() === ""
    )
  );

  const sourceData = filteredData.length ? filteredData : tableData;
  const rowCount = sourceData.length;
  const visibleRows = Math.min(rowCount, MAX_VISIBLE_ROWS);

  const calculatedHeight = visibleRows * ROW_HEIGHT + HEADER_HEIGHT;

  // 🔹 Column definitions
  const columnDefs = useMemo(() => {
    if (Array.isArray(columns) && columns.length) {
      return columns.slice(0, maxColumns);
    }

    return Object.keys(sourceData[0] || {})
      .slice(0, maxColumns)
      .map(key => ({
        field: key,
        headerName: key.replace(/_/g, " ").toUpperCase(),
      }));
  }, [columns, sourceData, maxColumns]);

  return (
    <div className="mt-4 w-full">
      <div
        className={`text-sm mb-3 px-1 ${
          darkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        📊 Tabular Data
      </div>

      <table
        className={`w-full text-sm rounded-lg border ${
          darkMode ? "border-gray-600 bg-gray-800" : "border-gray-300 bg-white"
        }`}
        style={{ maxWidth: "700px", margin: "0 auto" }}
      >
        <thead
          className={darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-700"}
        >
          <tr>
            {columnDefs.map((col, index) => (
              <th
                key={col.field}
                className={`px-3 py-2 text-left font-semibold ${
                  darkMode ? "border-gray-600" : "border-gray-300"
                }`}
                style={{
                  minWidth: Math.max(100, (col.headerName || col.field).length * 7),
                }}
                title={col.headerName || col.field}
              >
                {col.headerName || col.field}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sourceData.slice(0, MAX_VISIBLE_ROWS).map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}
              style={{ height: `${ROW_HEIGHT}px` }}
            >
              {columnDefs.map((col, colIndex) => (
                <td
                  key={`${rowIndex}-${col.field}`}
                  className={darkMode ? "text-gray-200" : "text-gray-700"}
                  style={{ padding: "8px 12px" }}
                  title={String(row[col.field] ?? "")}
                >
                  {String(row[col.field] ?? "")}
                </td>
              ))}
            </tr>
          ))}
          {rowCount > MAX_VISIBLE_ROWS && (
            <tr>
              <td
                colSpan={columnDefs.length}
                className={darkMode ? "text-gray-300" : "text-gray-600"}
                style={{ padding: "8px 12px" }}
              >
                Showing {MAX_VISIBLE_ROWS} of {rowCount} rows
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
