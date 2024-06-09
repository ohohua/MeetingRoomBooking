import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./login/index";
import Register from "./register/index";
import UpdatePassword from "./updatePassword";
import ErrorPage from "./errorPage";
import "./assets/tailwindcss.css";

const routes = [
  {
    path: "/",
    element: <div>index</div>,
    errorElement: <ErrorPage></ErrorPage>,

    children: [],
  },
  {
    path: "login",
    element: <Login></Login>,
  },
  {
    path: "register",
    element: <Register></Register>,
  },
  {
    path: "update_password",
    element: <UpdatePassword></UpdatePassword>,
  },
];

const router = createBrowserRouter(routes);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(<RouterProvider router={router} />);
