import styled from "styled-components";
import { useEffect, useState } from "react";
import { fetchData } from "../../../api";

export function ProgressBar({
  programStartDate,
  weeklyDistances,
  selectedWeek,
}) {
  const [data, setData] = useState([]);
  const [weeklyReachedDistances, setWeeklyReachedDistances] = useState([]);

  // Function only called when data or programStartDate changes, and when selectedWeek changes
  useEffect(() => {
    if (data.length > 0) {
      calculateWeeklyDistances(data, programStartDate, selectedWeek);
    }
  }, [data, programStartDate, selectedWeek]);

  const calculateWeeklyDistances = (data, programStartDate, selectedWeek) => {
    // Set startOfWeek to the start of the selected week
    const startOfWeek = new Date(programStartDate);
    startOfWeek.setDate(startOfWeek.getDate() + (selectedWeek - 1) * 7);

    // Set endOfWeek to 7 days after startOfWeek
    const endOfWeek = new Date(startOfWeek); // Copy the adjusted startOfWeek
    endOfWeek.setDate(endOfWeek.getDate() + 7); // Add 6 to get the end of the week

    // Filter the weekly runs
    const weeklyRuns = data.filter((activity) => {
      const activityDate = new Date(activity.start_date_local);
      return activityDate >= startOfWeek && activityDate <= endOfWeek;
    });

    console.log("Weekly Runs: ", weeklyRuns);
    console.log("Start of the week: ", startOfWeek);
    console.log("End of the week: ", endOfWeek);
    console.log("Number of runs for the week: ", weeklyRuns.length);

    setWeeklyReachedDistances(
      parseFloat(
        (
          weeklyRuns.reduce((total, run) => total + run.distance, 0) / 1000
        ).toFixed(2)
      )
    );
  };

  console.log("Total Distance for the week: ", weeklyReachedDistances);
  // Fetching the runs data from API using useEffect
  useEffect(() => {
    fetchData()
      .then((data) => {
        setData(data);
        console.log("Data: ", data);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  }, []);
  console.log("Goal Weekly Distances: ", weeklyDistances);
  console.log("Selected Week: ", selectedWeek);
  const goalWeeklyDistances = weeklyDistances[selectedWeek - 1];

  return (
    <>
      <WeeklyDistanceContainer>
        {selectedWeek !== null &&
        weeklyDistances[selectedWeek - 1] !== undefined ? (
          <Distance>
            Week {selectedWeek} Goal: {weeklyReachedDistances} /{" "}
            {weeklyDistances[selectedWeek - 1]} km reached
          </Distance>
        ) : null}
      </WeeklyDistanceContainer>
      <ProgressBarBlock>
        <ProgressBarFill
          style={{
            width: `${(weeklyReachedDistances / goalWeeklyDistances) * 100}%`,
          }}
        />
      </ProgressBarBlock>
    </>
  );
}

const ProgressBarBlock = styled.div`
  width: 100%;
  height: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;
const ProgressBarFill = styled.div`
  background-color: #4a5bff;
  width: 1%;
  height: 100%;
  border-radius: 8px;
`;
const Distance = styled.div``;
const WeeklyDistanceContainer = styled.div`
  display: flex;
  justify-content: center;
`;
