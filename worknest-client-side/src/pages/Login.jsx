import { use, useState } from "react";
import { Eye, EyeOff, Building2, Lock } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthContext } from "../contexts/AuthContext";

const Login = () => {
  const { signInUser } = use(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInUser(email, password);
      navigate(location?.state || "/");
    } catch (error) {
      console.error("Sign-in failed:", error);
    }
  };

  return (
    <section className="fix-alignment ">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background">
        <div className=" flex h-full grow flex-col">
          <main className="flex-grow">
            <div className="flex min-h-screen">
              {/* Left Column: Image and Branding */}
              <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-muted">
                <div
                  className="absolute inset-0 w-full h-full bg-center bg-no-repeat bg-cover"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBosQizTSOIU9SRozeAotzovAE322_I7B1XrXJl2Si38TR8990bH1pwflV--_ZZwsyVND0rCfG7r-8vavFXWCDklHbOR5E0dBt_Axh1HeH7o3algSs8JAe2eUKpJnxr-6XAZACbMwLRcaAY8Hy2SlqWc7UpNhkCiS4kwt5sgkiYEnYNUO1r44iXbX8-G7KyOi43R-LGdWvTI5s49_bF8tCIa6PUNBArg2VHv3ZIcYjh1EOb3s3KVEDqgyWm51VsM3s7qPnEucMBH8g')`,
                  }}
                >
                  <div className="absolute inset-0 bg-black/30"></div>
                </div>
                <div className="relative z-10 p-12 text-center text-white">
                  <div className="mb-8">
                    <h2 className="text-4xl font-bold leading-tight mb-4">
                      Your Smart Hybrid Workspace, Connected.
                    </h2>
                    <p className="text-lg opacity-90 max-w-md mx-auto">
                      Seamlessly manage your team, book desks, and foster
                      collaboration, wherever you are.
                    </p>
                  </div>
                  <div className="mt-12">
                    <div className="flex justify-center space-x-8 text-white/80">
                      <div className="text-center">
                        <div className="text-2xl font-bold">1,000+</div>
                        <div className="text-sm">Companies</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">50K+</div>
                        <div className="text-sm">Employees</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">99.9%</div>
                        <div className="text-sm">Uptime</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Login Form */}
              <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md">
                  {/* Logo */}

                  <h1 className="text-foreground tracking-tight text-[32px] font-bold leading-tight text-left pb-1">
                    Welcome Back
                  </h1>
                  <p className="text-muted-foreground text-base font-normal leading-normal pb-8">
                    Sign in to continue to your WorkNest account.
                  </p>

                  {/* Email Field */}
                  <div className="flex w-full flex-wrap items-end gap-4 pb-4">
                    <label className="flex flex-col min-w-40 flex-1 w-full">
                      <p className="text-foreground text-base font-medium leading-normal pb-2">
                        Email Address
                      </p>
                      <input
                        className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 bg-card h-14 placeholder:text-muted-foreground p-[15px] text-base font-normal leading-normal border border-border transition-colors duration-200"
                        placeholder="Enter your email address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </label>
                  </div>

                  {/* Password Field */}
                  <div className="flex w-full flex-wrap items-end gap-4 pb-4">
                    <label className="flex flex-col min-w-40 flex-1 w-full">
                      <div className="flex justify-between items-center pb-2">
                        <p className="text-foreground text-base font-medium leading-normal">
                          Password
                        </p>
                      </div>
                      <div className="flex w-full flex-1 items-stretch rounded-lg">
                        <input
                          className="flex w-full min-w-0 flex-1 resize-none overflow-hidden text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 bg-card h-14 placeholder:text-muted-foreground p-[15px] rounded-r-none border-r-0 pr-2 text-base font-normal leading-normal rounded-l-lg border border-border transition-colors duration-200"
                          placeholder="Enter your password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          className="text-muted-foreground hover:text-foreground flex border border-l-0 border-border bg-card items-center justify-center px-4 rounded-r-lg transition-colors duration-200"
                          onClick={() => setShowPassword(!showPassword)}
                          type="button"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </label>
                  </div>

                  {/* Sign In Button */}
                  <button
                    onClick={handleSignIn}
                    className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-lg hover:bg-primary-hover transition-colors duration-200 mt-6 h-14 shadow-lg hover:shadow-xl"
                  >
                    Login
                  </button>

                  {/* Sign Up Link */}
                  <div className="mt-8 text-center">
                    <p className="text-base text-muted-foreground">
                      Don't have an account?{" "}
                      <Link
                        to={"/signup"}
                        className="font-medium text-primary hover:underline cursor-pointer transition-colors duration-200"
                      >
                        Sign Up
                      </Link>
                    </p>
                  </div>

                  {/* Security Note */}
                  <div className="mt-8 p-4 flex items-center gap-2 justify-center bg-muted/50 rounded-lg border border-border">
                    <Lock className=" text-muted-foreground h-4 w-4" />
                    <p className="text-xs text-muted-foreground text-center">
                      Your data is securely encrypted and protected
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
};

export default Login;
