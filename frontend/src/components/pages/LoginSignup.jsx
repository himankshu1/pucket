import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function LoginSignup() {
  return (
    <>
      <div className="h-screen w-screen relative">
        <img
          src="/background.jpg"
          alt="background-image"
          className="absolute inset-0 w-full h-full object-cover blur"
        />
        <div className="absolute inset-0 bg-black/50"></div> {/* Overlay */}
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-between items-center w-3/5 h-3/5 bg-white rounded-lg">
        {/* signup form */}
        <div className="text-center w-1/2 p-10">
          <h1 className="text-3xl font-semibold text-zinc-800 mb-4">Sign Up</h1>
          <form className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="full name"
              className="border-2 border-zinc-300 px-2 py-1 rounded-md"
            />
            <input
              type="text"
              placeholder="your unique username"
              className="border-2 border-zinc-300 px-2 py-1 rounded-md"
            />
            <input
              type="email"
              placeholder="email@example.com"
              className="border-2 border-zinc-300 px-2 py-1 rounded-md"
            />
            <input
              type="password"
              placeholder="strong password"
              className="border-2 border-zinc-300 px-2 py-1 rounded-md"
            />

            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sign up as" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sign up as</SelectLabel>
                  <SelectItem value="apple">Buyer</SelectItem>
                  <SelectItem value="banana">Seller</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button className="mt-2">Sign up</Button>
          </form>
        </div>

        {/* vertical line */}
        <div className="w-1 h-full bg-zinc-600"></div>

        {/* login form  */}
        <div className="text-center w-1/2 p-10">
          <h1 className="text-3xl font-semibold text-zinc-800 mb-4">
            Login In
          </h1>
          <form className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="username or email"
              className="border-2 border-zinc-300 px-2 py-1 rounded-md"
            />
            <input
              type="password"
              placeholder="strong password"
              className="border-2 border-zinc-300 px-2 py-1 rounded-md"
            />

            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sign in as" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sign in as</SelectLabel>
                  <SelectItem value="apple">Buyer</SelectItem>
                  <SelectItem value="banana">Seller</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button className="mt-2">Sign In</Button>
          </form>
        </div>
      </div>
    </>
  );
}
