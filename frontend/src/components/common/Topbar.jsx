import { Search, Bell, LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Topbar({
  onMenuClick = () => {},
}) {
  const { user, roleName, logout } = useAuth();

  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header
      className="
        sticky
        top-0
        z-30
        bg-white
        border-b
        border-gray-200
        shadow-sm

        px-4
        sm:px-6
        lg:px-8

        h-16
        lg:h-20

        flex
        items-center
        justify-between
        gap-4
      "
    >

      {/* Left */}

      <div className="flex items-center gap-4 flex-1">

        {/* Mobile Menu */}

        <button
          onClick={onMenuClick}
          className="
            lg:hidden
            flex
            items-center
            justify-center
            w-10
            h-10
            rounded-xl
            hover:bg-gray-100
            transition
          "
        >
          <Menu size={22} />
        </button>

        {/* Search */}

        <div
          className="
            flex
            items-center
            bg-[#F4F6FF]
            rounded-full

            px-4
            py-2.5

            w-full
            max-w-xl
          "
        >

          <Search
            size={18}
            className="text-gray-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="
              ml-3
              w-full
              bg-transparent
              outline-none
              text-sm
              placeholder:text-gray-400
            "
          />

        </div>

      </div>

      {/* Right */}

      <div
        className="
          flex
          items-center
          gap-3
          lg:gap-6
          shrink-0
        "
      >

        {/* Notification */}

        <button
          className="
            relative
            w-10
            h-10
            rounded-xl
            hover:bg-gray-100
            transition
            flex
            items-center
            justify-center
          "
        >

          <Bell
            size={20}
            className="text-[#3046D3]"
          />

          <span
            className="
              absolute
              top-2
              right-2
              w-2
              h-2
              rounded-full
              bg-red-500
            "
          />

        </button>

        {/* Divider */}

        <div className="hidden lg:block w-px h-10 bg-gray-200" />

        {/* User */}

        <div className="flex items-center gap-3">

          <div className="hidden md:block text-right">

            <h3 className="font-semibold text-sm">

              {user?.full_name || "User"}

            </h3>

            <p className="text-xs uppercase text-gray-400">

              {roleName || "Employee"}

            </p>

          </div>

          <div
            className="
              w-10
              h-10
              rounded-full
              bg-[#3046D3]
              text-white
              flex
              items-center
              justify-center
              font-bold
            "
          >

            {user?.full_name?.charAt(0) || "U"}

          </div>

        </div>

        {/* Logout */}

        <button
          onClick={handleLogout}
          className="
            w-10
            h-10
            rounded-xl
            hover:bg-red-50
            hover:text-red-500
            transition
            flex
            items-center
            justify-center
          "
        >

          <LogOut size={20} />

        </button>

      </div>

    </header>
  );
}