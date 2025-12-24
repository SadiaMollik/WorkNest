import axios from "axios";
import { use, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Loading from "./Loading";
import { Navigate } from "react-router";
import BlockedProfile from "./BlockedProfile";

const RequireProfileCompleted = ({ children }) => {
  const { user, loading: authLoading } = use(AuthContext);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading || !user) {
      setProfileLoading(true);
      return;
    }

    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        const response = await axios.get(`http://localhost:3000/users/${user.uid}`);
        setProfile(response.data.users);
        setError(null);
      } catch (err) {
        console.error("Error fetching profile:", err);
        
        // If user doesn't exist, wait a moment and retry (they might be being created)
        if (err.response?.status === 404) {
          setTimeout(async () => {
            try {
              const retryResponse = await axios.get(`http://localhost:3000/users/${user.uid}`);
              setProfile(retryResponse.data.users);
              setError(null);
            } catch (retryErr) {
              setError("Profile not found. Please contact support.");
            }
          }, 1000);
        } else {
          setError("Error loading profile");
        }
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [user, authLoading]);

  // Show loading while auth or profile is loading
  if (authLoading || profileLoading) {
    return <Loading />;
  }

  // Show error if profile fetch failed
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // If no profile yet, keep showing loading
  if (!profile) {
    return <Loading />;
  }

  console.log("Profile check:", profile);

  // Redirect to complete profile if not completed
  if (!profile.profileCompleted) {
    return <Navigate to="/complete-profile" />;
  }

  // Show blocked screen if user is not active
  if (!profile.isActive) {
    return <BlockedProfile />;
  }

  // All checks passed, render children
  return children;
};

export default RequireProfileCompleted;