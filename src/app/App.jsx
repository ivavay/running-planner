import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";
import Activities from "../pages/Activities/index.jsx";
import Authorize from "../pages/Authorize/index.jsx";
import Home from "../pages/Home/index.jsx";
import Login from "../pages/Login/index.jsx";
import NotFound from "../pages/NotFound";
import Recap from "../pages/Recap/index.jsx";
import "./App.css";
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
        path: "recap",
        element: <Recap />,
      },
      {
        path: "activities",
        element: <Activities />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "authorize",
        element: <Authorize />,
      },
      {
        path: "*",
        element: <NotFound />,
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
