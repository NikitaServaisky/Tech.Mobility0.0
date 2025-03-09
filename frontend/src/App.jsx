import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./pages/root";
import ErrorElement from "./pages/errorElement";
import Login from "./pages/login";
import Register from "./pages/register";
import Customer from "./components/registrationComponent/customerRegistration";
import RegistrationList from "./components/registrationListComponent/registrationList";
import { clientLinks } from "./assets/future_questions_fields/registerFirstList";
import Organization from "./components/registrationComponent/organizationRegistration";
import Driver from "./components/registrationComponent/driverRegistration";
import ProtectedRoute from "./components/protectionConponent/protection";
import Dashboard from "./pages/dashboards";
import DriverDashboard from "./components/dashboarddsComponent/driverDash";
import OrganizationDashboard from "./components/dashboarddsComponent/organizationDash";
import CustomerDashboard from "./components/dashboarddsComponent/customerDash";

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
                  element: <RegistrationList links={clientLinks} />,
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
                  path: "driver",
                  element: <DriverDashboard />,
                },
                {
                  path: "organization",
                  element: <OrganizationDashboard />,
                },
                {
                  path: "customer",
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
