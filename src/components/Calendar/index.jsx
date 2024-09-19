import styled from "styled-components";
import { useState, useEffect } from "react";
import Event from "../Event";
import { ProgressBar } from "../ProgressBar";
export default function Calendar({
  setWeeklyDistances,
  weeklyDistances,
  eventModal,
  setEventModal,
  programLength,
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const todayDate = new Date().toISOString().split("T")[0].slice(-2);
  const [eventCreated, setEventCreated] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const initialEventInputs = {
    id: null,
    date: "",
    distance: "",
    effort: "",
    type: "",
    notes: "",
  };
  const [eventInputs, setEventInputs] = useState(initialEventInputs);
  const [selectedWeek, setSelectedWeek] = useState(null);
  console.log(eventInputs);
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

  function handlePrevMonth() {
    setCurrentDate(new Date(year, month - 1));
  }

  function handleNextMonth() {
    setCurrentDate(new Date(year, month + 1));
  }

  // Click on a date cell to add an event (modal pops up)
  // Double clicks don't work for some reason
  function handleOpenEventModal(index) {
    // console.log("Clicked once");
    // setSelectedDay(index);

    // // Create dates based on the index of calendarDays
    // const date = new Date(year, month, calendarDays[index])
    //   .toLocaleDateString()
    //   .split("T")[0];
    // setSelectedDay(date);
    // const existingEvent = eventCreated[date]?.[0];
    // console.log(date);
    // // If event exists, populate the inputs,
    // if (existingEvent) {
    //   setEventInputs(existingEvent);
    // } else {
    //   setEventInputs({ ...initialEventInputs, id: Date.now(), date });
    // }
    // setEventModal(true);
    const date = new Date(year, month, calendarDays[index]).toLocaleDateString(
      "en-CA"
    ); // Capture the date in YYYY-MM-DD format
    setSelectedDay(date);
    setEventInputs({ ...initialEventInputs, id: Date.now(), date });
    setEventModal(true);
  }

  useEffect(() => {
    console.log("Event modal is " + eventModal);
  }, [eventModal]);

  function handleCreateEvent() {
    if (selectedDay !== null) {
      setEventCreated((prevEvents) => {
        const newEvents = { ...prevEvents };
        if (!newEvents[selectedDay]) {
          newEvents[selectedDay] = [];
        }
        newEvents[selectedDay].push({ ...eventInputs });
        return newEvents;
      });

      setEventModal(false);
      setEventInputs(initialEventInputs);
      console.log("Event created: ", eventCreated);
    }
  }
  function handleEventTitleChange(event, field) {
    setEventInputs({ ...eventInputs, [field]: event.target.value });
  }
  function handleEventDistanceChange(event, field) {
    setEventInputs({ ...eventInputs, [field]: event.target.value });
  }
  function handleEventEffortChange(event, field) {
    setEventInputs({ ...eventInputs, [field]: event.target.value });
  }
  function handleEventTypeChange(event, field) {
    setEventInputs({ ...eventInputs, [field]: event.target.value });
  }

  function handleEventNotesChange(event, field) {
    setEventInputs({ ...eventInputs, [field]: event.target.value });
  }

  function handleDeleteEvent() {
    if (selectedDay !== null) {
      setEventCreated((prevEvents) => {
        const newEvents = { ...prevEvents };
        newEvents[selectedDay] = [];
        return newEvents;
      });
      setEventModal(false);
      setEventInputs(initialEventInputs);
    }
  }
  let weeksTotalArr = Array.from({ length: programLength }, (_, i) => i + 1);
  function handleWeekClick(weekNumber) {
    setSelectedWeek(weekNumber);
  }

  return (
    <CalendarView>
      <WeeksTotalContainer>
        {weeksTotalArr.map((index) => (
          <WeekSelectionButton
            onClick={() => handleWeekClick(index)}
            key={index}
          >
            Week {index}
          </WeekSelectionButton>
        ))}
      </WeeksTotalContainer>
      <MonthNavigation>
        <MonthButton onClick={handlePrevMonth}>Prev</MonthButton>
        <Month>{`${monthNames[month]} ${year}`}</Month>
        <MonthButton onClick={handleNextMonth}>Next</MonthButton>
      </MonthNavigation>
      <WeeklyDistanceContainer>
        {selectedWeek !== null &&
        weeklyDistances[selectedWeek - 1] !== undefined ? (
          <Distance>
            Week {selectedWeek} Goal: 0 / {weeklyDistances[selectedWeek - 1]} km
            reached
          </Distance>
        ) : null}
      </WeeklyDistanceContainer>
      {selectedWeek ? <ProgressBar /> : null}
      <DaysofWeek>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </DaysofWeek>
      <Dates>
        {calendarDays.map((day, index) => {
          const weekNumber = Math.floor(index / 7) + 1;
          console.log(selectedWeek);
          return (
            <Day
              key={index}
              className="date-cell"
              onClick={() => handleOpenEventModal(index)}
              style={{
                border:
                  selectedWeek === weekNumber
                    ? "5px solid lightblue"
                    : "1px solid #ccc",
              }}
            >
              {day}
              {eventCreated[
                new Date(year, month, day).toLocaleDateString("en-CA")
              ]?.map((event) => (
                <Event key={event.id} title={event.title} />
              ))}
            </Day>
          );
        })}
      </Dates>
      <EventModalCard $eventModal={eventModal}>
        Create event
        <EventTitle
          placeholder="Event title"
          value={eventInputs.title || ""}
          onChange={(e) => handleEventTitleChange(e, "title")}
        />
        <EventDate>Date in local string format: {eventInputs.date} </EventDate>
        <EventDistanceContainer>
          <EventDistance
            value={eventInputs.distance || ""}
            onChange={(e) => handleEventDistanceChange(e, "distance")}
            placeholder="Distance goal: e.g. 5km"
          />
          <KmSpan>Km</KmSpan>
        </EventDistanceContainer>
        <EventEffort
          value={eventInputs.effort || ""}
          onChange={(e) => handleEventEffortChange(e, "effort")}
        >
          <EventTypeOption value="">Select effort</EventTypeOption>
          <EventEffortOption value="Conversational">
            Conversational
          </EventEffortOption>
          <EventEffortOption value="Modereate">Moderate</EventEffortOption>
          <EventEffortOption value="Hard">Hard</EventEffortOption>
        </EventEffort>
        <EventType
          value={eventInputs.type || ""}
          onChange={(e) => handleEventTypeChange(e, "type")}
        >
          <EventTypeOption value="">Select type</EventTypeOption>
          <EventTypeOption value="Easy">Easy</EventTypeOption>
          <EventTypeOption value="Intervals">Intevals</EventTypeOption>
          <EventTypeOption value="Long">Long</EventTypeOption>
        </EventType>
        <EventNotes
          value={eventInputs.notes || ""}
          onChange={(e) => handleEventNotesChange(e, "notes")}
          placeholder="Workout details here or any other notes"
        />
        <EventSaveButton onClick={handleCreateEvent}>Save</EventSaveButton>
        <EventDeleteButton onClick={handleDeleteEvent}>
          Delete
        </EventDeleteButton>
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
const WeekSelectionButton = styled.button``;
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
const EventDeleteButton = styled.button`
  width: fit-content;
`;
const WeeksTotalContainer = styled.div`
  display: flex;
  justify-content: center;
`;
const Distance = styled.div``;
const WeeklyDistanceContainer = styled.div`
  display: flex;
  justify-content: center;
`;
