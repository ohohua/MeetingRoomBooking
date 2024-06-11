import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./login/index";
import Register from "./register/index";
import UpdatePassword from "./updatePassword";
import ErrorPage from "./errorPage";
import UserManage from "./userManager";
import "./assets/tailwindcss.css";
import Layout from "./layout";
import Password from "./setting/password";
import Message from "./setting/message";

const routes = [
  {
    path: "/",
    element: <Layout></Layout>,
    errorElement: <ErrorPage></ErrorPage>,

    children: [
      {
        path: "user_manage",
        element: <UserManage />,
      },
      {
        path: "message",
        element: <Message></Message>,
      },
      {
        path: "password",
        element: <Password></Password>,
      },
    ],
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
