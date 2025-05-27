import React, { useState } from "react";
import axios from "axios";
import Avoid from "../../components/alternatives/recommendations/Avoid";
import Best from "../../components/alternatives/recommendations/Best";
import Card from "../../components/alternatives/common/Card";
import Beans from "../../assets/crop-images/beans.png";
import Brinjal from "../../assets/crop-images/brinjal.png";
import Carrot from "../../assets/crop-images/carrot.png";
import Cabbage from "../../assets/crop-images/cabbage.png";
import GreenChilli from "../../assets/crop-images/green-chilli.png";
import Lime from "../../assets/crop-images/lime.png";
import Potato from "../../assets/crop-images/potato.png";
import Pumpkin from "../../assets/crop-images/pumpkin.png";
import SnakeGourd from "../../assets/crop-images/snake-gourd.png";
import Tomato from "../../assets/crop-images/tomato.png";
import Button from "../../components/alternatives/common/Button";

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const images = {
  beans: Beans,
  brinjal: Brinjal,
  carrot: Carrot,
  cabbage: Cabbage,
  greenchilli: GreenChilli,
  lime: Lime,
  potato: Potato,
  pumpkin: Pumpkin,
  snakegourd: SnakeGourd,
  tomato: Tomato,
};

const Recommendations = ({ recommendations }) => {
  const [saveStatus, setSaveStatus] = useState(null);

  const previousCrop = recommendations.previousCrop;
  const plantingMonth = recommendations.plantingMonth;
  const harvestMonth = recommendations.harvestMonth;
  const recs = recommendations.recommendations;
  const sortedRecommendations = recs.sort(
    (a, b) => b.finalScore - a.finalScore
  );

  const best = sortedRecommendations.slice(0, 3);
  const avoid = sortedRecommendations.slice(-3);

  const handleSaveSession = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setSaveStatus("No token found. Please log in again.");
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/api/sessions/alternatives",
        {
          harvestMonth,
          plantingMonth,
          previousCrop,
          recommendations: sortedRecommendations,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setSaveStatus("Session saved successfully!");
      } else {
        setSaveStatus("Failed to save session.");
      }
    } catch (error) {
      console.error("Save session error:", error);
      setSaveStatus("An error occurred while saving.");
    }
  };

  return (
    <div className="h-[96vh] overflow-hidden rounded-xl bg-gradient-to-br from-[#a0fbc1] to-white px-40">
      <div className="pt-12 px-16">
        <Card rounded="rounded-3xl" padding="p-0" className="overflow-hidden">
          <div className="grid grid-cols-4 max-h-44">
            <div className="col-span-1 p-6">
              <h2 className="font-semibold text-xl pb-4">Your Query</h2>
              <span>Previous Crop : {previousCrop}</span>
              <br />
              <span>Month Planted : {plantingMonth}</span>
              <br />
              <span>Harvesting Month : {harvestMonth}</span>
            </div>
            <div className="col-span-3 m-1 rounded-2xl max-h-40 overflow-y-hidden">
              <img
                src={
                  images[previousCrop.toLowerCase().trim().replace(/\s/g, "")]
                }
                alt={previousCrop}
                className=""
              />
            </div>
          </div>
        </Card>
      </div>
      <div className="mt-[-60px] grid grid-cols-2">
        <div className="col-span-1">
          <Avoid crops={avoid} images={images} />
        </div>
        <div className="col-span-1">
          <Best crops={best} images={images} />
        </div>
      </div>
      <div className="text-center text-sm mt-10 text-gray-500">
        Save your session so that you may refer to it at a later date.
      </div>
      <div className="flex items-center justify-center mt-4">
        <div className="">
          <button
            onClick={handleSaveSession}
            className={`p-4 px-20 rounded-xl text-xl font-semibold tracking-wide ${
              saveStatus?.includes("success")
                ? "bg-gray-300 text-white"
                : "bg-[#f7c35f]"
            }`}
            disabled={saveStatus?.includes("success")}
          >
            {saveStatus?.includes("success") ? "Done!" : "Save Session"}
          </button>
          {saveStatus && (
            <div
              className={`text-md text-center mt-4 ${
                saveStatus.includes("success")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {saveStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
