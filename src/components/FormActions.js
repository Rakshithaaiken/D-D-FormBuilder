import React from 'react';

const handleAddColumn = (formFields, setFormFields, textFieldLabels) => {
  const newColumn = {
    id: `${Date.now()}`,
    type: 'column',
    label: 'Column',
    fields: [
      { id: `${Date.now()}-1`, type: 'text', label: textFieldLabels[0], placeholder: 'Enter text' },
      { id: `${Date.now()}-2`, type: 'text', label: textFieldLabels[1], placeholder: 'Enter text' }
    ]
  };
  setFormFields([...formFields, newColumn]);
};

const FormActions = ({ formFields, setFormFields }) => {
  const textFieldLabels = ['New Label 1', 'New Label 2'];

  return (
    <div>
      <button onClick={() => handleAddColumn(formFields, setFormFields, textFieldLabels)} className="button">Add Column</button>
    </div>
  );      
};

export { handleAddColumn };
export default FormActions;
