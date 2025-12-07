import React, { use } from "react";
import { Link, NavLink } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";

const Navbar = () => {
  const { user, signOutUser } = use(AuthContext);

  const handleLogout = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = (
    <>
      <li className="text-foreg text-lg ">
        <NavLink
          to={"/"}
          className={({ isActive }) =>
            isActive
              ? " border-b-2 border-primary text-lg pb-1 font-bold"
              : "font-normal"
          }
        >
          Home
        </NavLink>
      </li>
      <li className="text-foreg text-lg">
        <NavLink
          to={"/about-us"}
          className={({ isActive }) =>
            isActive
              ? " border-b-2 border-primary text-lg pb-1 font-bold"
              : "font-normal"
          }
        >
          About Us
        </NavLink>
      </li>

      {user && (
        <li className="text-foreg text-lg">
          <NavLink
            to={"/dashboard"}
            className={({ isActive }) =>
              isActive
                ? " border-b-2 border-primary text-lg pb-1 font-bold"
                : "font-normal"
            }
          >
            Dashboard
          </NavLink>
        </li>
      )}
    </>
  );

  return (
    <header className="sticky left-0 top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-gray-200 ">
      <div className=" fix-alignment ">
        <div className="navbar px-0">
          <div className="navbar-start">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost lg:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />{" "}
                </svg>
              </div>
              <ul
                tabIndex="-1"
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                {navItems}
              </ul>
            </div>
            <h1 className="text-xl md:text-3xl font-bold text-primary">
              WorkNest
            </h1>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">{navItems}</ul>
          </div>
          <div className="navbar-end">
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link>
                    <button onClick={handleLogout} className=" btn-accent ">
                      Logout
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to={"/login"}>
                    <button className="btn-primary">Login</button>
                  </Link>
                  <Link to={"/signup"}>
                    <button className="btn-secondary ">
                      <span className="truncate">Sign Up</span>
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
