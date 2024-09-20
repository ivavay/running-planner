import Calendar from "../../components/Calendar";
import RaceForm from "../../components/RaceForm";
import WeeklyDistance from "../../components/WeeklyDistance";
import { useState } from "react";
export default function Home() {
  const [weeklyDistances, setWeeklyDistances] = useState([]);
  const [programLength, setProgramLength] = useState(0);
  const [eventModal, setEventModal] = useState(false);
  const [programStartDate, setProgramStartDate] = useState("");
  const [programEndDate, setProgramEndDate] = useState("");
  return (
    <>
      <h1>Home Page: Current program</h1>
      <RaceForm
        programLength={programLength}
        setProgramLength={setProgramLength}
        programStartDate={programStartDate}
        setProgramStartDate={setProgramStartDate}
        setProgramEndDate={setProgramEndDate}
        programEndDate={programEndDate}
      />
      <WeeklyDistance
        programLength={programLength}
        weeklyDistances={weeklyDistances}
        setWeeklyDistances={setWeeklyDistances}
      />
      <Calendar
        programStartDate={programStartDate}
        programEndDate={programEndDate}
        programLength={programLength}
        eventModal={eventModal}
        setEventModal={setEventModal}
        weeklyDistances={weeklyDistances}
        setWeeklyDistances={setWeeklyDistances}
      />
    </>
  );
}
