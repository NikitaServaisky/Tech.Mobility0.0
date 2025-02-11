import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./pages/root";
import ErrorElement from "./pages/errorElement";
import Login from "./pages/login";
import Register from "./pages/register";
import Customer from "./components/registrationComponent/customerRegistration";
import RegistrationList from "./components/registrationListComponent/registrationList";
import Organization from "./components/registrationComponent/organizationRegistration";
import Driver from "./components/registrationComponent/driverRegistration";
import ProtectedRoute from "./components/protectionConponent/protection";
import Dashboard from "./pages/dashboards";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorElement />,
      children: [
        {
          path: "/",
          children: [
            {
              path: "login",
              element: <Login />,
            },
            {
              path: "register",
              element: <Register />,
              children: [
                {
                  index: true,
                  element: <RegistrationList />,
                },
                {
                  path: "customer",
                  element: <Customer />,
                },
                {
                  path: "driver",
                  element: <Driver />,
                },
                {
                  path: "organization",
                  element: <Organization />,
                },
              ],
            },
            {
              path: "dashboard",
              element: (
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              ),
              children: [
                {
                  path: "driverDashboard",
                  element: <DriverDashboard />,
                },
                {
                  path: "organizationDashboard",
                  element: <OrganizationDashboard />,
                },
                {
                  path: "customerDashboard",
                  element: <CustomerDashboard />,
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
