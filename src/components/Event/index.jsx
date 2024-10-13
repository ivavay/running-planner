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
  background-color: #c6cdff;
  box-shadow: 0 0 5px rgba(89, 97, 216, 0.1);
  padding: 4px;
  font-weight: 500;
  border-radius: 5px;
  color: #333333;
  font-weight: 700;
`;
const EventGoalSubtext = styled.div`
  font-size: 10px;
  color: #202020;
  font-weight: 400;
`;
