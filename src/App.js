import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import FormBuilder from './FormBuilder';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <h1>Drag and Drop Form Builder</h1>
        <FormBuilder />
      </div>
    </DndProvider>
  );
}

export default App;
