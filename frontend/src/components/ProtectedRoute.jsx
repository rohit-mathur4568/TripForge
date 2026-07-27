import { Navigate, Outlet, useNavigate } from "react-router";
import { LogOut, UserRound } from "lucide-react";

function ProtectedRoute() {
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("tripforge_access_token");

  let currentUser = {
    name: "Traveller",
    email: "",
  };

  try {
    const storedUser = localStorage.getItem("tripforge_user");

    if (storedUser) {
      currentUser = JSON.parse(storedUser);
    }
  } catch {
    currentUser = {
      name: "Traveller",
      email: "",
    };
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  function handleLogout() {
    localStorage.removeItem("tripforge_access_token");
    localStorage.removeItem("tripforge_user");

    navigate("/login", {
      replace: true,
    });
  }

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full border border-[#dce6d5] bg-white/95 p-2 pl-4 shadow-[0_14px_45px_rgba(40,65,45,0.16)] backdrop-blur-xl">
        <div className="hidden items-center gap-2 text-sm font-bold text-[#435248] sm:flex">
          <UserRound className="h-4 w-4 text-[#39734f]" />
          {currentUser.name}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-full bg-[#173d2e] px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#20533f]"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>

      <Outlet />
    </>
  );
}

export default ProtectedRoute;