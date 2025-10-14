import { createBrowserRouter } from "react-router-dom";
import { CarDetail } from "./pages/car";
import { Dashboard } from "./pages/dashboard";
import { Edit } from "./pages/dashboard/edit";
import { New } from "./pages/dashboard/new";
import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Register } from "./pages/register";

import { Layout } from "./components/layout";
import { Private } from "./routes/Private";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/car/:id",
        element: <CarDetail />,
      },
      {
        path: "/dashboard",
        element: (
          <Private>
            {" "}
            <Dashboard />{" "}
          </Private>
        ),
      },
      {
        path: "/dashboard/new",
        element: (
          <Private>
            {" "}
            <New />{" "}
          </Private>
        ),
      },
      {
        path: "/dashboard/edit/:id",
        element: (
          <Private>
            {" "}
            <Edit />{" "}
          </Private>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export { router };
