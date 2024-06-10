// fieldUtils.js
import React from 'react';

export const renderField = (
  field,
  index,
  isNested = false,
  isOutputView = false,
  handleEditField,
  handleRemoveField
) => {
  const fieldProps = {
    key: field.id,
    className: 'form-group'
  };

  if (field.type === 'column') {
    return null; // Handled by the Column component itself
  }

  return (
    <div {...fieldProps}>
      <label>{field.label}</label>
      {field.type === 'text' && <input type="text" placeholder={field.placeholder} />}
      {field.type === 'date' && <input type="date" />}
      {field.type === 'textarea' && <textarea placeholder={field.placeholder}></textarea>}
      {field.type === 'file' && <input type="file" />}
      {field.type === 'select' && (
        <select>
          {field.options.map((option, i) => (
            <option key={i} value={option}>{option}</option>
          ))}
        </select>
      )}
      {field.type === 'checkbox' && field.options.map((option, i) => (
        <div key={i}>
          <input type="checkbox" id={`${field.id}-${i}`} />
          <label htmlFor={`${field.id}-${i}`}>{option}</label>
        </div>
      ))}
      {field.type === 'radio' && field.options.map((option, i) => (
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
          <button onClick={() => handleEditField(index)} style={{ marginLeft: '8px' }}>Edit</button>
          <button onClick={() => handleRemoveField(index)} style={{ marginLeft: '8px' }}>Delete</button>
        </>
      )}
    </div>
  );
};
