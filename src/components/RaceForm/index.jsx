import styled from "styled-components";
import { useState, useEffect } from "react";
import { saveProgramLength } from "../../../api";
import { getProgramLength } from "../../../api";
export default function RaceForm({
  programLength,
  setProgramLength,
  programStartDate,
  setProgramStartDate,
  programEndDate,
  setProgramEndDate,
  user,
}) {
  const [raceDate, setRaceDate] = useState("");
  const [programDates, setProgramDates] = useState({
    start_date: "",
    end_date: "",
  });

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    async function fetchProgramDates() {
      if (user && user.uid) {
        const dates = await getProgramLength(user.uid);
        if (dates) {
          setProgramDates(dates);
        }
      }
    }

    fetchProgramDates();
  }, [user, setProgramDates]);

  useEffect(() => {
    if (user && user.uid) {
      if (programStartDate && programEndDate) {
        saveProgramLength(user.uid, programStartDate, programEndDate);
      }
    }
  }, [programStartDate, programEndDate, user]);

  function handleProgramStartChange(event) {
    setProgramStartDate(event.target.value);
    console.log("Start " + programStartDate);
  }

  function handleProgramEndChange(event) {
    setProgramEndDate(event.target.value);
    console.log("End " + programEndDate);
  }

  function calculateProgramWeeks() {
    const start_date = new Date(programStartDate);
    const end_date = new Date(programEndDate);

    console.log(start_date, end_date);

    // Cannot pick start date before today and end date has to be after start date
    if (start_date > end_date) {
      alert("Start date must be before end date");
      return;
    }
    const timeDifference = end_date - start_date;

    const dayDifference = timeDifference / (1000 * 60 * 60 * 24);
    console.log(dayDifference);
    // Difference between dates in weeks
    const weeks = Math.floor(dayDifference / 7);
    console.log(weeks);
    setProgramLength(weeks);
  }

  function handleRaceDateChange(event) {
    setRaceDate(event.target.value);
    console.log("Race date " + raceDate);
  }

  return (
    <>
      <RaceInfo>
        <RaceLabel>Race </RaceLabel>
        <RaceTitle placeholder="e.g. Tapei Half Marathon" />
        <RaceDate
          type="date"
          min={today}
          value={raceDate}
          onChange={handleRaceDateChange}
        />
        <RaceGoal placeholder="e.g. 2:30" />
        <SetButton>Set</SetButton>
      </RaceInfo>
      <ProgramInfo>
        <ProgramLengthLabel>Program length </ProgramLengthLabel>
        <ProgramStart
          type="date"
          value={programStartDate}
          onChange={handleProgramStartChange}
        ></ProgramStart>
        <ProgramEnd
          type="date"
          value={programEndDate}
          onChange={handleProgramEndChange}
        ></ProgramEnd>
        <SetButton onClick={calculateProgramWeeks}>Set</SetButton>
      </ProgramInfo>
      <ProgramWeeksTotal>{`Total weeks: ` + programLength}</ProgramWeeksTotal>
      <h2>Program Dates</h2>
      <p>Start Date: {programDates.start_date}</p>
      <p>End Date: {programDates.end_date}</p>
    </>
  );
}

const RaceInfo = styled.div``;
const RaceDate = styled.input``;
const RaceGoal = styled.input``;
const SetButton = styled.button``;
const RaceLabel = styled.label``;
const RaceTitle = styled.input``;
const ProgramInfo = styled.div``;
const ProgramStart = styled.input``;
const ProgramEnd = styled.input``;
const ProgramLengthLabel = styled.label``;
const ProgramWeeksTotal = styled.div``;
