import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { renderField } from "../fieldUtils"; // Adjust path as needed

const Column = ({
  field,
  index,
  handleEditField,
  handleRemoveField,
  handleEditSubField,
  handleRemoveSubField,
  handleSubFieldDragEnd,
}) => {
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    handleSubFieldDragEnd(result, index);
  };

  return (
    <div className="form-group">
      <label>{field.label || "Column"}</label>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={`droppable-${field.id}`}>
          {(provided) => (
            <div
              className="form-column"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {field.fields.map((subField, subIndex) => (
                <Draggable
                  key={subField.id}
                  draggableId={subField.id}
                  index={subIndex}
                >
                  {(provided) => (
                    <div
                      className="form-column-item"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {renderField(
                        subField,
                        subIndex,
                        true,
                        false,
                        (nestedIndex) => handleEditSubField(index, nestedIndex),
                        (nestedIndex) =>
                          handleRemoveSubField(index, nestedIndex)
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <button
        onClick={() => handleEditField(index)}
        style={{ marginLeft: "8px" }}
      >
        Edit Column
      </button>
      <button
        onClick={() => handleRemoveField(index)}
        style={{ marginLeft: "8px" }}
      >
        Delete Column
      </button>
    </div>
  );
};

export default Column;
