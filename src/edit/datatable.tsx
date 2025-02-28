import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

type DataTableProps<T extends Record<string, any>> = {
  dbdata: T[];
  onSave: (data: T[]) => Promise<void>;
};

const DataTable = <T extends Record<string, any>>({ dbdata, onSave }: DataTableProps<T>) => {
  if (!dbdata || dbdata.length === 0) {
    return <div className="text-muted">No data available</div>;
  }

  const [editedData, setEditedData] = useState<T[]>(dbdata);
  const [isSaving, setIsSaving] = useState(false);

  const headers = Object.keys(editedData[0] || {}).filter(
    (header) => !["created_at", "id"].includes(header)
  );

  const handleChange = (rowIndex: number, header: string, value: string) => {
    setEditedData((prevData) =>
      prevData.map((row, i) =>
        i === rowIndex ? { ...row, [header]: value } : row
      )
    );
  };

  const handleAddRow = () => {
    const newRow = Object.fromEntries(headers.map((header) => [header, ""])) as T;
    setEditedData([...editedData, newRow]);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(editedData);
      alert("Changes saved successfully!");
    } catch (error) {
      alert("Error saving changes: " + (error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="display-4">Welcome to the Editor</h1>
        <div>
          <button className="btn btn-success me-2" onClick={handleAddRow}>
            Add Row
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-light">
            <tr>
              {headers.map((header) => (
                <th key={header} scope="col">
                  <input type="text" value={header} readOnly className="form-control-plaintext" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {editedData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((header) => (
                  <td key={`${rowIndex}-${header}`}>
                    <input
                      type="text"
                      value={row[header] as string}
                      onChange={(e) => handleChange(rowIndex, header, e.target.value)}
                      className="form-control"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
