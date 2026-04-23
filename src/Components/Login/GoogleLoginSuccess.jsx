import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URI } from "../../../config";
import { useAuth } from "../Contexts/AuthContext";

const GoogleLoginSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URI}/auth/login/success`, {
          withCredentials: true,
        });

        if (res.data.user) {
          await login(res.data.user);

          // Role-based redirect
          if (res.data.user.role === "admin") {
            navigate("/admin", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        } else {
          throw new Error("No user data received");
        }
      } catch (err) {
        console.error("Google login failed", err);
        setError("Google login failed. Redirecting to login...");
        setTimeout(() => navigate("/login", { replace: true }), 2000);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-black">
      {error ? (
        <p className="text-lg font-semibold text-red-400">{error}</p>
      ) : (
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-slate-50">Logging you in...</p>
        </div>
      )}
    </div>
  );
};

export default GoogleLoginSuccess;
