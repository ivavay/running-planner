import Calendar from "../../components/Calendar";
import RaceForm from "../../components/RaceForm";
import WeeklyDistance from "../../components/WeeklyDistance";
import { useState } from "react";
export default function Home() {
  const [weeklyDistances, setWeeklyDistances] = useState([]);
  const [programLength, setProgramLength] = useState(0);
  const [eventModal, setEventModal] = useState(false);
  return (
    <>
      <h1>Home Page: Current program</h1>
      <RaceForm
        programLength={programLength}
        setProgramLength={setProgramLength}
      />
      <WeeklyDistance
        programLength={programLength}
        weeklyDistances={weeklyDistances}
        setWeeklyDistances={setWeeklyDistances}
      />
      <Calendar
        programLength={programLength}
        eventModal={eventModal}
        setEventModal={setEventModal}
        weeklyDistances={weeklyDistances}
        setWeeklyDistances={setWeeklyDistances}
      />
    </>
  );
}
