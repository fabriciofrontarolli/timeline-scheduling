import React, { useEffect, useState } from 'react';
import TimelineEvent from './TimelineEvent';
import '../styles/Timeline.css';

/**
 * @param {Number} startDate The starting date range
 * @param {Number} endDate The ending date range
 * @returns Returns an array a continuous array of dates from start to finish to be used in the timeline
 */
const generateDateSequence = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  const lastDate = new Date(endDate);
  while (currentDate <= lastDate) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

const Timeline = ({ events }) => {
  const [dates, setDates] = useState([]);

  useEffect(() => {
    const minimumDate = new Date(Math.min(...events.map(event => new Date(event.start))));
    const maximumDate = new Date(Math.max(...events.map(event => new Date(event.end))));
    const dates = generateDateSequence(minimumDate, maximumDate);
    setDates(dates);
  }, []);

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        {dates.map(date => (
          <div key={date} className="timeline-header-cell">
            {date}
          </div>
        ))}
      </div>
      <div className="timeline-body">
        {events.map(event => (
          <TimelineEvent
            key={event.id}
            event={event}
            dates={dates}
            zoomLevel={1}
          />
        ))}
      </div>
    </div>
  );
};

export default Timeline;
