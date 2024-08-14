import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export default function Landing() {
  return (
    <>
      {/* Add background image /public */}

      <div className="h-screen w-screen relative">
        <img
          src="/background.jpg"
          alt="background-image"
          className="absolute inset-0 w-full h-full object-cover blur"
        />
        <div className="absolute inset-0 bg-black/50"></div> {/* Overlay */}
      </div>

      <div className="absolute inset-y-1/2 flex flex-col gap-10 justify-center items-center mx-auto w-full">
        <h1 className="text-6xl font-semibold text-white">
          Checkout stunning collection of picture arts
        </h1>

        <Link
          to="/login-signup"
          className="px-10 py-4 bg-white text-black text-xl font-medium rounded-md hover:bg-blue-700 hover:text-white"
        >
          Login or Signup
        </Link>
      </div>
    </>
  );
}
