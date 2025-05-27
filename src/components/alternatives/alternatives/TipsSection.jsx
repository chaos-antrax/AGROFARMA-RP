import React from "react";
import Card from "../common/Card";

const tips = [
  {
    title: "pH Strip Test",
    content:
      "Take a small sample of soil and mix it with distilled waterto create a slurry. Dip a pH strip into the mixture and compare the color change to the provided scale to determine the pH level.",
  },
  {
    title: "Baking Soda and Vinegar Test",
    content:
      "Take two small containers of soil. Pour vinegar onto one sample; if it fizzes, the soil is alkaline. On the other sample, add water and sprinkle baking soda; fizzing indicated acidicity.",
  },
  {
    title: "Cabbage Juice Indicator",
    content:
      "Boild red cabbage in water and let the water cool to create a natural pH indicator. Mix this cabbage water with soil slurry. Observe the color change: red indicates acidic soil, green/blue indicates neutral to alkaline soil.",
  },
];

const TipsSection = () => {
  return (
    <div className="flex flex-col h-lvh justify-center gap-10 pr-20">
      <div>
        <h1 className="text-xl font-bold">Don't know your Soil Acidity?</h1>
        <span>Try one of these simple tests and find out for yourself!</span>
      </div>
      <div className="grid gap-6">
        {tips.map((tip, index) => (
          <div key={index} className="text-xl font-bold grid gap-4">
            <h1>{tip.title}</h1>
            <Card>
              <p className="text-base font-normal">{tip.content}</p>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TipsSection;
