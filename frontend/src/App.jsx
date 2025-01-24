import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./pages/root";
import ErrorElement from "./pages/errorElement";
import Login from "./pages/login";
import Register from "./pages/register";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorElement />,
      children: [
        {
          path: "auth",
          children: [
            {
              path: "login",
              element: <Login />,
            },
            {
              path: "register",
              children: [
                {
                  path: "customer",
                },
                {
                  path: "driver",
                },
                {
                  path: "organization",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "*",
      element: <ErrorElement />,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
