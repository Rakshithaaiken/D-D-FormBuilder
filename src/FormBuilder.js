import React, { useState } from 'react';
import SortableWrapper from './components/SortableWrapper';
import 'jquery-ui/ui/widgets/sortable';
import './FormBuilder.css';

const initialFields = [
  { id: '1', type: 'text', label: 'Text Field', placeholder: 'Enter text' },
  { id: '2', type: 'checkbox', label: 'Checkbox', options: ['Option 1'] },
  { id: '3', type: 'radio', label: 'Radio Group', options: ['Option 1'] },
  { id: '4', type: 'date', label: 'Date Picker', placeholder: '' },
  { id: '5', type: 'select', label: 'Dropdown', options: ['Option 1'] },
  { id: '6', type: 'textarea', label: 'Textarea', placeholder: 'Enter text' },
  { id: '7', type: 'file', label: 'File Upload' },
];

const FormBuilder = () => {
  const [formFields, setFormFields] = useState(initialFields);
  const [savedFormFields, setSavedFormFields] = useState([]);
  const [editingField, setEditingField] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [nestedEditingIndex, setNestedEditingIndex] = useState(null);
  const [showOutput, setShowOutput] = useState(false);

  const handleAddField = (type) => {
    const newField = {
      id: `${Date.now()}`,
      type,
      label: `${type} Label`,
      placeholder: '',
      options: type === 'checkbox' || type === 'radio' || type === 'select' ? ['Option 1'] : undefined
    };
    setFormFields([...formFields, newField]);
  };

  const handleAddColumn = () => {
    const newColumn = {
      id: `${Date.now()}`,
      type: 'column',
      label: 'Column',
      fields: [
        { id: `${Date.now()}-1`, type: 'text', label: 'Fist name', placeholder: 'Enter text' },
        { id: `${Date.now()}-2`, type: 'text', label: 'Last name', placeholder: 'Enter text' }
      ]
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
      updatedFields[index].fields = updatedFields[index].fields.filter((_, i) => i !== nestedIndex);
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
    setEditingField({ ...editingField, options: [...editingField.options, `Option ${editingField.options.length + 1}`] });
  };

  const handleSortUpdate = (sortedIDs) => {
    const sortedFields = sortedIDs.map(id => formFields.find(field => field.id === id)).filter(field => field !== undefined);
    setFormFields(sortedFields);
  };

  const handleSaveForm = () => {
    setSavedFormFields([...formFields]);
    alert('Form has been saved successfully!');
  };

  const toggleOutputModal = () => {
    setShowOutput(!showOutput);
  };

  const renderField = (field, index, isNested = false, isOutputView = false) => {
    const fieldProps = {
      key: field.id,
      className: 'form-group'
    };

    if (field.type === 'column') {
      return (
        <div {...fieldProps}>
          <label>{field.label || 'Column'}</label>
          <div className="form-column">
            {field.fields.map((subField, subIndex) => (
              <div key={subField.id} className="form-column-item">
                {renderField(subField, subIndex, true, isOutputView)}
              </div>
            ))}
          </div>
          {!isNested && !isOutputView && (
            <>
              <button onClick={() => handleEditField(index)} style={{ marginLeft: '8px' }}>Edit</button>
              <button onClick={() => handleRemoveField(index)} style={{ marginLeft: '8px' }}>Delete</button>
            </>
          )}
        </div>
      );
    }

    return (
      <div {...fieldProps}>
        <label>{field.label}</label>
        {field.type === 'text' && <input type="text" placeholder={field.placeholder} />}
        {field.type === 'date' && <input type="date" />}
        {field.type === 'textarea' && <textarea placeholder={field.placeholder}></textarea>}
        {field.type === 'file' && <input type="file" />}
        {field.type === 'select' &&
          <select>
            {field.options.map((option, i) => (
              <option key={i} value={option}>{option}</option>
            ))}
          </select>}
        {field.type === 'checkbox' &&
          field.options.map((option, i) => (
            <div key={i}>
              <input type="checkbox" id={`${field.id}-${i}`} />
              <label htmlFor={`${field.id}-${i}`}>{option}</label>
            </div>
          ))}
        {field.type === 'radio' &&
          field.options.map((option, i) => (
            <div key={i}>
              <input type="radio" name={field.id} id={`${field.id}-${i}`} />
              <label htmlFor={`${field.id}-${i}`}>{option}</label>
            </div>
          ))}
        {!isNested && !isOutputView && (
          <>
            <button onClick={() => handleEditField(index)} style={{ marginLeft: '8px' }}>Edit</button>
            <button onClick={() => handleRemoveField(index)} style={{ marginLeft: '8px' }}>Delete</button>
          </>
        )}
        {isNested && !isOutputView && (
          <>
            <button onClick={() => handleEditField(editingIndex, index)} style={{ marginLeft: '8px' }}>Edit</button>
            <button onClick={() => handleRemoveField(editingIndex, index)} style={{ marginLeft: '8px' }}>Delete</button>
          </>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, padding: '20px', borderRight: '1px solid gray', overflowY: 'auto' }}>
        <h3>Available Fields</h3>
        <button onClick={() => handleAddField('text')} className="button">Add Text Field</button>
        <button onClick={() => handleAddField('checkbox')} className="button">Add Checkbox</button>
        <button onClick={() => handleAddField('radio')} className="button">Add Radio Group</button>
        <button onClick={() => handleAddField('date')} className="button">Add Date Picker</button>
        <button onClick={() => handleAddField('select')} className="button">Add Dropdown</button>
        <button onClick={() => handleAddField('textarea')} className="button">Add Textarea</button>
        <button onClick={() => handleAddField('file')} className="button">Add File Upload</button>
        <button onClick={handleAddColumn} className="button">Add Column</button>
      </div>

      <div style={{ flex: 2, padding: '20px', borderRight: '1px solid gray', overflowY: 'auto' }}>
        <h3>Form Builder</h3>
        <SortableWrapper onUpdate={handleSortUpdate}>
          {formFields.map((field, index) => renderField(field, index))}
        </SortableWrapper>
        <button onClick={handleSaveForm} className="button">Save Form</button>
        <button onClick={toggleOutputModal} className="button">View Output</button>
        {/* <button onClick={handleResetForm} className="button">Reset Form</button> */}
      </div>

      {showOutput && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={toggleOutputModal} className="close-button">X</button>
            <h3>Form Output</h3>
            <form className="form-output">
              {savedFormFields.map((field) => renderField(field, null, false, true))}
            </form>
          </div>
        </div>
      )}

      {editingField && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Field</h3>
            <div>
              <label>Label</label>
              <input type="text" name="label" value={editingField.label} onChange={handleFieldChange} />
            </div>
            {editingField.type === 'text' && (
              <div>
                <label>Placeholder</label>
                <input type="text" name="placeholder" value={editingField.placeholder} onChange={handleFieldChange} />
              </div>
            )}
            {(editingField.type === 'checkbox' || editingField.type === 'radio' || editingField.type === 'select') && (
              <div>
                <label>Options</label>
                {editingField.options.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    style={{ display: 'block', marginTop: '5px' }}
                  />
                ))}
                <button onClick={addOption} style={{ marginTop: '8px' }}>Add Option</button>
              </div>
            )}
            <button onClick={handleSaveField} style={{ marginTop: '8px' }}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormBuilder;
