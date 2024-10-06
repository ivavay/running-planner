import styled from "styled-components";
import { useState, useEffect } from "react";
import { saveProgramLength } from "../../../api";
import { getProgramLength } from "../../../api";
import { saveRaceInfo, getRaceInfo } from "../../../api";
export default function RaceForm({
  programLength,
  setProgramLength,
  programStartDate,
  setProgramStartDate,
  programEndDate,
  setProgramEndDate,
  user,
  activeProgramId,
  setRaceDate,
  setRaceGoal,
  setRaceName,
  setRaceInfo,
  raceInfo,
  raceName,
  raceDate,
  raceGoal,
}) {
  const [programDates, setProgramDates] = useState({
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    async function fetchRaceInfo() {
      if (activeProgramId) {
        const info = await getRaceInfo(activeProgramId);
        if (info) {
          setRaceInfo(info.race);
          setRaceName(info.race.race_name);
          setRaceDate(info.race.race_date);
          setRaceGoal(info.race.race_goal);
        }
      }
    }

    fetchRaceInfo();
  }, [activeProgramId]);

  const handleSaveRaceInfo = async () => {
    if (activeProgramId) {
      await saveRaceInfo(raceName, raceDate, raceGoal, activeProgramId);
      setRaceInfo({
        race_name: raceName,
        race_date: raceDate,
        race_goal: raceGoal,
      });
    }
  };

  // Render the race name button upon setting race info
  useEffect(() => {
    console.log("Race Info Set:", raceInfo);
  }, [raceInfo]);

  const today = new Date().toISOString().split("T")[0];

  // Use active program ID from local storage to fetch program dates
  console.log("Active program ID: ", activeProgramId);
  useEffect(() => {
    async function fetchProgramDates() {
      if (activeProgramId) {
        const dates = await getProgramLength(activeProgramId);
        console.log("Dates: ", dates);
        if (dates) {
          setProgramDates(dates);
          setProgramStartDate(dates.start_date);
          setProgramEndDate(dates.end_date);
        }
      }
    }

    fetchProgramDates();
  }, [activeProgramId, setProgramDates]);

  useEffect(() => {
    if (activeProgramId) {
      if (programStartDate && programEndDate) {
        saveProgramLength(activeProgramId, programStartDate, programEndDate);
      }
    }
  }, [programStartDate, programEndDate]);

  useEffect(() => {
    calculateProgramWeeks();
  }, [programStartDate, programEndDate]);

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
        <RaceTitle
          placeholder="e.g. Tapei Half Marathon"
          value={raceName}
          onChange={(e) => setRaceName(e.target.value)}
        />
        <RaceDate
          type="date"
          min={today}
          value={raceDate}
          onChange={(e) => setRaceDate(e.target.value)}
        />
        <RaceGoal
          placeholder="e.g. 2:30"
          value={raceGoal}
          onChange={(e) => setRaceGoal(e.target.value)}
        />
        <SetButton onClick={handleSaveRaceInfo}>Save race info</SetButton>
      </RaceInfo>
      {raceInfo && (
        <div>
          <h3>Saved Race Info:</h3>
          <p>Name: {raceInfo.race_name}</p>
          <p>Date: {raceInfo.race_date}</p>
          <p>Goal: {raceInfo.race_goal}</p>
        </div>
      )}
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
      <p>Start Date: {programStartDate}</p>
      <p>End Date: {programEndDate}</p>
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
