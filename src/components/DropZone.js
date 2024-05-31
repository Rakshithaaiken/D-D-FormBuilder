import React from 'react';
import { useDrop } from 'react-dnd';

const DropZone = ({ onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'FIELD',
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      style={{
        minHeight: '100px',
        padding: '16px',
        margin: '8px',
        border: '2px dashed gray',
        backgroundColor: isOver ? 'lightblue' : 'white',
      }}
    >
      Drop fields here
    </div>
  );
};

export default DropZone;
