import React, { useState } from "react";
import Card from "../../alternatives/common/Card";

import Beans from "../../../assets/crop-images/beans.png";
import Brinjal from "../../../assets/crop-images/brinjal.png";
import Carrot from "../../../assets/crop-images/carrot.png";
import Cabbage from "../../../assets/crop-images/cabbage.png";
import GreenChilli from "../../../assets/crop-images/green-chilli.png";
import Lime from "../../../assets/crop-images/lime.png";
import Potato from "../../../assets/crop-images/potato.png";
import Pumpkin from "../../../assets/crop-images/pumpkin.png";
import SnakeGourd from "../../../assets/crop-images/snake-gourd.png";
import Tomato from "../../../assets/crop-images/tomato.png";

import Avoid from "../../alternatives/recommendations/Avoid2";
import Best from "../../alternatives/recommendations/Best2";

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

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const AlternativeLogs = ({ alternatives }) => {
  const [selectedSession, setSelectedSession] = useState([]);
  const avoid = selectedSession.slice(-3);
  const best = selectedSession.slice(0, 3);
  console.log(selectedSession);

  console.log(alternatives);
  return (
    <div className="w-full h-[90vh] grid grid-cols-12">
      <div className="col-span-4 p-4 overflow-hidden">
        <div className="h-[85vh] flex flex-col gap-2 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#16b766] [&::-webkit-scrollbar-thumb]:rounded-full">
          {/* Card */}
          {alternatives.map((alternative, index) => (
            <div
              key={index}
              className="rounded-xl w-full h-fit grid grid-cols-4 bg-white cursor-pointer transition-opacity hover:opacity-80 duration-300 "
              onClick={() => setSelectedSession(alternative.recommendations)}
            >
              <div className="col-span-2 p-4">
                <div className="text-xs text-gray-400">
                  {new Date(alternative.timestamp).toLocaleString()}
                </div>
                <div className="mt-4 text-sm">
                  <div>Previous Crop: {alternative.previousCrop}</div>
                  <div>
                    Planting Month: {months[alternative.plantingMonth - 1]}
                  </div>
                  <div>
                    Harvesting Month: {months[alternative.harvestMonth - 1]}
                  </div>
                </div>
              </div>
              <div className="col-span-2 p-1">
                <div className="overflow-hidden rounded-xl h-32 w-full">
                  <img
                    className="h-full w-full object-cover"
                    src={
                      images[
                        alternative.previousCrop
                          .toLowerCase()
                          .trim()
                          .replace(/\s/g, "")
                      ]
                    }
                    alt={alternative.previousCrop}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="col-span-8 p-4">
        <div className="h-[85vh]">
          {selectedSession.length > 0 ? (
            <>
              <div className="mb-6">
                <Best images={images} crops={avoid} />
              </div>
              <div className="mt-auto">
                <Avoid images={images} crops={avoid} />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">
                Select a session from the left to view recommendations
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlternativeLogs;
