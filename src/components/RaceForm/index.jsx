import { Button, Step, StepLabel, Stepper } from "@mui/material";
import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  getProgramLength,
  getRaceInfo,
  saveProgramLength,
  saveRaceInfo,
} from "../../services/api";

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
  setConfirmDeleteModal,
}) {
  const [programDates, setProgramDates] = useState({
    start_date: "",
    end_date: "",
  });

  const steps = ["Step 1 - Race Info", "Step 2 - Training Program Length"];
  const [edit, setEdit] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const today = new Date().toISOString().split("T")[0];

  function handleNext() {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if (activeStep === steps.length - 1) {
      setProgramCreated(false);
      setEdit(false);
    }
  }

  function handleBack() {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }

  function handleEdit() {
    setActiveStep(0);
    setEdit(true);
  }

  async function handleSaveRaceInfo() {
    if (activeProgramId) {
      await saveRaceInfo(raceName, raceDate, raceGoal, activeProgramId);
      setRaceInfo({
        race_name: raceName,
        race_date: raceDate,
        race_goal: raceGoal,
      });
    }
  }

  function handleProgramStartChange(event) {
    setProgramStartDate(event.target.value);
  }

  function handleProgramEndChange(event) {
    setProgramEndDate(event.target.value);
  }

  function calculateProgramWeeks() {
    const start_date = new Date(programStartDate);
    const end_date = new Date(programEndDate);

    const timeDifference = end_date - start_date;
    const dayDifference = timeDifference / (1000 * 60 * 60 * 24);
    const weeks = Math.floor(dayDifference / 7);

    setProgramLength(weeks);
  }

  function openDeleteModal() {
    setConfirmDeleteModal(true);
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
            </ProgramInfo>
          </>
        );
      }
    }
  }

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

  // Use active program ID from local storage to fetch program dates
  useEffect(() => {
    async function fetchProgramDates() {
      if (activeProgramId) {
        const dates = await getProgramLength(activeProgramId);

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
            <>
              <Button
                sx={{
                  backgroundColor: "#333",
                  color: "white",
                  marginTop: "16px",
                }}
                onClick={handleEdit}
              >
                Edit
              </Button>
              {""}
              <Button
                sx={{
                  backgroundColor: "#ee5c5c",
                  color: "white",
                  marginTop: "16px",
                  marginLeft: "16px",
                }}
                onClick={openDeleteModal}
              >
                Delete program
              </Button>
            </>
          )}
          {(edit || programCreated) && getStepContent(activeStep)}
          {(edit || programCreated) && (
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
  @media (max-width: 768px) {
    flex-direction: column;
  }
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
  @media (max-width: 768px) {
    width: 100%;
  }
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
  @media (max-width: 768px) {
    width: 100%;
  }
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
  @media (max-width: 768px) {
    width: 100%;
  }
`;
