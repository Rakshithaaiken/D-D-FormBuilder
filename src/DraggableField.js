import React from 'react';
import { useDrag } from 'react-dnd';

const DraggableField = ({ type }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'FIELD',
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        padding: '8px',
        margin: '4px',
        border: '1px dashed gray',
      }}
    >
      {type}
    </div>
  );
};

export default DraggableField;
