import { useEffect, useState, useRef } from "react";
import { fetchData } from "../../../api";
import polyline from "@mapbox/polyline";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import styled from "styled-components";
import placeholder from "../../assets/placeholder.png";

export default function Activities() {
  const [data, setData] = useState([]);
  const [mapURLs, setMapURLs] = useState([]);

  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  // Fetch the activities data from the API using await / async
  // Only set the data state if the fetch is successful
  // Display the activities data on a map only after data is fetched
  // Fetch the activities data from the API using await / async
  useEffect(() => {
    const fetchActivitiesData = async () => {
      try {
        const fetchedData = await fetchData();
        setData(fetchedData);
        console.log("Fetched Data: ", fetchedData);
        // Map the strava acitvity data summary_polyline to a map image
        // Use polyline directly, no need to decode the polyline
        const mapURLs = fetchedData.map(
          (activity) =>
            `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/path-2+266fdd-1(${encodeURIComponent(
              activity.map.summary_polyline
            )})/auto/300x200?access_token=${
              import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
            }`
        );
        setMapURLs(mapURLs);
        console.log("Map URLs: ", mapURLs);
      } catch (error) {
        console.error("Error fetching data: ", error);
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
`;
