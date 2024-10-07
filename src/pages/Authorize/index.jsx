import { useEffect, useState } from "react";

const client_id = import.meta.env.VITE_STRAVA_CLIENT_ID;
const client_secret = import.meta.env.VITE_STRAVA_CLIENT_SECRET;

export default function Authorize() {
  const [refreshToken, setRefreshToken] = useState(null);
  // 2nd Checkpoint: You should be able to get the latter portion of the url where it's the authorization code
  // Your console.log should print out the authorization code which is after the "=" sign and before the '&' sign
  const strava_code = window.location.search.split("=")[2].split("&")[0];
  console.log("Authorization code:", strava_code);

  // 3rd Checkpoint: You can use a useEffect to use the authorization code to get the access token and refresh token
  // And then store then in either local storage preferably
  useEffect(() => {
    const exchangeAuthorizationCode = async () => {
      try {
        const requestBody = {
          client_id: client_id,
          client_secret: client_secret,
          code: strava_code,
          grant_type: "authorization_code",
        };

        const response = await fetch("https://www.strava.com/oauth/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error("Failed to exchange authorization code");
        }

        const data = await response.json();
        console.log("Data:", data);
        setRefreshToken(data.refresh_token); // Save the refresh token
      } catch (error) {
        console.error("Failed to exchange authorization code:", error);
      }
    };

    if (strava_code) {
      exchangeAuthorizationCode();
    }
  }, [strava_code]);

  console.log("Refresh Token:", refreshToken);
  localStorage.setItem("strava_refresh_token", refreshToken);

  return (
    <div>
      <h1>Authorize</h1>
    </div>
  );
}
