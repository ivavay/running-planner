import { Link } from "react-router-dom";
import styled from "styled-components";
import { collection, addDoc, where, query, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  fireDb,
  fireAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "../../firebase";
import StravaConnect from "../../assets/strava_connect.png";

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

  async function handleSignIn() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(fireAuth, provider);
      const user = result.user;

      // Handle successful sign-in
      console.log("User signed in:", result.user.displayName);

      // Check if user exists in database. If not, then add user to firestore
      const userQuery = query(
        collection(fireDb, "users"),
        where("email", "==", user.email)
      );
      const querySnapshot = await getDocs(userQuery);

      if (querySnapshot.empty) {
        // User does not exist, add to Firestore
        await addDoc(collection(fireDb, "users"), {
          name: user.displayName,
          email: user.email,
        });
      } else {
        console.log("User already exists in database, therefore not added");
      }
    } catch (error) {
      // Handle errors
      console.error("Error signing in:", error);
    }
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

  // Redirect to Strava OAuth page
  function redirectToStravaOauth() {
    const stravaOauthURL = `https://www.strava.com/oauth/authorize?client_id=134373&response_type=code&redirect_uri=${dynamicURL}authorize&scope=read,activity:read&approval_prompt=force`;
    window.location.href = stravaOauthURL;
  }

  return (
    <Navbar>
      <NavLink to="/">
        <Logo>Running Planner</Logo>
      </NavLink>
      <Navlinks>
        {user ? (
          <>
            <NavItem>
              <NavLink to="/activities">Activities</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/recap">Recap</NavLink>
            </NavItem>
          </>
        ) : null}
        {user ? (
          <>
            <NavItem onClick={handleSignOut}>Log Out</NavItem>
            <NavItem>
              <StravaButton onClick={redirectToStravaOauth}>
                <StravaImg src={StravaConnect}></StravaImg>
              </StravaButton>
            </NavItem>
          </>
        ) : (
          <NavItem onClick={handleSignIn}>Log in</NavItem>
        )}
      </Navlinks>
    </Navbar>
  );
}

const StravaImg = styled.img`
  height: 48px;
`;
const StravaButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;
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
  align-items: center;
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
