import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Column from './components/Column';
import { renderField } from './fieldUtils'; 
import './FormBuilder.css'; 
import SortableWrapper from './components/SortableWrapper'; 

const initialFields = [
  { id: "1", type: "text", label: "Text Field", placeholder: "Enter text" },
  { id: "2", type: "checkbox", label: "Checkbox", options: ["Option 1"] },
  { id: "3", type: "radio", label: "Radio Group", options: ["Option 1"] },
  { id: "4", type: "date", label: "Date Picker", placeholder: "" },
  { id: "5", type: "select", label: "Dropdown", options: ["Option 1"] },
  { id: "6", type: "textarea", label: "Textarea", placeholder: "Enter text" },
  { id: "7", type: "file", label: "File Upload" },
];

const FormBuilder = () => {
  const [formFields, setFormFields] = useState(initialFields);
  const [editingField, setEditingField] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [nestedEditingIndex, setNestedEditingIndex] = useState(null);
  const [showOutput, setShowOutput] = useState(false);

  const handleAddField = (type) => {
    const newField = {
      id: `${Date.now()}`,
      type,
      label: `${type} Label`,
      placeholder: "",
      options:
        type === "checkbox" || type === "radio" || type === "select"
          ? ["Option 1"]
          : undefined,
    };
    setFormFields([...formFields, newField]);
  };

  const handleAddColumn = () => {
    const newColumn = {
      id: `${Date.now()}`,
      type: "column",
      label: "Column",
      fields: [
        {
          id: `${Date.now()}-1`,
          type: "text",
          label: "Enter text",
          placeholder: "Enter text",
        },
        {
          id: `${Date.now()}-2`,
          type: "text",
          label: "Enter text",
          placeholder: "Enter text",
        },
      ],
    };
    setFormFields([...formFields, newColumn]);
  };

  const handleEditField = (index, nestedIndex = null) => {
    if (nestedIndex === null) {
      setEditingField(formFields[index]);
      setEditingIndex(index);
      setNestedEditingIndex(null);
    } else {
      setEditingField(formFields[index].fields[nestedIndex]);
      setEditingIndex(index);
      setNestedEditingIndex(nestedIndex);
    }
  };

  const handleRemoveField = (index, nestedIndex = null) => {
    if (nestedIndex === null) {
      setFormFields(formFields.filter((_, i) => i !== index));
    } else {
      const updatedFields = [...formFields];
      updatedFields[index].fields = updatedFields[index].fields.filter(
        (_, i) => i !== nestedIndex
      );
      setFormFields(updatedFields);
    }
  };

  const handleSaveField = () => {
    const updatedFields = [...formFields];
    if (nestedEditingIndex === null) {
      updatedFields[editingIndex] = editingField;
    } else {
      updatedFields[editingIndex].fields[nestedEditingIndex] = editingField;
    }
    setFormFields(updatedFields);
    setEditingField(null);
    setEditingIndex(null);
    setNestedEditingIndex(null);
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditingField({ ...editingField, [name]: value });
  };

  const handleOptionChange = (index, value) => {
    const options = [...editingField.options];
    options[index] = value;
    setEditingField({ ...editingField, options });
  };

  const addOption = () => {
    setEditingField({
      ...editingField,
      options: [
        ...editingField.options,
        `Option ${editingField.options.length + 1}`,
      ],
    });
  };

  const handleSortUpdate = (result, columnIndex = null) => {
    if (!result.destination) return;
    const updatedFields = [...formFields];

    if (columnIndex === null) {
      const [movedField] = updatedFields.splice(result.source.index, 1);
      updatedFields.splice(result.destination.index, 0, movedField);
    } else {
      const column = updatedFields[columnIndex];
      const [movedField] = column.fields.splice(result.source.index, 1);
      column.fields.splice(result.destination.index, 0, movedField);
    }

    setFormFields(updatedFields);
  };

  const toggleOutputModal = () => {
    setShowOutput(!showOutput);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div
        style={{
          flex: 1,
          padding: "20px",
          borderRight: "1px solid gray",
          overflowY: "auto",
        }}
      >
        <h3>Available Fields</h3>
        <button onClick={() => handleAddField("text")} className="button">
          Add Text Field
        </button>
        <button onClick={() => handleAddField("checkbox")} className="button">
          Add Checkbox
        </button>
        <button onClick={() => handleAddField("radio")} className="button">
          Add Radio Group
        </button>
        <button onClick={() => handleAddField("date")} className="button">
          Add Date Picker
        </button>
        <button onClick={() => handleAddField("select")} className="button">
          Add Dropdown
        </button>
        <button onClick={() => handleAddField("textarea")} className="button">
          Add Textarea
        </button>
        <button onClick={() => handleAddField("file")} className="button">
          Add File Upload
        </button>
        <button onClick={handleAddColumn} className="button">
          Add Column
        </button>
        <button onClick={toggleOutputModal} className="button">
          Custom Column Field
        </button>
      </div>

      <div style={{ flex: 2, padding: "20px", overflowY: "auto" }}>
        <h3>Form Builder</h3>
        <SortableWrapper onUpdate={handleSortUpdate}>
          {formFields.map((field, index) => (
            <div key={field.id} id={field.id}>
              {field.type === "column" ? (
                <Column
                  field={field}
                  index={index}
                  handleEditField={handleEditField}
                  handleRemoveField={handleRemoveField}
                  handleEditSubField={handleEditField}
                  handleRemoveSubField={handleRemoveField}
                  handleSubFieldDragEnd={handleSortUpdate}
                />
              ) : (
                renderField(
                  field,
                  index,
                  false,
                  false,
                  handleEditField,
                  handleRemoveField
                )
              )}
            </div>
          ))}
        </SortableWrapper>
      </div>

      <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        <h3>Form Output</h3>
        <button onClick={toggleOutputModal} className="button">
          Show Output
        </button>
      </div>

      {showOutput && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={toggleOutputModal} className="close-button">
              X
            </button>
            <h3>Form Output</h3>
            <form className="form-output">
              {formFields.map((field) => renderField(field, null, false, true))}
            </form>
          </div>
        </div>
      )}

      {editingField && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              onClick={() => setEditingField(null)}
              className="close-button"
            >
              X
            </button>
            <h3>Edit Field</h3>
            <div>
              <label>Label</label>
              <input
                type="text"
                name="label"
                value={editingField.label}
                onChange={handleFieldChange}
              />
            </div>
            {editingField.type === "text" && (
              <div>
                <label>Placeholder</label>
                <input
                  type="text"
                  name="placeholder"
                  value={editingField.placeholder}
                  onChange={handleFieldChange}
                />
              </div>
            )}
            {(editingField.type === "checkbox" ||
              editingField.type === "radio" ||
              editingField.type === "select") && (
              <div>
                <label>Options</label>
                {editingField.options.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    style={{ display: "block", marginTop: "5px" }}
                  />
                ))}
                <button onClick={addOption} style={{ marginTop: "8px" }}>
                  Add Option
                </button>
              </div>
            )}
            <button onClick={handleSaveField} style={{ marginTop: "8px" }}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormBuilder;