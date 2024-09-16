import styled from "styled-components";

export default function Event() {
  return (
    <EventBlock>
      <span>Event: A fun run!</span>
    </EventBlock>
  );
}

const EventBlock = styled.div`
  background-color: lightblue;
  padding: 4px;
  font-weight: 500;
  border-radius: 5px;
`;
