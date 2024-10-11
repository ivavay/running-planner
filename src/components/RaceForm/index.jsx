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
  programs,
}) {
  const [programDates, setProgramDates] = useState({
    start_date: "",
    end_date: "",
  });

  const steps = ["Step 1 - Race Info", "Step 2 - Training Program Length"];
  const [edit, setEdit] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    // If it is the last step, set edit to false
    if (activeStep === steps.length - 1) {
      setEdit(false);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    // If it is the last step, set edit to false
    if (activeStep === steps.length - 1) {
      setEdit(false);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setEdit(true);
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
          </>
        );
      }
    }
  }
  console.log("handleCreateProgram:", handleCreateProgram);
  return (
    <>
      {(edit || programCreated) && (
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel
                sx={{
                  "& .MuiStepLabel-label": {
                    color: activeStep === index ? "#333" : "gray",
                  },
                  "& .MuiStepIcon-root": {
                    color: activeStep === index ? "#333" : "gray",
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      )}
      {activeProgramId && (
        <div>
          {programLength > 0 && (
            <Button
              sx={{
                backgroundColor: "#333",
                color: "white",
                marginTop: "16px",
              }}
              onClick={handleReset}
            >
              Edit
            </Button>
          )}
          {edit && getStepContent(activeStep)}
          {edit && (
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
      <Container>
        {raceInfo && (
          <SavedRaceInfo>
            <p>
              <strong>Race Info</strong>
            </p>
            <br></br>
            <p>Name: {raceInfo.race_name}</p>
            <p>Date: {raceInfo.race_date}</p>
            <p>Time Goal: {raceInfo.race_goal} hours</p>
          </SavedRaceInfo>
        )}

        {
          // If program length is not NaN, display the program length and dates. If NaN, display nothing
          !isNaN(programLength) && programLength > 0 && (
            <>
              <ProgramWeeksTotal>
                Total weeks for training program{" "}
                <TotalWeeks>{programLength}</TotalWeeks>
              </ProgramWeeksTotal>
              <ProgramDates>
                <p>
                  <strong>Training Program Schedule</strong>
                </p>
                <br></br>
                <p>Start Date: {programStartDate}</p>
                <p>End Date: {programEndDate}</p>
              </ProgramDates>
            </>
          )
        }
      </Container>
    </>
  );
}
const TotalWeeks = styled.h3`
  color: #333;
  font-size: 72px;
  font-weight: 700;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Container = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const RaceInfo = styled.div`
  display: flex;
  margin-top: 24px;
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
  box-shadow: 0 0 5px rgba(89, 97, 216, 0.3);
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 8px 16px;
  width: 25%;
  height: 150px;
`;
const SavedRaceInfo = styled.div`
  font-weight: 500;
  margin-top: 16px;
  box-shadow: 0 0 5px rgba(89, 97, 216, 0.3);
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  width: 25%;
  height: 150px;
`;
const ProgramDates = styled.div`
  margin-top: 16px;
  font-weight: 500;
  width: 25%;
  height: 150px;
  box-shadow: 0 0 5px rgba(89, 97, 216, 0.3);
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
`;
