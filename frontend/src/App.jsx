import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Landing from "./components/pages/Landing";
import LoginSignup from "./components/pages/LoginSignup";
import BuyerDashboard from "./components/pages/BuyerDashboard";
import SellerDashboard from "./components/pages/SellerDashboard";
import RootLayout from "./layouts/RootLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/login-signup",
    element: <LoginSignup />,
  },
  {
    path: "/auth",
    element: <RootLayout />,
    children: [
      {
        path: "buyer",
        element: <BuyerDashboard />,
      },
      {
        path: "seller",
        element: <SellerDashboard />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" />
    </>
  );
}

export default App;
