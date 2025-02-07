"use client";
import React, { useState, useEffect } from "react";
import {
  ShoppingBasket,
  Bell,
  ChefHat,
  UserCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { baseUrl } from "@/constants/constants";
const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const pathName = usePathname();
  useEffect(() => {
    const getName = async () => {
      const userId = localStorage.getItem("user_id");
      setUserId(userId ? userId : "");
      if (!userId) {
        console.log("User ID not found");
        return;
      }
      const response = await fetch(
        `${baseUrl}/others/get-name?user_id=${userId}`
      );
      const data = await response.json();
      setName(data.name);
    };
    getName();
  }, []);
  const menuItems = [
    { title: "Pantry", icon: ShoppingBasket, path: "/pantry" },
    { title: "Alerts", icon: Bell, path: "/alerts" },
    { title: "Recipes", icon: ChefHat, path: "/recipes" },
    { title: "Profile", icon: UserCircle, path: "/profile" },
  ];
  // const userId = localStorage.getItem("user_id");

  if (pathName === "/" || pathName === "/login" || pathName === "/about") {
    return <></>;
  }

  return (
    <div
      className={`
        h-screen bg-neutral-900 shadow-2xl  transition-all duration-500 ease-in-out sticky top-0
        border-r border-gray-800/50
        ${isExpanded ? "w-72" : "w-20"}
        flex flex-col
      `}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          absolute -right-4 top-8 
          bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-400
          rounded-full p-2 shadow-lg
          hover:shadow-teal-500/20 hover:scale-110
          transition-all duration-600 ease-in-out
          backdrop-blur-sm
        `}
      >
        {isExpanded ? (
          <ChevronLeft className="w-4 h-4 text-white" />
        ) : (
          <ChevronRight className="w-4 h-4 text-white" />
        )}
      </button>

      {/* Logo Area */}
      <div className="p-6 border-b border-gray-800/50">
        {isExpanded ? (
          <div className="flex items-center transition-all duration-[0.3s] ease-in-out space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center">
              <span className="text-white font-bold">F</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 text-transparent bg-clip-text">
              Fridge Pilot
            </h1>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r transition-all duration-500 ease-in-out from-emerald-400 to-teal-500 flex items-center justify-center">
            <span className="text-white font-bold">F</span>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 pt-6">
        {menuItems.map((item, index) => (
          <a
            key={item.title}
            href={item.path}
            style={{
              transitionDelay: `${index * 50}ms`,
            }}
            className={`
              flex items-center px-4 py-3.5 text-gray-400
              hover:text-white relative group
              transition-all duration-500 ease-in-out
              ${isExpanded ? "mx-3 rounded-xl" : "mx-3 rounded-xl"}
              hover:bg-gradient-to-r hover:from-emerald-400/10 hover:via-teal-500/10 hover:to-cyan-400/10
              hover:border-r-2 hover:border-r-teal-500
            `}
          >
            <item.icon
              className={`
              ${isExpanded ? "w-5 h-5 duration-500" : "w-6 h-6 duration-500"}
              transition-all  ease-in-out
              group-hover:text-teal-400
            `}
            />

            {isExpanded ? (
              <span className="ml-4 font-medium tracking-wide">
                {item.title}
              </span>
            ) : (
              <div
                className="
                absolute left-full rounded-md px-3 py-2 ml-6
                bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-400
                text-white text-sm font-medium
                invisible opacity-0 -translate-x-3
                transition-all duration-500 ease-in-out
                group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
                shadow-xl shadow-teal-500/20
                backdrop-blur-sm
              "
              >
                {item.title}
              </div>
            )}
          </a>
        ))}
      </nav>

      {/* User Profile Section */}
      <div
        className={`
        border-t border-gray-800/50 p-4 m-3 mt-6
        rounded-xl bg-gradient-to-r from-emerald-400/5 via-teal-500/5 to-cyan-400/5
        backdrop-blur-sm
        flex items-center
        transition-all duration-500 ease-in-out
        ${isExpanded ? "justify-between" : "justify-center"}
      `}
      >
        <div
          className={` rounded-full bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-400 p-[2px] ${
            isExpanded ? `w-10 h-10` : `w-6 h-6`
          } `}
        >
          <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
            <UserCircle className="w-6 h-6 text-gray-400" />
          </div>
        </div>
        {isExpanded && (
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium text-white">{name}</p>
            <p className="text-xs text-gray-400 truncate">{userId}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
