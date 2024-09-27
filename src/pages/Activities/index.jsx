import { useEffect, useState, useRef } from "react";
import { fetchData } from "../../../api";
import polyline from "@mapbox/polyline";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function Activities() {
  const [data, setData] = useState([]);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

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
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchActivitiesData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const routes = [];
      data.forEach((activity) => {
        activity.coordinates = polyline.decode(activity.map.summary_polyline);
        // Flip the longitude and latitude
        activity.coordinates = activity.coordinates.map((coord) => [
          coord[1],
          coord[0],
        ]);
        routes.push(activity.coordinates);
      });
      console.log("First activity route: ", routes);
      // I want to first display all the routes on one map
      // Initialize the map
      // I want the center to be the startig point of each route
      mapRef.current = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/light-v11",
        center: routes[0][0], // First point of the first route
        zoom: 12,
      });

      mapRef.current.on("load", function () {
        // Loop through each route and add it to the map
        routes.forEach((route, index) => {
          // Add a source for each route
          mapRef.current.addSource(`route${index}`, {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: route, // Route coordinates
              },
            },
          });

          // Add a layer to display the route
          mapRef.current.addLayer({
            id: `route${index}`,
            type: "line",
            source: `route${index}`,
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#002bba",
              "line-width": 2,
            },
          });
        });
      });
    }
  }, [data]);

  return (
    <>
      <h1>Activities</h1>
      <div
        ref={mapContainerRef}
        id="map"
        style={{ width: "100%", height: "70vh" }}
      ></div>
    </>
  );
}
