import styled from "styled-components";
import { useState, useEffect } from "react";
import { saveProgramLength } from "../../../api";
import { getProgramLength } from "../../../api";
import { saveRaceInfo, getRaceInfo } from "../../../api";
import { Stepper, Step, StepLabel, Button, Typography } from "@mui/material";
import { set } from "date-fns";

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
  handleCreateProgram,
  programCreated,
  setProgramCreated,
}) {
  const [programDates, setProgramDates] = useState({
    start_date: "",
    end_date: "",
  });

  const steps = ["Step 1 - Race Info", "Step 2 - Training Program Length"];

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

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

  function getStepContent(step) {
    switch (step) {
      case 0: {
        return (
          <RaceInfo>
            <RaceLabel>Race Name </RaceLabel>
            <RaceTitle
              placeholder="e.g. Tapei Half Marathon"
              value={raceName}
              onChange={(e) => setRaceName(e.target.value)}
            />
            <RaceLabel>Race Date </RaceLabel>
            <RaceDate
              type="date"
              min={today}
              value={raceDate}
              onChange={(e) => setRaceDate(e.target.value)}
            />
            <RaceLabel>Race Time Goal</RaceLabel>
            <RaceGoal
              placeholder="e.g. 2:30"
              value={raceGoal}
              onChange={(e) => setRaceGoal(e.target.value)}
            />
            <SetButton onClick={handleSaveRaceInfo}>Save race info</SetButton>
          </RaceInfo>
        );
      }
      case 1: {
        return (
          <>
            <ProgramInfo>
              <ProgramLengthLabel>Training Program Length </ProgramLengthLabel>
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
            <ProgramWeeksTotal>
              {`Total weeks for training program: ` + programLength}
            </ProgramWeeksTotal>
            <ProgramDates>
              <p>
                <strong>Training Program Dates</strong>
              </p>
              <p>Start Date: {programStartDate}</p>
              <p>End Date: {programEndDate}</p>
            </ProgramDates>
          </>
        );
      }
    }
  }
  console.log("handleCreateProgram:", handleCreateProgram);
  return (
    <>
      {programCreated && (
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel
                sx={{
                  "& .MuiStepLabel-label": {
                    color: activeStep === index ? "#333" : "gray",
                  },
                  "& .MuiStepIcon-root": {
                    color: activeStep === index ? "black" : "gray",
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      )}
      {activeStep === steps.length ? (
        <div>
          <Typography>All steps completed</Typography>
          <Button onClick={handleReset}>Reset</Button>
        </div>
      ) : (
        <div>
          {programCreated && getStepContent(activeStep)}
          {programCreated && (
            <>
              <Button
                disabled={activeStep === 0}
                sx={{ color: "grey", marginTop: "16px" }}
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#333",
                  color: "white",
                  marginTop: "16px",
                }}
                onClick={handleNext}
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>{" "}
            </>
          )}
        </div>
      )}

      {raceInfo && (
        <SavedRaceInfo>
          <p>
            <i>Saved Race Info:</i>
          </p>
          <p>Name: {raceInfo.race_name}</p>
          <p>Date: {raceInfo.race_date}</p>
          <p>Goal: {raceInfo.race_goal}</p>
        </SavedRaceInfo>
      )}

      {
        // If program length is not NaN, display the program length and dates. If NaN, display nothing
        !isNaN(programLength) && programLength > 0 && (
          <>
            <ProgramWeeksTotal>
              {`Total weeks for training program: ` + programLength}
            </ProgramWeeksTotal>
            <ProgramDates>
              <p>
                <strong>Training Program Dates</strong>
              </p>
              <p>Start Date: {programStartDate}</p>
              <p>End Date: {programEndDate}</p>
            </ProgramDates>
          </>
        )
      }
    </>
  );
}

const RaceInfo = styled.div`
  display: flex;
`;
const RaceDate = styled.input`
  border: 1px solid #ccc;
  padding: 4px;
  border-radius: 4px;
  margin-right: 8px;
`;
const RaceGoal = styled.input`
  border: 1px solid #ccc;
  padding: 4px;
  border-radius: 4px;
  margin-right: 8px;
`;
const SetButton = styled.button`
  background-color: #333;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
`;
const RaceLabel = styled.label`
  margin-right: 8px;
`;
const RaceTitle = styled.input`
  border: 1px solid #ccc;
  padding: 4px;
  border-radius: 4px;
  margin-right: 8px;
`;
const ProgramInfo = styled.div`
  margin-top: 16px;
`;

const ProgramStart = styled.input`
  border: 1px solid #ccc;
  padding: 4px;
  border-radius: 4px;
  margin-right: 8px;
`;
const ProgramEnd = styled.input`
  border: 1px solid #ccc;
  padding: 4px;
  border-radius: 4px;
  margin-right: 8px;
`;
const ProgramLengthLabel = styled.label``;
const ProgramWeeksTotal = styled.div`
  font-weight: 500;
  margin-top: 16px;
  width: fit-content;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 8px 16px;
`;
const SavedRaceInfo = styled.div`
  margin-top: 16px;
`;
const ProgramDates = styled.div`
  margin-top: 16px;
`;
