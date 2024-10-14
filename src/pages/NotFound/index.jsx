import styled from "styled-components";
export default function NotFound() {
  return (
    <NotFoundContainer>
      <h1>404 - Page Not Found</h1>
    </NotFoundContainer>
  );
}

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 90vh;
  color: #333;
`;
