import { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchWeeklyDistances, saveWeeklyDistances } from "../../services/api";

export default function WeeklyDistance({
  programLength,
  setWeeklyDistances,
  weeklyDistances,
  user,
  activeProgramId,
}) {
  const [currentDistance, setCurrentDistance] = useState("");
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [validationError, setValidationError] = useState("");

  // Convert programLength to an array of weeks
  let weeksTotal = Array.from({ length: programLength }, (_, i) => i + 1);

  function addWeeklyDistance() {
    let distance = parseInt(currentDistance);
    const updatedDistances = [...weeklyDistances];

    // Check if the distance for the selected week already exists
    if (updatedDistances[selectedWeek - 1] !== undefined) {
      updatedDistances[selectedWeek - 1] = distance;
    } else {
      updatedDistances[selectedWeek - 1] = distance;
    }

    // If the distance is not a number, set an error message
    if (isNaN(distance)) {
      setValidationError("Please enter a number for the distance");
    } else {
      setValidationError("");
    }

    setWeeklyDistances(updatedDistances);
    setCurrentDistance("");
    saveWeeklyDistances(updatedDistances, activeProgramId);
  }

  useEffect(() => {
    async function loadWeeklyDistances() {
      if (activeProgramId) {
        const distances = await fetchWeeklyDistances(activeProgramId);
        setWeeklyDistances(distances);
      }
    }

    loadWeeklyDistances();
  }, [activeProgramId, setWeeklyDistances]);

  return (
    <>
      {!isNaN(programLength) && programLength > 0 && (
        <>
          <WeeklyDistanceContainer>
            <p>
              <strong>Set Weekly Distance Goals</strong>
            </p>
            <WeeklyDropdown
              value={selectedWeek}
              onChange={(event) =>
                setSelectedWeek(parseInt(event.target.value))
              }
            >
              {weeksTotal.map((week, index) => (
                <WeekOption key={index} value={week}>
                  Week {week}
                </WeekOption>
              ))}
            </WeeklyDropdown>
            <WeeklyDistanceInput
              value={currentDistance}
              onChange={(event) => setCurrentDistance(event.target.value)}
            ></WeeklyDistanceInput>
            <WeeklyDistanceButtoon onClick={addWeeklyDistance}>
              Set
            </WeeklyDistanceButtoon>
            {validationError && (
              <p style={{ color: "red", fontSize: "12px", margin: "4px 0" }}>
                {validationError}
              </p>
            )}
          </WeeklyDistanceContainer>
          <DistancesContainer>
            {weeklyDistances.map((distance, index) => (
              <Distance key={index}>
                Week {index + 1} Goal: {distance} km
              </Distance>
            ))}
          </DistancesContainer>
        </>
      )}
    </>
  );
}

const WeeklyDistanceContainer = styled.div`
  margin-top: 24px;
`;
const WeeklyDropdown = styled.select`
  margin-top: 8px;
  padding: 4px;
  border: 1px solid #ccc;
  margin-right: 8px;
`;
const WeekOption = styled.option`
  padding: 4px;
`;
const WeeklyDistanceInput = styled.input`
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 8px;
`;
const WeeklyDistanceButtoon = styled.button`
  background-color: #333;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
`;
const DistancesContainer = styled.div`
  margin-top: 16px;
`;
const Distance = styled.div``;
