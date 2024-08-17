import {
  LoaderCircle,
  Button,
  axios,
  USER_ENDPOINT,
  toast,
  useEffect,
  useState,
  useDispatch,
  login,
} from "../../lib/imports";

export default function LoginSignup() {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  // signup handler
  const handleSignup = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    const formData = new FormData(e.target);

    const { fullName, username, email, password, userType } =
      Object.fromEntries(formData);

    // console.log(fullName, username, email, password, userType);
    const response = await axios.post(`${USER_ENDPOINT}/register`, {
      fullName,
      username,
      email,
      password,
      userType,
    });

    console.log("user signup response : ", response);

    setIsLoading(false);

    if (response.data.success === false) {
      toast.error(response.data.message);
    } else {
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      dispatch(login(response.data.data.user));
      toast.success(response.data.message);
    }
  };

  // login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    setIsLoading(true);
    const response = await axios.post(`${USER_ENDPOINT}/login`, {
      email,
      password,
    });

    console.log(response);
    setIsLoading(false);

    if (response.data.success === false) {
      toast.error(response.data.message);
    } else {
      // saving the data even after hard refresh using local storage
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      dispatch(login(response.data.data.user));
      toast.success(response.data.message);
    }
  };

  useEffect(() => {
    // getting data from local store after hard refresh
    const currentUser = JSON.parse(localStorage.getItem("user"));
    dispatch(login(currentUser));
  }, []);

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

          <form className="flex flex-col gap-2" onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="full name"
              name="fullName"
              className="border-2 border-zinc-300 px-2 py-1 rounded-md"
            />
            <input
              type="text"
              placeholder="your unique username"
              name="username"
              className="border-2 border-zinc-300 px-2 py-1 rounded-md"
            />
            <input
              type="email"
              placeholder="email@example.com"
              name="email"
              className="border-2 border-zinc-300 px-2 py-1 rounded-md"
            />
            <input
              type="password"
              placeholder="strong password"
              name="password"
              className="border-2 border-zinc-300 px-2 py-1 rounded-md"
            />

            <div className="flex gap-3 items-center mt-2">
              <label htmlFor="userType" className="font-semibold">
                Sign up as:
              </label>
              <select name="userType" id="userType">
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </select>
            </div>

            <Button className="mt-2 flex items-center gap-2">
              Sign up{" "}
              {isLoading ? <LoaderCircle className="animate-spin" /> : ""}
            </Button>
          </form>
        </div>

        {/* vertical line */}
        <div className="w-1 h-full bg-zinc-600"></div>

        {/* login form  */}
        <div className="text-center w-1/2 p-10">
          <h1 className="text-3xl font-semibold text-zinc-800 mb-4">
            Login In
          </h1>
          <form className="flex flex-col gap-2" onSubmit={handleLogin}>
            <input
              type="text"
              name="email"
              placeholder="username or email"
              className="border-2 border-zinc-300 px-2 py-1 rounded-md"
            />
            <input
              type="password"
              name="password"
              placeholder="strong password"
              className="border-2 border-zinc-300 px-2 py-1 rounded-md"
            />
            <Button className="mt-2">
              Sign In{" "}
              {isLoading ? <LoaderCircle className="animate-spin" /> : ""}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
