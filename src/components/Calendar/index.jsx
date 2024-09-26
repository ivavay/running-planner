import styled from "styled-components";
import { useState, useEffect } from "react";
import Event from "../Event";
import { ProgressBar } from "../ProgressBar";
import { saveEvent } from "../../../api";

export default function Calendar({
  setWeeklyDistances,
  weeklyDistances,
  eventModal,
  setEventModal,
  programLength,
  programStartDate,
  programEndDate,
  userId,
  eventsData,
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const todayDate = new Date().toISOString().split("T")[0].slice(-2);
  const [eventCreated, setEventCreated] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const initialEventInputs = {
    date: "",
    distance: "",
    effort: "",
    type: "",
    notes: "",
  };
  const [eventInputs, setEventInputs] = useState(initialEventInputs);
  const [selectedWeek, setSelectedWeek] = useState(null);

  useEffect(() => {
    // Populate eventCreated state with eventsData
    const eventsByDate = eventsData.reduce((acc, event) => {
      const date = event.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    }, {});
    setEventCreated(eventsByDate);
  }, [eventsData]);

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
  // Util
  // function toISOString(dateString) {
  //   const date = new Date(dateString);
  //   return date.toISOString();
  // }

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

  // function handleJumpToMonth(weekNumber) {
  //   Do later
  //   I want to jump to the month where the selected week is
  // }
  function handleWeekClick(weekNumber) {
    setSelectedWeek(weekNumber);
    // handleJumpToMonth(weekNumber);
  }
  // Click on a date cell to add an event (modal pops up)
  // Double clicks don't work for some reason
  function handleOpenEventModal(index) {
    const date = new Date(year, month, calendarDays[index]).toLocaleDateString(
      "en-CA"
    ); // Capture the date in YYYY-MM-DD format
    setSelectedDay(date);
    const existingEvent = eventCreated[date]?.[0];
    // If event exists, populate the inputs,
    if (existingEvent) {
      setEventInputs(existingEvent);
    } else {
      setEventInputs({ ...initialEventInputs, date });
    }
    setEventModal(true);
  }

  useEffect(() => {
    console.log("Event modal is " + eventModal);
  }, [eventModal]);

  async function handleCreateEvent() {
    const programId = "zuVE3akJV5YsHC3vuYIP";
    if (selectedDay !== null) {
      try {
        const eventId = await saveEvent(eventInputs, programId);
        setEventCreated((prevEvents) => {
          const newEvents = { ...prevEvents };
          if (!newEvents[selectedDay]) {
            newEvents[selectedDay] = [];
          }
          newEvents[selectedDay].push({ ...eventInputs, id: eventId });
          return newEvents;
        });

        setEventModal(false);
        setEventInputs(initialEventInputs);
        console.log("Event created: ", eventCreated);
      } catch (error) {
        console.error("Error creating event: ", error);
      }
    }
  }
  function handleEventTitleChange(event) {
    setEventInputs((prevInputs) => ({
      ...prevInputs,
      title: event.target.value,
    }));
  }
  function handleEventDistanceChange(event, field) {
    setEventInputs({ ...eventInputs, [field]: parseFloat(event.target.value) });
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
      {selectedWeek ? (
        <ProgressBar
          weeklyDistances={weeklyDistances}
          programStartDate={programStartDate}
          programEndDate={programEndDate}
          selectedWeek={selectedWeek}
        />
      ) : null}
      <DaysofWeek>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </DaysofWeek>
      <Dates>
        {calendarDays.map((day, index) => {
          // Calculates the difference in days between the two dates
          // Determines the week number based on that difference
          // CurrentDate is the date being iterated over
          const currentDate = new Date(year, month, day);
          const programStartDateFormatted = new Date(programStartDate);
          const programEndDateFormatted = new Date(programEndDate);
          // Avoid timezone issues
          currentDate.setHours(0, 0, 0, 0);
          programStartDateFormatted.setHours(0, 0, 0, 0);
          programEndDateFormatted.setHours(0, 0, 0, 0);

          // Check if current date is within the program start and end dates
          if (currentDate > programEndDateFormatted) {
            return <Day key={index} className="date-cell" />;
          }
          // Calculate the difference in days between the program start date and the current date
          const diffInTime =
            currentDate.getTime() - programStartDateFormatted.getTime();
          // Convert time difference to days
          1000 * 3600 * 24; // number of milliseconds in a day
          const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24)); // Converts time diff from milliseconds to days
          const weekNumber = Math.floor(diffInDays / 7) + 1;

          return (
            <Day
              key={index}
              className="date-cell"
              onClick={() => handleOpenEventModal(index)}
              style={{
                outline:
                  selectedWeek === weekNumber
                    ? "3px solid lightblue"
                    : "1px solid #ebebeb",
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
