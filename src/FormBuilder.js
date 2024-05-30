import React, { useState } from 'react';
import { ReactFormBuilder } from 'react-form-builder2';
import 'react-form-builder2/dist/app.css';
import SortableWrapper from './SortableWrapper';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/sortable';

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

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1, padding: '20px', borderRight: '1px solid gray' }}>
        <h3>Available Fields</h3>
        <button onClick={() => handleAddField('text')}> Text Field</button>
        <button onClick={() => handleAddField('checkbox')}> Checkbox</button>
        <button onClick={() => handleAddField('radio')}> Radio Group</button>
        <button onClick={() => handleAddField('date')}> Date Picker</button>
      </div>
      
      <div style={{ flex: 2, padding: '20px', borderRight: '1px solid gray' }}>
        <h3>Form</h3>
        <SortableWrapper onUpdate={handleSortUpdate}>
          {formFields.map((field, index) => (
            <div key={field.id} id={field.id} style={{ padding: '8px', border: '1px solid gray', margin: '4px' }}>
              <span>{field.type} - {field.label}</span>
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
                {editingField.options.map((option, i) => (
                  <input key={i} value={option} onChange={(e) => handleOptionChange(i, e.target.value)} style={{ marginLeft: '8px', display: 'block', marginTop: '4px' }} />
                ))}
                <button onClick={addOption} style={{ marginTop: '8px' }}>Add Option</button>
              </div>
            )}
            <button onClick={handleSaveField} style={{ marginTop: '8px' }}>Save</button>
          </div>
        )}
      </div>

      <div style={{ flex: 1, padding: '20px' }}>
        <h3>Form Output</h3>
        <pre>{JSON.stringify(formFields, null, 2)}</pre>
      </div>
    </div>
  );
};

export default FormBuilder;
