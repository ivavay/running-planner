import { useState, useEffect } from "react";
import styled from "styled-components";
import { saveWeeklyDistances, fetchWeeklyDistances } from "../../../api";

export default function WeeklyDistance({
  programLength,
  setWeeklyDistances,
  weeklyDistances,
  user,
  activeProgramId,
}) {
  const [currentDistance, setCurrentDistance] = useState("");
  const [selectedWeek, setSelectedWeek] = useState(1);

  useEffect(() => {
    async function loadWeeklyDistances() {
      if (activeProgramId) {
        const distances = await fetchWeeklyDistances(activeProgramId);
        setWeeklyDistances(distances);
      }
    }

    loadWeeklyDistances();
  }, [activeProgramId, setWeeklyDistances]);

  function addWeeklyDistance() {
    let distance = parseInt(currentDistance);
    const updatedDistances = [...weeklyDistances];

    // Check if the distance for the selected week already exists
    if (updatedDistances[selectedWeek - 1] !== undefined) {
      updatedDistances[selectedWeek - 1] = distance;
    } else {
      updatedDistances[selectedWeek - 1] = distance;
    }

    setWeeklyDistances(updatedDistances);
    setCurrentDistance("");
    saveWeeklyDistances(updatedDistances, activeProgramId);
  }
  // Convert programLength to an array of weeks
  let weeksTotal = Array.from({ length: programLength }, (_, i) => i + 1);

  useEffect(() => {
    console.log("Updated Weekly Distances:", weeklyDistances);
  }, [weeklyDistances]);

  return (
    <>
      <WeeklyDistanceContainer>
        <p>
          <strong>Set Weekly Distance Goals</strong>
        </p>
        <WeeklyDropdown
          value={selectedWeek}
          onChange={(event) => setSelectedWeek(parseInt(event.target.value))}
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
      </WeeklyDistanceContainer>
      <DistancesContainer>
        {weeklyDistances.map((distance, index) => (
          <Distance key={index}>
            Week {index + 1} Goal: {distance} km
          </Distance>
        ))}
      </DistancesContainer>
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
