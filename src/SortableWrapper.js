import React, { useEffect } from 'react';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/sortable';

const SortableWrapper = ({ children, onUpdate }) => {
  useEffect(() => {
    $(() => {
      $("#sortable").sortable({
        update: (event, ui) => {
          let sortedIDs = $("#sortable").sortable("toArray");
          onUpdate(sortedIDs);
        }
      });
    });
  }, [onUpdate]);

  return (
    <div id="sortable" style={{ userSelect: 'none' }}>
      {children}
    </div>
  );
};

export default SortableWrapper;
