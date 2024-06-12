import React, { useState, useRef } from 'react';
import '../styles/TimelineEvent.css';

const TimelineEvent = ({ event, dates, zoomLevel }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(event.name);
  const [start, setStart] = useState(event.start);
  const [end, setEnd] = useState(event.end);
  const [isResizing, setIsResizing] = useState(false);
  const [resizingSide, setResizingSide] = useState(null);
  const [dragStartX, setDragStartX] = useState(0);

  const eventRef = useRef(null);

  const handleDoubleClick = () => setIsEditing(true);
  const handleBlur = () => {
    setIsEditing(false);
    event.name = name;
  };

  const handleResizeStart = (e, side) => {
    setIsResizing(true);
    setResizingSide(side);
    setDragStartX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;

    const dragDistance = e.clientX - dragStartX;
    const daysChanged = Math.round(dragDistance / (100 * zoomLevel));

    if (resizingSide === 'left') {
      const newStart = new Date(start);
      newStart.setDate(newStart.getDate() + daysChanged);
      if (newStart <= new Date(end)) {
        setStart(newStart.toISOString().split('T')[0]);
        event.start = newStart.toISOString().split('T')[0];
      }
    } else if (resizingSide === 'right') {
      const newEnd = new Date(end);
      newEnd.setDate(newEnd.getDate() + daysChanged);
      if (newEnd >= new Date(start)) {
        setEnd(newEnd.toISOString().split('T')[0]);
        event.end = newEnd.toISOString().split('T')[0];
      }
    }
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    setResizingSide(null);
  };

  const startIndex = dates.indexOf(start);
  const endIndex = dates.indexOf(end);

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleResizeEnd);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [isResizing]);

  return (
    <div
      className="timeline-event"
      ref={eventRef}
      onDoubleClick={handleDoubleClick}
      style={{
        gridColumn: `${startIndex + 1} / ${endIndex + 2}`,
        transform: `scale(${zoomLevel})`,
      }}
    >
      {isEditing ? (
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleBlur}
        />
      ) : (
        <span>{event.name}</span>
      )}
      <div
        className="resize-handle left"
        onMouseDown={(e) => handleResizeStart(e, 'left')}
      ></div>
      <div
        className="resize-handle right"
        onMouseDown={(e) => handleResizeStart(e, 'right')}
      ></div>
    </div>
  );
};

export default TimelineEvent;
