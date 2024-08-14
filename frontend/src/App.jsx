import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Landing from "./components/pages/Landing";
import LoginSignup from "./components/pages/LoginSignup";
import BuyerDashboard from "./components/pages/BuyerDashboard";
import SellerDashboard from "./components/pages/SellerDashboard";
import RootLayout from "./layouts/RootLayout";

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
    </>
  );
}

export default App;
