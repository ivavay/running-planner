import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useState } from "react";
import styled from "styled-components";
import placeholder from "../../assets/placeholder.png";
import { fetchData } from "../../services/api";

export default function Activities() {
  const [data, setData] = useState([]);
  const [mapURLs, setMapURLs] = useState([]);

  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  useEffect(() => {
    const fetchActivitiesData = async () => {
      try {
        const fetchedData = await fetchData();
        setData(fetchedData);
        const mapURLs = fetchedData.map(
          (activity) =>
            `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/path-2+266fdd-1(${encodeURIComponent(
              activity.map.summary_polyline
            )})/auto/300x200?access_token=${
              import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
            }`
        );
        setMapURLs(mapURLs);
      } catch (error) {
        console.error(error);
      }
    };

    fetchActivitiesData();
  }, []);

  return (
    <>
      <div>
        <CardGrid>
          {data.map((activity, index) => {
            const pacePerKm =
              activity.moving_time / 60 / (activity.distance / 1000);

            // Extract minutes and seconds
            const paceMinutes = Math.floor(pacePerKm);
            const paceSeconds = Math.round((pacePerKm - paceMinutes) * 60);

            // Ensure seconds are two digits (e.g., 5 becomes 05)
            const formattedPace = `${paceMinutes}:${paceSeconds
              .toString()
              .padStart(2, "0")}`;

            // If activity moving time is over an hour, then convert to hour and minutes, otherwise, just show minutes
            let movingTime = activity.moving_time;
            if (movingTime > 3600) {
              const hours = Math.floor(movingTime / 3600);
              const minutes = Math.floor((movingTime % 3600) / 60);
              movingTime = `${hours}h ${minutes}m`;
            } else {
              const minutes = Math.floor(movingTime / 60);
              movingTime = `${minutes}m`;
            }
            return (
              <>
                <div>
                  <Card>
                    <div key={index}>
                      <CardTitle>
                        {new Date(
                          activity.start_date_local
                        ).toLocaleDateString()}{" "}
                        -{activity.name}
                      </CardTitle>
                      <ActivityDetails>
                        <p>{formattedPace} / km</p>
                        <p>{(activity.distance / 1000).toFixed(2)} km</p>
                        <p>{movingTime}</p>
                      </ActivityDetails>
                      <img
                        src={mapURLs[index]}
                        alt={activity.name}
                        onError={(e) => {
                          e.target.src = placeholder; // Set the placeholder image on error
                        }}
                        style={{
                          objectFit: "contain",
                          width: "300px",
                        }}
                      />
                      <StravaLink
                        onTarget="_blank"
                        href={`https://www.strava.com/activities/${activity.map.id
                          .split("a")
                          .filter(Boolean)}`}
                      >
                        See activity on Strava
                      </StravaLink>
                    </div>
                  </Card>
                </div>
              </>
            );
          })}
        </CardGrid>
      </div>
    </>
  );
}

const StravaLink = styled.a`
  color: #fc4c02;
  text-decoration: none;
  font-weight: 700;
  border-bottom: 3px solid #fc4c02;
  font-size: 10px;
  margin-top: 8px;
  display: inline-block;
`;
const ActivityDetails = styled.div`
  display: flex;
  margin: 16px 0;
  justify-content: space-between;
`;
const Card = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px;
  width: 300px;
  height: fit-content;
  border-radius: 4px;
`;
const CardTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  color: #333;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
`;
