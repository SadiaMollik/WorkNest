import { use, useState } from "react";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

const SignUp = () => {
  const { createUser, updateUser } = use(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    role: "employee",
    agreeToTerms: false,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const passwordRequirements = [
    { text: "At least 6 characters", met: formData.password.length >= 6 },
    { text: "One uppercase letter", met: /[A-Z]/.test(formData.password) },
    { text: "One number", met: /[0-6]/.test(formData.password) },
    {
      text: "One special character",
      met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agreeToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    // Validate password requirements
    const isPasswordValid = passwordRequirements.every((req) => req.met);
    if (!isPasswordValid) {
      setError("Please meet all password requirements");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create user in Firebase
      const userCredential = await createUser(
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Update user profile with display name
      await updateUser({
        displayName: formData.name,
      });

      //  User data for backend
      const userData = {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        companyName: formData.companyName,
        role: "employee",
      };

      // Sending user data to backend
      const response = await axios.post(
        "http://localhost:3000/users",
        userData
      );

      console.log("User created successfully:", response.data);

      // Redirect to dashboard
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);

      if (error.response) {
        // Backend API error
        setError(
          error.response.data.message || "Failed to create user account."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.name &&
      formData.email &&
      formData.password &&
      formData.companyName &&
      formData.agreeToTerms &&
      passwordRequirements.every((req) => req.met)
    );
  };

  return (
    <section className="fix-alignment">
      <div className="relative flex w-full flex-col overflow-x-hidden bg-background">
        <div className="layout-container flex grow flex-col">
          <main className="flex-grow">
            <div className="flex min-h-screen">
              {/* Left Column: Image and Branding */}
              <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-muted">
                <div
                  className="absolute inset-0 w-full bg-center bg-no-repeat bg-cover"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCx_VNueuJYIboq53Ae-LLQdRiJ6XahPv-g8lxT4vPHf6XUKZnX7DWqmpwOH-yFi2hA9nGaEE4akPPJbQavwnic8vJ09Z4t-mSF4Xxdynz0Qbe0_-mFK5zoPXHjnpoCIiGXPkd2M8jZ2f_9XghVGMqRSTXCJQEag_59agSB2D-JF8T7PpLrMzFXWTaK3TKF2Zej9Yb88Ic_RRVjN8czgUsgPorWG64jdeCg1hxPQM9SD-_VzSKd2xbIIuAAdr4tuYAD2SzHD5YhsLbr')`,
                  }}
                ></div>
              </div>

              {/* Right Column: Sign Up Form */}
              <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md">
                  {/* Error Message */}
                  {error && (
                    <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg">
                      <p className="text-error text-sm">{error}</p>
                    </div>
                  )}

                  <h1 className="text-foreground text-3xl font-bold text-left pb-3">
                    Create Your Account
                  </h1>
                  <p className="text-muted-foreground text-base font-normal pb-8">
                    Join WorkNest and transform your hybrid workspace
                    management.
                  </p>

                  <form onSubmit={handleSubmit}>
                    {/* Name Field */}
                    <div className="pb-4">
                      <label className="flex flex-col">
                        <p className="text-foreground text-base font-medium pb-2">
                          Name
                        </p>
                        <input
                          className="rounded-lg text-foreground outline-primary/50 bg-card h-14 placeholder:text-muted-foreground p-[15px] text-base border border-border focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-colors duration-200"
                          placeholder="Enter your name"
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          required
                        />
                      </label>
                    </div>

                    {/* Company Field */}
                    <div className="flex w-full flex-wrap items-end gap-4 pb-4">
                      <label className="flex flex-col min-w-40 flex-1 w-full">
                        <p className="text-foreground text-base font-medium leading-normal pb-2">
                          Company Name
                        </p>
                        <input
                          className="rounded-lg text-foreground outline-primary/50 bg-card h-14 placeholder:text-muted-foreground p-[15px] text-base border border-border focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-colors duration-200"
                          placeholder="Your company name"
                          type="text"
                          value={formData.companyName}
                          onChange={(e) =>
                            handleInputChange("companyName", e.target.value)
                          }
                          required
                        />
                      </label>
                    </div>

                    {/* Email Field */}
                    <div className="flex w-full flex-wrap items-end gap-4 pb-4">
                      <label className="flex flex-col min-w-40 flex-1 w-full">
                        <p className="text-foreground text-base font-medium leading-normal pb-2">
                          Work Email
                        </p>
                        <input
                          className="rounded-lg text-foreground outline-primary/50 bg-card h-14 placeholder:text-muted-foreground p-[15px] text-base border border-border focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-colors duration-200"
                          placeholder="Enter your work email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          required
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
                            className="flex w-full min-w-0 flex-1 resize-none overflow-hidden text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 bg-card h-14 placeholder:text-muted-foreground p-[15px] rounded-r-none border-r-0 pr-2 text-base font-normal leading-normal rounded-l-lg border border-border transition-colors duration-200"
                            placeholder="Create a password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) =>
                              handleInputChange("password", e.target.value)
                            }
                            required
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

                    {/* Password Requirements */}
                    {formData.password && (
                      <div className="mb-4 p-4 bg-muted/30 rounded-lg border border-border">
                        <p className="text-sm font-medium text-foreground mb-2">
                          Password requirements:
                        </p>
                        <div className="space-y-1">
                          {passwordRequirements.map((req, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <div
                                className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                  req.met
                                    ? "bg-secondary"
                                    : "bg-muted-foreground/20"
                                }`}
                              >
                                {req.met && (
                                  <CheckCircle className="w-3 h-3 text-white" />
                                )}
                              </div>
                              <span
                                className={`text-xs ${
                                  req.met
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {req.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Terms and Conditions */}
                    <div className="flex items-start space-x-3 mb-6">
                      <input
                        type="checkbox"
                        checked={formData.agreeToTerms}
                        onChange={(e) =>
                          handleInputChange("agreeToTerms", e.target.checked)
                        }
                        className="mt-1 rounded border-border text-primary focus:ring-primary/50"
                        required
                      />
                      <label className="text-sm text-muted-foreground">
                        I agree to the{" "}
                        <a href="#" className="text-primary hover:underline">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-primary hover:underline">
                          Privacy Policy
                        </a>
                      </label>
                    </div>

                    {/* Sign Up Button */}
                    <button
                      type="submit"
                      className={`w-full font-semibold py-4 rounded-lg transition-colors duration-200 mt-2 h-14 shadow-lg hover:shadow-xl flex items-center justify-center ${
                        isFormValid() && !loading
                          ? "bg-primary text-primary-foreground hover:bg-primary-hover cursor-pointer"
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      }`}
                      disabled={!isFormValid() || loading}
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </button>
                  </form>

                  {/* Sign In Link */}
                  <div className="mt-8 text-center">
                    <p className="text-base text-muted-foreground">
                      Already have an account?{" "}
                      <Link
                        className="font-medium text-primary hover:underline cursor-pointer transition-colors duration-200"
                        to={"/login"}
                      >
                        Sign In
                      </Link>
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

export default SignUp;
