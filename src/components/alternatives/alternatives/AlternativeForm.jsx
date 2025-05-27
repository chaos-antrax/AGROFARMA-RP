import React, { useState } from "react";
import Card from "../common/Card";
import Input from "../common/Input";
import Button from "../common/Button";

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

const AlternativeForm = ({ vegetables, onSubmit }) => {
  const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-indexed

  const [formState, setFormState] = useState({
    plantingMonth: currentMonth,
    targetMonth: "",
    previousCrop: "",
    desiredCrop: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert month strings to integers for API
    const payload = {
      ...formState,
      plantingMonth: parseInt(formState.plantingMonth),
      targetMonth: parseInt(formState.targetMonth),
    };
    // console.log(formState);
    onSubmit(payload);
  };

  const inputFields = [
    {
      name: "previousCrop",
      placeholder: "I just harvested...",
      options: vegetables,
      value: formState.previousCrop,
    },
    {
      name: "desiredCrop",
      placeholder: "I want to grow...",
      options: vegetables,
      value: formState.desiredCrop,
    },
    {
      name: "targetMonth", // Changed from harvest_month
      placeholder: "Expected harvesting month...",
      options: months,
      value: formState.targetMonth,
    },
    // {
    //   name: "plantingMonth", // Changed from planting_month
    //   placeholder: "I planted on...",
    //   options: months,
    //   value: formState.plantingMonth,
    // },
  ];

  return (
    <div className="grid w-full grid-cols-4 items-center justify-center z-50">
      <div className="col-start-2 col-span-2 grid gap-4">
        <Card padding="p-2">
          <h1 className="text-xl text-center font-semibold">
            Crop Recommendations
          </h1>
        </Card>
        <Card className="flex gap-4 flex-col" padding="p-2">
          <form className="grid grid-flow-row gap-4" onSubmit={handleSubmit}>
            {inputFields.map((field, index) => (
              <select
                className="px-4 py-2 bg-[#e9f1ee] w-full rounded-lg text-lg"
                name={field.name}
                key={index}
                value={field.value}
                onChange={handleChange}
              >
                <option>{field.placeholder}</option>
                {field.options.map((option, index) => (
                  <option key={index} value={option.value || option}>
                    {option.label || option}
                  </option>
                ))}
              </select>
            ))}
            <span className="text-gray-400 text-center">
              Right now it is{" "}
              {months.find((month) => month.value === currentMonth)?.label}
            </span>
            {/* <div className="flex gap-4 items-center">
              <input type="checkbox" />
              Skip Soil Acidity*
            </div> */}
            <div>
              <Button type="submit">Get Recommendations</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AlternativeForm;
