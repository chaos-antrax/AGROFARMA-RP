import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from "@headlessui/react";
import {
  ArrowLeftStartOnRectangleIcon,
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";

import logo from "../assets/AGROFARMA (12).png";
import DashboardHome from "../components/dashboard/DashboardHome";
import Alternatives from "./alternatives/Alternatives";
import Log from "../components/dashboard/Log";
import SoilStatus from "../components/dashboard/SoilStatus";
import CostAnalysis from "../components/dashboard/CostAnalysis";
import Assistant from "../components/dashboard/Assistant";
import Recommendations from "../pages/recommendations/app";
import MarketPricePrediction from "../pages/MarketPricePrediction";

const navigation = [
  {
    name: "Dashboard",
    href: "#",
    icon: HomeIcon,
    current: true,
    component: <DashboardHome />,
  },
  // {
  //   name: "Log",
  //   href: "#",
  //   icon: ChartPieIcon,
  //   current: false,
  //   component: <Log />,
  // },
];

const features = [
  {
    name: "Crop Recommendations",
    href: "#",
    icon: UsersIcon,
    current: false,
    // component: <Alternatives />,
    component: <Recommendations />,
  },
  {
    name: "Growth Success Analysis",
    href: "#",
    icon: FolderIcon,
    current: false,
    component: <SoilStatus />,
  },
  {
    name: "Market Price Prediction",
    href: "#",
    icon: CalendarIcon,
    current: false,
    component: <MarketPricePrediction />,
  },
  {
    name: "Assistant",
    href: "#",
    icon: DocumentDuplicateIcon,
    current: false,
    component: <Assistant />,
  },
];

const teams = [
  { id: 1, name: "Home", href: "/", initial: "H", current: false },
  { id: 2, name: "About", href: "/about", initial: "A", current: false },
  { id: 3, name: "Contact", href: "/contact", initial: "C", current: false },
];
const userNavigation = [
  //   { name: "Your profile", href: "#" },
  { name: "Sign out", href: "#" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Dashboard() {
  const { isLoggedIn, logout } = useContext(AuthContext);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(<DashboardHome />);
  console.log(activeTab);

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <div>
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="size-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-[#cfffd9] to-white px-6 pb-4">
                <div className="flex h-16 shrink-0 items-center">
                  <img
                    alt="Your Company"
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=white"
                    className="h-8 w-auto"
                  />
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li
                            key={item.name}
                            onClick={() => setActiveTab(item.component)}
                          >
                            <a
                              href={item.href}
                              className={classNames(
                                item.current
                                  ? "bg-indigo-700 text-white"
                                  : "text-indigo-200 hover:bg-indigo-700 hover:text-white",
                                "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className={classNames(
                                  item.current
                                    ? "text-white"
                                    : "text-indigo-200 group-hover:text-white",
                                  "size-6 shrink-0"
                                )}
                              />
                              {item.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li>
                      <div className="text-xs/6 font-semibold text-indigo-200">
                        Your teams
                      </div>
                      <ul role="list" className="-mx-2 mt-2 space-y-1">
                        {teams.map((team) => (
                          <li key={team.name}>
                            <a
                              href={team.href}
                              className={classNames(
                                team.current
                                  ? "bg-indigo-700 text-white"
                                  : "text-indigo-200 hover:bg-indigo-700 hover:text-white",
                                "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                              )}
                            >
                              <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-indigo-400 bg-indigo-500 text-[0.625rem] font-medium text-white">
                                {team.initial}
                              </span>
                              <span className="truncate">{team.name}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li className="mt-auto">
                      <a
                        href="#"
                        className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-indigo-200 hover:bg-indigo-700 hover:text-white"
                      >
                        <Cog6ToothIcon
                          aria-hidden="true"
                          className="size-6 shrink-0 text-indigo-200 group-hover:text-white"
                        />
                        Settings
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-t from-[#cfffd9] to-white px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center justify-center">
              <a href="/">
                <img alt="Your Company" src={logo} className="h-10 w-auto" />
              </a>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li
                        key={item.name}
                        onClick={() => setActiveTab(item.component)}
                      >
                        <a
                          href={item.href}
                          className={classNames(
                            activeTab === item.component
                              ? "bg-[#16b766] text-white"
                              : "text-black hover:bg-[#72f5b3] hover:text-white",
                            "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className={classNames(
                              activeTab === item.component
                                ? "text-white"
                                : "text-black group-hover:text-white",
                              "size-6 shrink-0"
                            )}
                          />
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>

                <li>
                  <div className="text-xs/6 font-semibold text-black">
                    Features
                  </div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {features.map((item) => (
                      <li
                        key={item.name}
                        onClick={() => setActiveTab(item.component)}
                      >
                        <a
                          href={item.href}
                          className={classNames(
                            activeTab === item.component
                              ? "bg-[#16b766] text-white"
                              : "text-black hover:bg-[#72f5b3] hover:text-white",
                            "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className={classNames(
                              activeTab === item.component
                                ? "text-white"
                                : "text-black group-hover:text-white",
                              "size-6 shrink-0"
                            )}
                          />
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>

                <li>
                  <div className="text-xs/6 font-semibold text-black">
                    Quick Links
                  </div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {teams.map((team) => (
                      <li key={team.name}>
                        <a
                          href={team.href}
                          className={classNames(
                            team.current
                              ? "bg-indigo-700 text-white"
                              : "text-black hover:bg-[#72f5b3] hover:text-white",
                            "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                          )}
                        >
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-[#72f5b3] bg-[#72f5b3] text-[0.625rem] font-medium text-white">
                            {team.initial}
                          </span>
                          <span className="truncate">{team.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="mt-auto">
                  <a
                    onClick={logout}
                    href="#"
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-black hover:bg-[#72f5b3] hover:text-white"
                  >
                    <ArrowLeftStartOnRectangleIcon
                      aria-hidden="true"
                      className="size-6 shrink-0 text-black group-hover:text-white"
                    />
                    Logout
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <main className="p-4 ">{activeTab}</main>
        </div>
      </div>
    </>
  );
}
