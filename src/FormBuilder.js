import React, { useState } from 'react';
import SortableWrapper from './components/SortableWrapper';
import 'jquery-ui/ui/widgets/sortable';
import 'react-form-builder2/dist/app.css';
import './FormBuilder.css'; 

const initialFields = [
  { id: '1', type: 'text', label: 'Text Field', placeholder: 'Enter text' },
  { id: '2', type: 'checkbox', label: 'Checkbox', options: ['Option 1'] },
  { id: '3', type: 'radio', label: 'Radio Group', options: ['Option 1'] },
  { id: '4', type: 'date', label: 'Date Picker', placeholder: '' }
];

const FormBuilder = () => {
  const [formFields, setFormFields] = useState(initialFields);
  const [editingField, setEditingField] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showOutput, setShowOutput] = useState(false);

  const handleAddField = (type) => {
    const newField = {
      id: `${Date.now()}`,
      type,
      label: `${type} Label`,
      placeholder: '',
      options: type === 'checkbox' || type === 'radio' ? ['Option 1'] : undefined
    };
    setFormFields([...formFields, newField]);
  };

  const handleAddColumn = () => {
    const newColumn = {
      id: `${Date.now()}`,
      type: 'column',
      fields: [
        { id: `${Date.now()}-1`, type: 'text', label: 'Text Field 1', placeholder: 'Enter text' },
        { id: `${Date.now()}-2`, type: 'text', label: 'Text Field 2', placeholder: 'Enter text' }
      ]
    };
    setFormFields([...formFields, newColumn]);
  };

  const handleEditField = (index) => {
    setEditingField(formFields[index]);
    setEditingIndex(index);
  };

  const handleRemoveField = (index) => {
    setFormFields(formFields.filter((_, i) => i !== index));
  };

  const handleSaveField = () => {
    const updatedFields = [...formFields];
    updatedFields[editingIndex] = editingField;
    setFormFields(updatedFields);
    setEditingField(null);
    setEditingIndex(null);
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
    setEditingField({ ...editingField, options: [...editingField.options, `Option ${editingField.options.length + 1}`] });
  };

  const handleSortUpdate = (sortedIDs) => {
    const sortedFields = sortedIDs.map(id => formFields.find(field => field.id === id));
    setFormFields(sortedFields);
  };

  const toggleOutputModal = () => {
    setShowOutput(!showOutput);
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
        return (
          <div key={field.id} className="form-group">
            <label>{field.label}</label>
            <input type="text" placeholder={field.placeholder} />
          </div>
        );
      case 'checkbox':
        return (
          <div key={field.id} className="form-group">
            <label>{field.label}</label>
            {field.options.map((option, i) => (
              <div key={i}>
                <input type="checkbox" id={`${field.id}-${i}`} />
                <label htmlFor={`${field.id}-${i}`}>{option}</label>
              </div>
            ))}
          </div>
        );
      case 'radio':
        return (
          <div key={field.id} className="form-group">
            <label>{field.label}</label>
            {field.options.map((option, i) => (
              <div key={i}>
                <input type="radio" name={field.id} id={`${field.id}-${i}`} />
                <label htmlFor={`${field.id}-${i}`}>{option}</label>
              </div>
            ))}
          </div>
        );
      case 'date':
        return (
          <div key={field.id} className="form-group">
            <label>{field.label}</label>
            <input type="date" />
          </div>
        );
      case 'column':
        return (
          <div key={field.id} className="form-column">
            {field.fields.map(subField => renderField(subField))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, padding: '20px', borderRight: '1px solid gray', overflowY: 'auto' }}>
        <h3>Available Fields</h3>
        <button onClick={() => handleAddField('text')} className="button">Text Field</button>
        <button onClick={() => handleAddField('checkbox')} className="button"> Checkbox</button>
        <button onClick={() => handleAddField('radio')} className="button"> Radio Group</button>
        <button onClick={() => handleAddField('date')} className="button"> Date Picker</button>
        <button onClick={handleAddColumn} className="button">Add Column</button>
      </div>
      
      <div style={{ flex: 2, padding: '20px', borderRight: '1px solid gray', overflowY: 'auto' }}>
        <h3>Form</h3>
        <SortableWrapper onUpdate={handleSortUpdate}>
          {formFields.map((field, index) => (
            <div key={field.id} id={field.id} style={{ padding: '8px', border: '1px solid gray', margin: '4px' }}>
              <span>{field.type} - {field.label || 'Column'}</span>
              <button onClick={() => handleEditField(index)} style={{ marginLeft: '8px' }}>Edit</button>
              <button onClick={() => handleRemoveField(index)} style={{ marginLeft: '8px' }}>Delete</button>
            </div>
          ))}
        </SortableWrapper>

        {editingField && (
          <div style={{ marginTop: '20px' }}>
            <h3>Edit Field</h3>
            <label>
              Label:
              <input name="label" value={editingField.label} onChange={handleFieldChange} style={{ marginLeft: '8px' }} />
            </label>
            {editingField.type === 'text' || editingField.type === 'date' ? (
              <label>
                Placeholder:
                <input name="placeholder" value={editingField.placeholder} onChange={handleFieldChange} style={{ marginLeft: '8px' }} />
              </label>
            ) : (
              <div>
                <label>Options:</label>
                {editingField.options && editingField.options.map((option, i) => (
                  <input key={i} value={option} onChange={(e) => handleOptionChange(i, e.target.value)} style={{ marginLeft: '8px', display: 'block', marginTop: '4px' }} />
                ))}
                {editingField.options && <button onClick={addOption} style={{ marginTop: '8px' }}>Add Option</button>}
              </div>
            )}
            <button onClick={handleSaveField} style={{ marginTop: '8px' }}>Save</button>
          </div>
        )}
      </div>

      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <h3>Form Output</h3>
        <button onClick={toggleOutputModal} className="button">Show Output</button>
      </div>

      {showOutput && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={toggleOutputModal} className="close-button">X</button>
            <h3>Form Output</h3>
            <form className="form-output">
              {formFields.map((field) => renderField(field))}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormBuilder;
