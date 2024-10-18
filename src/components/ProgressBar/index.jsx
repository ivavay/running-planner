import { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchData } from "../../services/api";

export function ProgressBar({
  programStartDate,
  weeklyDistances,
  selectedWeek,
}) {
  const [data, setData] = useState([]);
  const [weeklyReachedDistances, setWeeklyReachedDistances] = useState([]);
  const goalWeeklyDistances = weeklyDistances[selectedWeek - 1];

  function calculateWeeklyDistances(data, programStartDate, selectedWeek) {
    // Set startOfWeek to the start of the selected week
    const startOfWeek = new Date(programStartDate);
    startOfWeek.setDate(startOfWeek.getDate() + (selectedWeek - 1) * 7);

    // Set endOfWeek to 7 days after startOfWeek
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    // Filter the weekly runs by the selected week dates
    const weeklyRuns = data.filter((activity) => {
      const activityDate = new Date(activity.start_date_local);
      return activityDate >= startOfWeek && activityDate <= endOfWeek;
    });

    // Calculate the total reached distance for the week from Strava data
    setWeeklyReachedDistances(
      parseFloat(
        (
          weeklyRuns.reduce((total, run) => total + run.distance, 0) / 1000
        ).toFixed(2)
      )
    );
  }

  // Fetches runs data from Strava API using useEffect
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

  useEffect(() => {
    if (data.length > 0) {
      calculateWeeklyDistances(data, programStartDate, selectedWeek);
    }
  }, [data, programStartDate, selectedWeek]);

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
