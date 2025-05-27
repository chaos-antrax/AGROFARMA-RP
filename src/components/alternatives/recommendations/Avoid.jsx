import React from "react";
import Card from "../common/Card";

const avoid_crops = ["Carrot", "Brinjal", "Tomato", "Cabbage", "Leeks"];

const Avoid = ({ crops, images }) => {
  return (
    <div className="pt-24 px-16 grid gap-2">
      <Card
        className="text-center text-lg font-bold"
        rounded="rounded-3xl"
        padding={"p-0 py-2"}
      >
        Crops to Avoid
      </Card>
      <Card
        className="grid grid-cols-2 gap-2"
        rounded="rounded-3xl"
        padding="p-2"
      >
        {crops.map((crop, index) => (
          <Card
            key={index}
            className="col-span-2 items-center grid grid-cols-4 overflow-hidden"
            rounded="rounded-3xl"
            bgColor="bg-[#ffe2e2]"
            padding="p-0"
          >
            <div className="col-span-2 max-h-20 flex items-center justify-center overflow-hidden">
              <img
                src={images[crop.crop.toLowerCase().trim().replace(/\s/g, "")]}
                alt={crop.crop}
                className=""
              />
            </div>
            <div className="col-span-2 flex justify-between items-center px-10 w-full">
              <div>{crop.crop}</div>
            </div>
          </Card>
        ))}
      </Card>
    </div>
  );
};

export default Avoid;
