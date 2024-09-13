import styled from "styled-components";

export default function Home() {
  return (
    <>
      <h1>Home Page: Current program</h1>
      <RaceInfo>
        <RaceLabel>Race </RaceLabel>
        <RaceTitle placeholder="e.g. Taiepi Half Marathon" />
        <RaceDate type="date" />
        <RaceGoal placeholder="e.g. 2:30" />
        <SetButton>Set</SetButton>
      </RaceInfo>
      <ProgramInfo>
        <ProgramLengthLabel>Program length </ProgramLengthLabel>
        <ProgramStart type="date"></ProgramStart>
        <ProgramEnd type="date"></ProgramEnd>
        <SetButton>Set</SetButton>
      </ProgramInfo>
    </>
  );
}

const RaceInfo = styled.div``;

const RaceDate = styled.input``;
const RaceGoal = styled.input``;
const SetButton = styled.button``;
const RaceLabel = styled.label``;
const RaceTitle = styled.input``;
const ProgramInfo = styled.div``;
const ProgramStart = styled.input``;
const ProgramEnd = styled.input``;
const ProgramLengthLabel = styled.label``;
