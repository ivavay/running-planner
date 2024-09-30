import { useEffect, useState, useRef } from "react";
import { fetchData } from "../../../api";
import polyline from "@mapbox/polyline";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import styled from "styled-components";

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
            `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/path-2+0000FF-1(${encodeURIComponent(
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
      <h1>Activities</h1>
      <div>
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

          return (
            <>
              <div>
                <div key={index}>
                  <h2>
                    {activity.name} -
                    {new Date(activity.start_date_local).toLocaleDateString()}
                  </h2>
                  <p>{formattedPace} / km</p>
                  <p>{(activity.distance / 1000).toFixed(2)} km</p>
                  <p>{(activity.moving_time / 60).toFixed(0)} minutes</p>
                  <img src={mapURLs[index]} alt={activity.name} />
                </div>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
}
