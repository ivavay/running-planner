import Calendar from "../../components/Calendar";
import RaceForm from "../../components/RaceForm";
import WeeklyDistance from "../../components/WeeklyDistance";
import { useState } from "react";
export default function Home() {
  const [programLength, setProgramLength] = useState(0);
  return (
    <>
      <h1>Home Page: Current program</h1>
      <RaceForm
        programLength={programLength}
        setProgramLength={setProgramLength}
      />
      <WeeklyDistance programLength={programLength} />
      <Calendar />
    </>
  );
}
