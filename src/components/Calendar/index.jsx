import styled from "styled-components";
import { useState, useEffect } from "react";
import Event from "../Event";
export default function Calendar({ eventModal, setEventModal }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const todayDate = new Date().toISOString().split("T")[0].slice(-2);
  const [eventCreated, setEventCreated] = useState(Array(31).fill(false));
  const [selectedDay, setSelectedDay] = useState(null);
  const [eventInputs, setEventInputs] = useState({
    title: "",
    date: "",
    distance: "",
    effort: "",
    type: "",
    notes: "",
  });
  // Get number of days in each month
  function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  // Give each month its name
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get the first day of the month and the number of days in the month
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = getDaysInMonth(month, year);

  // Create an array of days for the calendar
  const calendarDays = [];

  // Fill in the empty cells before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // Fill in the days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  // Set today block's background to be different
  //   useEffect(() => {
  //     {
  //       for (let i = 0; i < calendarDays.length; i++) {
  //         if (calendarDays[i] === parseInt(todayDate)) {
  //           setIsToday(true);
  //           console.log("Today is " + todayDate, isToday);
  //           break;
  //         }
  //       }
  //     }
  //   }, [calendarDays]);

  function handlePrevMonth() {
    setCurrentDate(new Date(year, month - 1));
  }

  function handleNextMonth() {
    setCurrentDate(new Date(year, month + 1));
  }

  // Click on a date cell to add an event (modal pops up)
  function handleOpenEventModal(index) {
    console.log("Clicked once");
    setSelectedDay(index);
    setEventModal(!eventModal);
  }
  useEffect(() => {
    console.log("Event modal is " + eventModal);
  }, [eventModal]);

  function handleCreateEvent() {
    if (selectedDay !== null) {
      const newEventCreated = [...eventCreated];
      newEventCreated[selectedDay] = { title: eventInputs.title };
      setEventCreated(newEventCreated);
      setEventModal(false);
    }
  }
  function handleEventTitleChange(event) {
    setEventInputs({ ...eventInputs, title: event.target.value });
  }
  function handleEventDistanceChange(event) {
    setEventInputs({ ...eventInputs, distance: event.target.value });
  }
  function handleEventEffortChange(event) {
    setEventInputs({ ...eventInputs, effort: event.target.value });
  }
  function handleEventTypeChange(event) {
    setEventInputs({ ...eventInputs, type: event.target.value });
  }
  function handleEventNotesChange(event) {
    setEventInputs({ ...eventInputs, notes: event.target.value });
  }
  return (
    <CalendarView>
      <MonthNavigation>
        <MonthButton onClick={handlePrevMonth}>Prev</MonthButton>
        <Month>{`${monthNames[month]} ${year}`}</Month>
        <MonthButton onClick={handleNextMonth}>Next</MonthButton>
      </MonthNavigation>
      <DaysofWeek>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </DaysofWeek>
      <Dates>
        {Array.from({ length: 31 }, (_, index) => (
          <Day
            key={index}
            className="date-cell"
            onClick={() => handleOpenEventModal(index)}
          >
            {index + 1}
            {eventCreated[index] ? (
              <Event title={eventCreated[index].title} />
            ) : null}
          </Day>
        ))}
      </Dates>
      <EventModalCard $eventModal={eventModal}>
        Create event
        <EventTitle
          placeholder="Event title"
          onChange={handleEventTitleChange}
        />
        <EventDate>Date in standard format</EventDate>
        <EventDistanceContainer>
          <EventDistance
            onChange={handleEventDistanceChange}
            placeholder="Distance goal: e.g. 5km"
          />
          <KmSpan>Km</KmSpan>
        </EventDistanceContainer>
        <EventEffort onChange={handleEventEffortChange}>
          <EventTypeOption value="">Select effort</EventTypeOption>
          <EventEffortOption value="Conversational">
            Conversational
          </EventEffortOption>
          <EventEffortOption value="Modereate">Moderate</EventEffortOption>
          <EventEffortOption value="Hard">Hard</EventEffortOption>
        </EventEffort>
        <EventType onChange={handleEventTypeChange}>
          <EventTypeOption value="">Select type</EventTypeOption>
          <EventTypeOption value="Easy">Easy</EventTypeOption>
          <EventTypeOption value="Intervals">Intevals</EventTypeOption>
          <EventTypeOption value="Long">Long</EventTypeOption>
        </EventType>
        <EventNotes
          onChange={handleEventNotesChange}
          placeholder="Workout details here or any other notes"
        />
        <EventSaveButton onClick={handleCreateEvent}>Save</EventSaveButton>
      </EventModalCard>
    </CalendarView>
  );
}

const CalendarView = styled.div``;
const Month = styled.div`
  text-align: center;
  padding: 20px 0;
`;
const DaysofWeek = styled.div`
  padding: 20px 0;
  text-align: center;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;
const Dates = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
`;
const Day = styled.div`
  text-align: left;
  font-size: 10px;
  width: 100%;
  height: 150px;
  border: 1px solid #ccc;
  background-color: ${(props) => (props.isToday ? "lightblue" : "white")};
`;
const MonthNavigation = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const MonthButton = styled.button``;

const EventModalCard = styled.div`
  ${(props) => (props.$eventModal ? "display: flex" : "display: none")};
  background-color: aliceblue;
  border: 1px solid #ccc;
  width: 400px;
  height: 300px;
  position: absolute;
  top: 40%;
  left: 35%;
  padding: 8px;
  flex-direction: column;
  justify-content: center;
`;
const EventDistance = styled.input`
  width: 150px;
  margin: 4px 0;
  padding: 4px;
`;
const EventEffort = styled.select`
  margin: 4px 0;
  padding: 4px;
`;
const EventEffortOption = styled.option``;
const EventTitle = styled.input`
  width: 200px;
  margin: 4px 0;
  padding: 4px;
`;
const EventNotes = styled.textarea`
  width: 95%;
  height: 100px;
  margin: 4px 0;
  padding: 4px;
`;
const EventType = styled.select`
  margin: 4px 0;
  padding: 4px;
`;
const EventTypeOption = styled.option``;
const EventSaveButton = styled.button`
  width: fit-content;
  margin-top: 8px;
`;
const KmSpan = styled.span`
  font-size: 12px;
  margin-left: 4px;
`;
const EventDistanceContainer = styled.div`
  display: flex;
  align-items: center;
`;
const EventDate = styled.div`
  margin: 4px 0;
  font-size: 12px;
`;
