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
  background-color: #266fdd;
  box-shadow: 0 0 5px rgba(89, 97, 216, 0.1);
  padding: 4px;
  font-weight: 500;
  border-radius: 5px;
  color: white;
`;
const EventGoalSubtext = styled.div`
  font-size: 10px;
  color: white;
`;
