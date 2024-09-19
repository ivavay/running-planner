import styled from "styled-components";
export function ProgressBar() {
  return (
    <ProgressBarBlock>
      <ProgressBarFill />
    </ProgressBarBlock>
  );
}

const ProgressBarBlock = styled.div`
  width: 100%;
  height: 20px;
  border: 1px solid #ccc;
`;
const ProgressBarFill = styled.div`
  background-color: lightblue;
  width: 1%;
  height: 100%;
`;
