import { useState, useEffect } from "react";
import styled from "styled-components";
import { fetchData } from "../../../api";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

// Register the line chart type
Chart.register(...registerables);

export default function Recap() {
  // Month navigation
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const month = currentMonth.getMonth();
  const year = currentMonth.getFullYear();
  console.log("Current Month: ", month);
  // Give each month its name
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  function handlePrevMonth() {
    setCurrentMonth(new Date(year, month - 1));
  }

  function handleNextMonth() {
    setCurrentMonth(new Date(year, month + 1));
  }

  // States for monthly data
  const [fastestRun, setFastestRun] = useState(null);
  const [longestRun, setLongestRun] = useState(null);
  const [averagePace, setAveragePace] = useState(null);
  const [monthlyTotalDistance, setMonthlyTotalDistance] = useState(null);
  const [monthlyPaces, setMonthlyPaces] = useState([]);
  const [monthlyDistances, setMonthlyDistances] = useState([]);
  // Printing run data from Strava API that occured in the current month
  useEffect(() => {
    fetchData()
      .then((data) => {
        console.log("Number of runs per month", data.length);
        console.log("Current Month: ", month);
        // Filter by runs that occured in the month of the currentMonth
        const runs = data.filter((activity) => {
          const activityDate = new Date(activity.start_date_local);
          return (
            activity.type === "Run" &&
            activityDate.getMonth() === month &&
            activityDate.getFullYear() === year
          );
        });
        // Reverse teh array so that the first run is the first run of the month
        runs.reverse();
        // Calculate paces for each run
        const paces = runs.map((run) => {
          const paceInMinutesPerKm = (1000 / (run.average_speed * 60)).toFixed(
            2
          );
          const minutes = Math.floor(paceInMinutesPerKm);
          const seconds = Math.round((paceInMinutesPerKm - minutes) * 60);
          const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
          return `${minutes}:${formattedSeconds}`;
        });
        setMonthlyPaces(paces);

        // Calculate distances for each run
        const distances = runs.map((run) => (run.distance / 1000).toFixed(1));
        setMonthlyDistances(distances);

        console.log(`${month}`, runs);
        // Find the smallest number in the runs array to find the fastest run
        const fastestAvgSpeed = Math.max(
          ...runs.map((run) => run.average_speed)
        );
        const paceInMinutesPerKm = (1000 / (fastestAvgSpeed * 60)).toFixed(2);
        const minutes = Math.floor(paceInMinutesPerKm);
        const seconds = Math.round((paceInMinutesPerKm - minutes) * 60);
        // Make sure seconds are almost always two digits
        const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        const kmpace = `${minutes}:${formattedSeconds}`;
        console.log("Fastest Avg Speed: ", kmpace);
        setFastestRun(kmpace);
        // Find the longest run aka the biggest number for distance in the array
        const longestRun = Math.max(...runs.map((run) => run.distance));
        // Convert the distance from meters to kilometers
        const longestRunKm = (longestRun / 1000).toFixed(2);
        console.log("Longest Run: ", longestRunKm);
        setLongestRun(longestRunKm);
        // Find the total distance for this month by adding up all the distances
        const totalDistance = runs.reduce((acc, run) => acc + run.distance, 0);
        const totalDistanceKm = (totalDistance / 1000).toFixed(2);
        console.log("Total Distance: ", totalDistanceKm);
        setMonthlyTotalDistance(totalDistanceKm);
        // Find average pace for the month
        const totalAvgSpeed = runs.reduce(
          (acc, run) => acc + run.average_speed,
          0
        );
        const averageSpeed = totalAvgSpeed / runs.length;
        const avgPaceInMinutesPerKm = (1000 / (averageSpeed * 60)).toFixed(2);
        const avgMinutes = Math.floor(avgPaceInMinutesPerKm);
        const avgSeconds = Math.round(
          (avgPaceInMinutesPerKm - avgMinutes) * 60
        );
        // Make sure seconds are almost always two digits
        const avgFormattedSeconds =
          avgSeconds < 10 ? `0${avgSeconds}` : `${avgSeconds}`;
        const avgKmpace = `${avgMinutes}:${avgFormattedSeconds}`;
        console.log("Average Pace: ", avgKmpace);
        setAveragePace(avgKmpace);
      })
      .catch((error) => console.error("Error fetching data: ", error));
  }, [currentMonth, year]);

  console.log("Monthly Paces: ", monthlyPaces);

  function convertPaceToDecimal(pace) {
    const [minutes, seconds] = pace.split(":");
    return parseInt(minutes) + parseInt(seconds) / 60;
  }

  // Chart for pace distribution
  const decimalPaces = monthlyPaces.map(convertPaceToDecimal);
  const dataPace = {
    labels: monthlyPaces,
    datasets: [
      {
        label: "Pace (minutes per km)",
        data: decimalPaces,
        fill: false,
        backgroundColor: "rgba(136, 201, 255, 0.574)",
        borderColor: "#3b86ff",
      },
    ],
  };
  // Chart for monthly distance progression
  const dataDistance = {
    labels: monthlyDistances,
    datasets: [
      {
        label: "Distance (km)",
        data: monthlyDistances,
        fill: false,
        backgroundColor: "rgba(136, 201, 255, 0.574)",
        borderColor: "#3b86ff",
      },
    ],
  };
  return (
    <>
      <h1>Monthly Recap Page</h1>
      <MonthNavigation>
        <MonthButton onClick={handlePrevMonth}>Prev</MonthButton>
        <Month>{`${monthNames[month]} ${year}`}</Month>
        <MonthButton onClick={handleNextMonth}>Next</MonthButton>
      </MonthNavigation>
      <Container>
        <DataContainer>Fastest Run: {fastestRun} / km </DataContainer>
        <DataContainer>Longest Run: {longestRun} km </DataContainer>
        <DataContainer>Average Pace: {averagePace} / km </DataContainer>
        <DataContainer>
          Monthly Total Distance: {monthlyTotalDistance} km
        </DataContainer>
      </Container>
      <ChartContainer>
        <ChartCard>
          Pace Distribution
          <Line data={dataPace} />
        </ChartCard>
        <ChartCard>
          Distance Progression
          <Line data={dataDistance} />
        </ChartCard>
      </ChartContainer>
    </>
  );
}

const Month = styled.div`
  text-align: center;
  padding: 20px 0;
`;

const MonthNavigation = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const MonthButton = styled.button``;

const DataContainer = styled.div`
  margin: 40px 12px;
`;
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ChartCard = styled.div`
  height: auto;
  width: 40%;
  margin: 20px;
`;
const ChartContainer = styled.div`
  display: flex;
  justify-content: center;
`;
