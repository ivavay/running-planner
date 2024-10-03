import styled from "styled-components";

export default function Event({ title, goalReached }) {
  return (
    <EventBlock>
      <div>{title}</div>
      <EventGoalSubtext>
        {goalReached ? " Goal hit ✅" : " ❌ Oof, did not reach goal"}
      </EventGoalSubtext>
    </EventBlock>
  );
}

const EventBlock = styled.div`
  background-color: lightblue;
  padding: 4px;
  font-weight: 500;
  border-radius: 5px;
`;
const EventGoalSubtext = styled.div`
  font-size: 10px;
  color: grey;
`;
