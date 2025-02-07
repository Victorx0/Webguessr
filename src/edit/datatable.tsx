import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const DataTable = ({ dbdata, onSave }) => {
  // Early return if no data
  if (!dbdata || dbdata.length === 0) {
    return <div className="text-muted">No data available</div>;
  }

  // State to track edited data
  const [editedData, setEditedData] = useState(dbdata);
  const [isSaving, setIsSaving] = useState(false);

  const headers = Object.keys(editedData[0] || {}).filter(header => 
    !['created_at', 'id'].includes(header)
  );

  // Handle input changes
  const handleChange = (rowIndex, header, value) => {
    const newData = [...editedData];
    newData[rowIndex] = {
      ...newData[rowIndex],
      [header]: value
    };
    setEditedData(newData);
  };

  // Handle add new row
  const handleAddRow = () => {
    const newRow = {};
    // Initialize all fields as empty strings
    headers.forEach(header => {
      newRow[header] = '';
    });
    setEditedData([...editedData, newRow]);
  };

  // Handle save
  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(editedData);
      alert('Changes saved successfully!');
    } catch (error) {
      alert('Error saving changes: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="display-4">Welcome to the Editor</h1>
        <div>
          <button 
            className="btn btn-success me-2"
            onClick={handleAddRow}
          >
            Add Row
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
      
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-light">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  scope="col"
                >
                  <input 
                    type="text" 
                    value={header} 
                    readOnly 
                    className="form-control-plaintext"
                  />
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
                      value={row[header]} 
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