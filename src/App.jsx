import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home/index.jsx";
import Badges from "./pages/Badges/index.jsx";
import Recap from "./pages/Recap/index.jsx";
import Activities from "./pages/Activities/index.jsx";
import Manage from "./pages/Manage/index.jsx";
import styled from "styled-components";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

const router = createBrowserRouter([
  {
    element: (
      <>
        <Header />
        <Outlet />
      </>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "badges",
        element: <Badges />,
      },
      {
        path: "recap",
        element: <Recap />,
      },
      {
        path: "activities",
        element: <Activities />,
      },
      {
        path: "manage",
        element: <Manage />,
      },
    ],
  },
]);

function App() {
  return (
    <GlobalStyle>
      <RouterProvider router={router} />
    </GlobalStyle>
  );
}

const GlobalStyle = styled.div`
  padding: 0 30px;
`;

export default App;
