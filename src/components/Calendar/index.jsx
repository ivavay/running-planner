import styled from "styled-components";
import { useState, useEffect } from "react";
import Event from "../Event";
export default function Calendar({ eventModal, setEventModal }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const todayDate = new Date().toISOString().split("T")[0].slice(-2);

  console.log(todayDate);
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
  // Double clicks don't work for some reason
  function handleAddEvent() {
    console.log("Clicked once");
    setEventModal(!eventModal);
  }
  useEffect(() => {
    console.log("Event modal is " + eventModal);
  }, [eventModal]);

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
        {calendarDays.map((day, index) => (
          <Day key={index} className="date-cell" onClick={handleAddEvent}>
            {day}
            <Event />
          </Day>
        ))}
      </Dates>
      <EventModalCard $eventModal={eventModal}>Create event</EventModalCard>
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
  ${(props) => (props.$eventModal ? "display: block" : "display: none")};
  background-color: aliceblue;
  border: 1px solid #ccc;
  width: 400px;
  height: 300px;
  position: absolute;
  top: 40%;
  left: 35%;
  padding: 8px;
`;
