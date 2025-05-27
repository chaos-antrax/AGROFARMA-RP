import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../alternatives/common/Card";

import ProfitAnalysisLogs from "./logs/ProfitAnalysisLogs";
import AssistanceLogs from "./logs/AssistanceLogs";
import GrowthAnalysisLogs from "./logs/GrowthAnalysisLogs";
import AlternativeLogs from "./logs/AlternativeLogs";

const Log = () => {
  const [sessions, setSessions] = useState(null);
  const [activeSection, setActiveSection] = useState(<GrowthAnalysisLogs />);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

        const response = await axios.get("http://localhost:8000/api/sessions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSessions(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, []);

  console.log(sessions);

  const alternatives = sessions?.alternatives || [];
  const soilScores = sessions?.soilScores || [];
  const profitabilityScores = sessions?.profitabilityScores || [];

  console.log(alternatives);

  const tabs = [
    {
      name: "Alternatives",
      component: <AlternativeLogs alternatives={alternatives} />,
    },
    { name: "Profit Analysis", component: <ProfitAnalysisLogs /> },
    { name: "Growth Analysis", component: <GrowthAnalysisLogs /> },
    { name: "Assistance", component: <AssistanceLogs /> },
  ];

  return (
    <div className=" rounded-xl h-[96vh] overflow-hidden">
      <div className="w-full flex">
        <div className="bg-white flex w-full gap-4">
          {tabs.map((tab, index) => (
            <div
              className={`z-100 col-span-2 border my-2 rounded-xl w-full py-2 font-semibold ${
                activeSection.type === tab.component.type
                  ? "bg-[#16b766] text-white hover:text-black"
                  : ""
              } text-center hover:bg-[#d0ffda] cursor-pointer`}
              key={index}
              rounded="rounded-0 hover:bg-gray-100 cursor-pointer"
              onClick={() => setActiveSection(tab.component)}
            >
              {tab.name}
            </div>
          ))}
        </div>
      </div>
      <div className="w-full h-full rounded-t-xl bg-gradient-to-br from-[#a0fbc1] to-white">
        {activeSection}
      </div>
    </div>
  );
};

export default Log;
