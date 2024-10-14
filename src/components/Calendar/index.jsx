import styled from "styled-components";
import { useState, useEffect } from "react";
import Event from "../Event";
import { ProgressBar } from "../ProgressBar";
import { saveEvent, deleteEvent, fetchData, getProgramId } from "../../../api";

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
  activeProgramId,
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const todayDate = new Date().toISOString().split("T")[0].slice(-2);
  const [eventCreated, setEventCreated] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const initialEventInputs = {
    title: "",
    date: "",
    distance: "",
    effort: "",
    type: "",
    notes: "",
  };
  const [eventInputs, setEventInputs] = useState(initialEventInputs);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [firebaseEvents, setFirebaseEvents] = useState([]);
  const [stravaEvents, setStravaEvents] = useState([]);
  const [validationError, setValidationError] = useState("");

  // Set the states for firebase and strava events
  useEffect(() => {
    // Firebase events
    setFirebaseEvents(eventsData);
    // Strava events
    fetchData().then((events) => {
      setStravaEvents(events);
    });
  }, [eventsData]);

  useEffect(() => {
    console.log("Event created state updated: ", eventCreated);
    // Any additional logic to handle re-renders based on eventCreated state
  }, [eventCreated]);

  useEffect(() => {
    console.log("Event inputs state updated: ", eventInputs);
    // Any additional logic to handle re-renders based on eventInputs state
  }, [eventInputs]);

  console.log("Firebase Events:", firebaseEvents);
  console.log("Strava Events:", stravaEvents);

  // Helper function to compare two dates
  function areDatesEqual(date1, date2) {
    const d1 = new Date(date1).toISOString().split("T")[0];
    const d2 = new Date(date2).toISOString().split("T")[0];
    return d1 === d2;
  }

  // Compare the Firebase events and Strava events
  const compareData = () => {
    return firebaseEvents.map((event) => {
      const matched = stravaEvents.some((activity) => {
        return (
          areDatesEqual(event.date, activity.start_date_local) &&
          (activity.distance / 1000).toFixed(2) >= event.distance
        );
      });

      // Add a `distanceMatched` field based on whether the condition is met
      return {
        ...event,
        distanceMatched: matched, // true if there's a match
      };
    });
  };

  const matchedEvents = compareData();
  // Print if the events are matched
  console.log("Matched Events: ", matchedEvents);

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
    return new Date(year, month + 1, 0).getDate();
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
    console.log("Existing event: ", existingEvent);
    // If event exists, populate the inputs
    if (existingEvent) {
      // Ensure the existing event has an ID
      if (!existingEvent.id) {
        console.error("Existing event does not have an ID.");
        return;
      }
      setEventInputs(existingEvent);
      console.log("Existing event ID: ", existingEvent.id);
    } else {
      setEventInputs({ ...initialEventInputs, date });
    }

    setEventModal(true);
  }

  useEffect(() => {
    console.log("Event modal is " + eventModal);
  }, [eventModal]);

  // const progr
  // render validation error message if title is blank
  useEffect(() => {
    console.log("Validation error: ", validationError);
  }, [validationError]);
  // If event inputs are not all filled out, disable the save button
  async function handleCreateEvent() {
    if (selectedDay !== null) {
      try {
        console.log("Program ID for created event: ", activeProgramId);
        if (activeProgramId) {
          if (eventInputs.title !== "") {
            const eventId = await saveEvent(eventInputs, activeProgramId);

            setEventCreated((prevEvents) => {
              const newEvents = { ...prevEvents };
              const date = eventInputs.date;
              if (!newEvents[date]) {
                newEvents[date] = [];
              }
              if (eventId) {
                const existingEventIndex = newEvents[date].findIndex(
                  (event) => event.id === eventId
                );
                if (existingEventIndex !== -1) {
                  newEvents[date][existingEventIndex] = eventInputs;
                } else {
                  newEvents[date].push({ ...eventInputs, id: eventId });
                }
              }
              return newEvents;
            });
            setEventModal(false);
            setEventInputs(initialEventInputs);
          } else {
            console.error("Title cannot be blank upon saving.");
            setValidationError("Title needs to be filled out");
          }
        }

        console.log("Event ID after state update: ", eventId);
        console.log("Event created: ", eventCreated);
      } catch (error) {
        console.error("Error creating event: ", error);
      }
    }
  }
  function handleEventTitleChange(event, field) {
    setEventInputs({
      ...eventInputs,
      [field]: event.target.value,
    });
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

  async function handleDeleteEvent(e) {
    if (selectedDay !== null) {
      e.preventDefault();
      try {
        // If event is in firestore, you can delete it

        await deleteEvent(eventInputs, activeProgramId);
        setEventModal(false);
        setEventInputs(initialEventInputs);
        setEventCreated((prevEvents) => {
          const newEvents = { ...prevEvents };
          newEvents[selectedDay] = newEvents[selectedDay].filter(
            (event) => event.id !== eventInputs.id
          );
          return newEvents;
        });
        console.log(`Event with ID ${eventInputs.id} deleted successfully.`);
      } catch (error) {
        console.error("Error deleting event: ", error);
      }
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

          // Calculate the difference in days between the program start date and the current date
          const diffInTime =
            currentDate.getTime() - programStartDateFormatted.getTime();
          // Convert time difference to days
          1000 * 3600 * 24; // number of milliseconds in a day
          const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24)); // Converts time diff from milliseconds to days
          const weekNumber = Math.floor(diffInDays / 7) + 1;

          return (
            <Day
              isToday={day === +todayDate}
              key={index}
              className="date-cell"
              onClick={() => handleOpenEventModal(index)}
              style={{
                "border-bottom":
                  selectedWeek === weekNumber
                    ? "6px solid #266fdd"
                    : "1px solid #ebebeb",
              }}
            >
              {day}
              {eventCreated[
                new Date(year, month, day).toLocaleDateString("en-CA")
              ]?.map((event) => {
                const matchedEvent = matchedEvents.find(
                  (me) => me.date === event.date
                );
                return (
                  <div key={event.id}>
                    <Event
                      title={event.title}
                      goalReached={matchedEvent?.distanceMatched}
                    />
                  </div>
                );
              })}
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
        {eventInputs.title === "" && validationError && (
          <p style={{ color: "red", fontSize: "12px", margin: "4px 0" }}>
            {validationError}
          </p>
        )}
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
        <ModalButtons>
          <EventBtnContainer>
            {eventInputs.id && (
              <EventDeleteButton onClick={handleDeleteEvent}>
                Delete
              </EventDeleteButton>
            )}
            <EventCancelButton onClick={() => setEventModal(false)}>
              Cancel
            </EventCancelButton>
          </EventBtnContainer>
          <EventSaveButton onClick={handleCreateEvent}>Save</EventSaveButton>
        </ModalButtons>
      </EventModalCard>
    </CalendarView>
  );
}

const CalendarView = styled.div``;
const ErrorMessage = styled.div`
  color: red;
  font-size: 12px;
  margin: 4px 0;
`;
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
  gap: 8px;
  margin-bottom: 16px;
`;
const WeekSelectionButton = styled.button`
  background-color: none;
  color: #333;
  border: 1px solid #ccc;
  padding: 4px 8px;
  border-radius: 4px;
  margin-right: 8px;
`;
const Day = styled.div`
  text-align: left;
  text-decoration: ${(props) =>
    props.isToday ? "#4a5bff underline 5px" : "none"};
  margin: 0;
  font-size: 12px;
  width: 100%;
  height: 150px;
  border: 1px solid #e1e1e1;
  padding: 4px;
  background-color: white;
`;
const MonthNavigation = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const MonthButton = styled.button`
  background-color: none;
  color: #333;
  border: 1px solid #ccc;
  padding: 4px 8px;
  border-radius: 4px;
  margin-right: 8px;
`;

const EventModalCard = styled.div`
  ${(props) => (props.$eventModal ? "display: flex" : "display: none")};
  background-color: #ffffff;
  border: 3px solid #333;
  width: 400px;
  height: 300px;
  position: absolute;
  top: 40%;
  left: 35%;
  padding: 16px;
  flex-direction: column;
  justify-content: center;
  border-radius: 8px;
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
  background-color: #4a5bff;
  width: fit-content;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
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
  background-color: #fd6262;
  width: fit-content;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  margin-right: 8px;
`;
const EventCancelButton = styled.div`
  background-color: gray;
  width: fit-content;
  color: white;
  border: none;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
`;
const EventBtnContainer = styled.div`
  display: flex;
  justify-content: flex-start;
`;
const WeeksTotalContainer = styled.div`
  display: flex;
  justify-content: center;
`;
const ModalButtons = styled.div`
  display: flex;
  margin-top: 16px;
  justify-content: space-between;
`;
