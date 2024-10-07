import { Link } from "react-router-dom";
import styled from "styled-components";

export default function Header() {
  return (
    <Navbar>
      <Link to="/">
        <h3>Running Planner</h3>
      </Link>
      <Navlinks>
        <NavItem>
          <Link to="/activities">Activities</Link>
        </NavItem>
        <NavItem>
          <Link to="/recap">Recap</Link>
        </NavItem>
      </Navlinks>
    </Navbar>
  );
}
const Navbar = styled.nav`
  padding: 40px 24px;
  display: flex;
  justify-content: space-between;
  margin-right: 16px;
  align-items: center;
`;
const Navlinks = styled.div`
  display: flex;
  justify-content: end;
`;
const NavItem = styled.div`
  margin-right: 24px;
`;
