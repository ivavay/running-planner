import { useState, useEffect } from "react";
import styled from "styled-components";

export default function WeeklyDistance({ programLength }) {
  const [weeklyDistances, setWeeklyDistances] = useState([]);
  const [currentDistance, setCurrentDistance] = useState("");

  function addWeeklyDistance() {
    let distance = parseInt(currentDistance);
    setWeeklyDistances([...weeklyDistances, distance]);
    setCurrentDistance("");
  }
  // Convert programLength to an array of weeks
  let weeksTotal = Array.from({ length: programLength }, (_, i) => i + 1);

  useEffect(() => {
    console.log("Updated Weekly Distances:", weeklyDistances);
  }, [weeklyDistances]);

  return (
    <>
      <h2>Weekly Distance</h2>
      <WeeklyDistanceContainer>
        <WeeklyDropdown>
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

const WeeklyDistanceContainer = styled.div``;
const WeeklyDropdown = styled.select``;
const WeekOption = styled.option``;
const WeeklyDistanceInput = styled.input``;
const WeeklyDistanceButtoon = styled.button``;
const DistancesContainer = styled.div``;
const Distance = styled.div``;
