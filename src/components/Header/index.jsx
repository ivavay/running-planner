import { Link } from "react-router-dom";
import styled from "styled-components";
import { collection, addDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  fireDb,
  fireAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "../../firebase";

export default function Header() {
  const dynamicURL = window.location.href;
  console.log("Dynamic URL:", dynamicURL);
  const [user, setUser] = useState(null);
  useEffect(() => {
    console.log("useEffect running");
    // Check if user is logged in, if so, set user state
    const unsubscribe = fireAuth.onAuthStateChanged(async (user) => {
      console.log(user.uid);
      if (user) {
        setUser(user); // User is logged in
      } else {
        setUser(null); // No user is logged in
      }
    });

    return () => unsubscribe();
  }, []);

  function handleSignIn() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(fireAuth, provider)
      .then((result) => {
        // Handle successful sign-in
        console.log("User signed in:", result.user.displayName);
        // Redirect to Strava OAuth page
        const stravaOauthURL = `https://www.strava.com/oauth/authorize?client_id=134373&response_type=code&redirect_uri=${dynamicURL}authorize&scope=read,activity:read&approval_prompt=force`;
        window.location.href = stravaOauthURL;
        // Check if user exists in database. If not, then add user to firestore
        return addDoc(collection(fireDb, "users"), {
          name: result.user.displayName,
          email: result.user.email,
        });
      })

      .catch((error) => {
        // Handle errors
        console.error("Error signing in:", error);
      });
  }

  function handleSignOut() {
    signOut(fireAuth)
      .then(() => {
        console.log("User signed out");
        setUser(null);
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  }

  // Is user currently signed in
  console.log("User:", user);

  return (
    <Navbar>
      <NavLink to="/">
        <Logo>Running Planner</Logo>
      </NavLink>
      <Navlinks>
        <NavItem>
          <NavLink to="/activities">Activities</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/recap">Recap</NavLink>
        </NavItem>
        {user ? (
          <NavItem onClick={handleSignOut}>Log Out</NavItem>
        ) : (
          <NavItem onClick={handleSignIn}>Log in</NavItem>
        )}
      </Navlinks>
    </Navbar>
  );
}
const NavLink = styled(Link)`
  text-decoration: none;
  color: #333;
`;

const Navbar = styled.nav`
  padding: 24px 0;
  display: flex;
  justify-content: space-between;
  margin-right: 16px;
  align-items: center;
  border-bottom: 1px solid #eaeaea;
`;
const Navlinks = styled.div`
  display: flex;
  justify-content: end;
`;
const NavItem = styled.div`
  margin-right: 24px;
  text-decoration: none;
  color: #333;
`;
const Logo = styled.h3`
  font-weight: 700;
  color: #333;
`;
