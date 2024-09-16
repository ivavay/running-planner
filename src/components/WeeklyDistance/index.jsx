import styled from "styled-components";

export default function WeeklyDistance({ programLength }) {
  console.log(programLength);
  let weeksTotal = Array.from(String(programLength), Number);
  console.log(weeksTotal);
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
        <WeeklyDistanceInput></WeeklyDistanceInput>
        <WeeklyDistanceButtoon>Set</WeeklyDistanceButtoon>
      </WeeklyDistanceContainer>
    </>
  );
}

const WeeklyDistanceContainer = styled.div``;
const WeeklyDropdown = styled.select``;
const WeekOption = styled.option``;
const WeeklyDistanceInput = styled.input``;
const WeeklyDistanceButtoon = styled.button``;
