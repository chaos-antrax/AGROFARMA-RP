import React, { useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import moment from "moment";
import axios from "axios";

const CostAnalysis = () => {
  const [predictionResult1, setPredictionResult1] = useState(null);
  const [predictionResult2, setPredictionResult2] = useState(null);

  const [date, setDate] = useState(new Date());
  const [market1, setMarket1] = useState("Local");
  const [type1, setType1] = useState("Fresh");
  const [vegetable1, setVegetable1] = useState("Tomato");
  const [rainfall1, setRainfall1] = useState("");
  const [temperature1, setTemperature1] = useState("");
  const [fuelType1, setFuelType1] = useState("LP_92");

  const [market2, setMarket2] = useState("Local");
  const [type2, setType2] = useState("Fresh");
  const [vegetable2, setVegetable2] = useState("Tomato");
  const [rainfall2, setRainfall2] = useState("");
  const [temperature2, setTemperature2] = useState("");
  const [fuelType2, setFuelType2] = useState("LP_92");

  const backendURL = "http://127.0.0.1:5000"; // Base URL
  const marketPriceEndpoint = "/predict_price"; // Endpoint 1
  const fuelPriceEndpoint = "/predict_fuel_price"; // Endpoint 2

  // New State for Fuel Price Prediction
  const [fuelDate, setFuelDate] = useState(new Date());
  const [fuelPricePrediction, setFuelPricePrediction] = useState(null);
  const [transportMode, setTransportMode] = useState("");
  const [startCity, setStartCity] = useState("");
  const [endCity, setEndCity] = useState("");
  const [totalWeight, setTotalWeight] = useState("");
  const [packagingType, setPackagingType] = useState("");

  function calculateTransportCost(
    fuelPrice,
    vehicleType,
    totalWeight,
    startCity,
    endCity
  ) {
    // Define constants for each vehicle type
    const FUEL_EFFICIENCY = {
      lorry: 15, // km/L
      threeWheel: 15, // km/L
    };

    const VEHICLE_LOAD_CAPACITY = {
      lorry: 1000, // kg
      threeWheel: 350, // kg
    };

    // Get distance between cities
    function getDistance(startCity, endCity) {
      if (startCity === "Anuradhapura" && endCity === "Dambulla") {
        return 63;
      } else if (startCity === "Kandy" && endCity === "Pettah") {
        return 113;
      } else if (startCity === "Kandy" && endCity === "Dambulla") {
        return 92;
      } else if (startCity === "Anuradhapura" && endCity === "Pettah") {
        return 204;
      } else if (startCity === "Dambulla" && endCity === "Anuradhapura") {
        return 63;
      } else if (startCity === "Pettah" && endCity === "Kandy") {
        return 113;
      } else if (startCity === "Dambulla" && endCity === "Kandy") {
        return 92;
      } else if (startCity === "Pettah" && endCity === "Anuradhapura") {
        return 204;
      } else {
        console.log("Error: Unknown route between these cities");
        return null;
      }
    }

    // Input validation
    if (!fuelPrice || !vehicleType || !totalWeight || !startCity || !endCity) {
      console.log("Error: Missing required parameters");
      return null;
    }

    // Validate vehicle type
    if (vehicleType !== "lorry" && vehicleType !== "threeWheel") {
      console.log(
        "Error: Invalid vehicle type. Must be 'lorry' or 'threeWheel'"
      );
      return null;
    }

    // Get distance based on cities
    const distance = getDistance(startCity, endCity);
    if (distance === null) {
      return null;
    }

    // Step 1: Calculate Fuel Cost per km
    const fuelEfficiency = FUEL_EFFICIENCY[vehicleType];
    const fuelCostPerKm = fuelPrice / fuelEfficiency;
    console.log(`Fuel Cost per km: Rs. ${fuelCostPerKm.toFixed(2)}`);

    // Step 2: Calculate Total Fuel Cost (round trip - multiply by 2)
    const totalFuelCost = fuelCostPerKm * distance * 2;
    console.log(`Total Fuel Cost: Rs. ${totalFuelCost.toFixed(2)}`);

    // Step 3: Calculate Transport Cost (Rs./Kg)
    const vehicleLoadCapacity = VEHICLE_LOAD_CAPACITY[vehicleType];
    const transportCost = totalFuelCost / vehicleLoadCapacity;
    console.log(`Transport Cost: Rs. ${transportCost.toFixed(2)} per kg`);

    // Step 4: Calculate total cost for given weight
    const totalTransportCost = transportCost * totalWeight;
    console.log(
      `Total Transport Cost for ${totalWeight}kg: Rs. ${totalTransportCost.toFixed(
        2
      )}`
    );

    return {
      distance,
      fuelCostPerKm,
      totalFuelCost,
      transportCostPerKg: transportCost,
      totalTransportCost,
    };
  }

  const handleDateChange = (dates) => {
    if (dates && dates.length > 0) {
      setDate(dates[0]);
    }
  };

  const handleFuelDateChange = (dates) => {
    if (dates && dates.length > 0) {
      setFuelDate(dates[0]);
    }
  };

  const handlePredictPrice1 = async () => {
    await handlePredictPrice(1, setPredictionResult1);
  };

  const handlePredictPrice2 = async () => {
    await handlePredictPrice(2, setPredictionResult2);
  };

  const handlePredictPrice = async (section, setPredictionResult) => {
    const requestBody = {
      Date: moment(date).format("YYYY-MM-DD"),
      Market: section === 1 ? market1 : market2,
      Type: section === 1 ? type1 : type2,
      Vegetable: section === 1 ? vegetable1 : vegetable2,
      Rainfall: parseFloat(section === 1 ? rainfall1 : rainfall2),
      Temperature: parseFloat(section === 1 ? temperature1 : temperature2),
    };

    try {
      const response = await axios.post(
        `${backendURL}${marketPriceEndpoint}`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setPredictionResult(response.data);
    } catch (error) {
      console.error("Error fetching prediction:", error);
      setPredictionResult({ predicted_price: "Error", error: error.message });
    }
  };

  const handlePredictFuelPrice = async () => {
    const requestBody = {
      Date: moment(fuelDate).format("YYYY-MM-DD"),
    };
    const result = calculateTransportCost(
      200,
      100,
      "threeWheel",
      500,
      "Anuradhapura",
      "Dambulla"
    );
    console.log(result);
    try {
      const response = await axios.post(
        `${backendURL}${fuelPriceEndpoint}`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setFuelPricePrediction(response.data);
    } catch (error) {
      console.error("Error fetching fuel price prediction:", error);
      setFuelPricePrediction({ error: error.message });
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-[95vh] bg-gradient-to-br from-[#a0fbc1] to-white rounded-xl">
      {/* <div className="absolute bg-[#72f5b3] w-[100vh] h-[100vh] rounded-3xl rotate-[20deg] left-[-48%] top-[-2%] z-0" /> */}
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Market Price Prediction
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Section 1 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Market Prediction
              </h3>
              <div className="space-y-4">
                {/* Market Price Prediction Inputs */}
                {/* (Existing code for Market Price Prediction) */}
                <div>
                  <label
                    htmlFor="date1"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date:
                  </label>
                  <Flatpickr
                    id="date1"
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    options={{ dateFormat: "Y-m-d", defaultDate: date }}
                    onChange={handleDateChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="market1"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Market:
                  </label>
                  <select
                    id="market1"
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={market1}
                    onChange={(e) => setMarket1(e.target.value)}
                  >
                    <option value="Dambulla">Dambulla</option>
                    <option value="Pettah">Pettah</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="vegetable1"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Vegetable:
                  </label>
                  <select
                    id="vegetable1"
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={vegetable1}
                    onChange={(e) => setVegetable1(e.target.value)}
                  >
                    <option value="Carrot">Carrot</option>
                    <option value="Tomato">Tomato</option>
                    <option value="Cabbage">Cabbage</option>
                    <option value="Beans">Beans</option>
                    <option value="Snake gourd">Snake gourd</option>
                    <option value="Brinjal">Brinjal</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="fuelType1"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fuel Type:
                  </label>
                  <select
                    id="fuelType1"
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={fuelType1}
                    onChange={(e) => setFuelType1(e.target.value)}
                  >
                    <option value="LP 92">LP 92</option>
                    <option value="LAD">LAD</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="rainfall1"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Rainfall:
                    </label>
                    <input
                      type="number"
                      id="rainfall1"
                      className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={rainfall1}
                      onChange={(e) => setRainfall1(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="temperature1"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Temperature:
                    </label>
                    <input
                      type="number"
                      id="temperature1"
                      className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={temperature1}
                      onChange={(e) => setTemperature1(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  onClick={handlePredictPrice1}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Predict Price
                </button>

                {predictionResult1 ? (
                  <div className="mt-2">
                    <p className="text-gray-600">
                      Predicted Price: {predictionResult1.predicted_price}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Section 2 */}
            {/* Fuel Price Prediction */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Profit / Loss analysis
              </h3>
              <p>Based on transport and storage Cost</p>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="fuelDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date:
                  </label>
                  <Flatpickr
                    id="fuelDate"
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    options={{ dateFormat: "Y-m-d", defaultDate: fuelDate }}
                    onChange={handleFuelDateChange}
                  />
                </div>

                {/* Transport Mode Dropdown */}
                <div>
                  <label
                    htmlFor="transportMode"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Transport Mode:
                  </label>
                  <select
                    id="transportMode"
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={transportMode}
                    onChange={(e) => setTransportMode(e.target.value)}
                  >
                    <option value="">Select Transport Mode</option>
                    <option value="Threewheel">Threewheel</option>
                    <option value="Lorry">Lorry</option>
                  </select>
                </div>

                {/* Start City Dropdown */}
                <div>
                  <label
                    htmlFor="startCity"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start City:
                  </label>
                  <select
                    id="startCity"
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={startCity}
                    onChange={(e) => setStartCity(e.target.value)}
                  >
                    <option value="">Select Start City</option>
                    <option value="Kurunegala">Kurunegala</option>
                    <option value="Nuwara eliya">Nuwara Eliya</option>
                    <option value="Anuradhapura">Anuradhapura</option>
                    <option value="Badulla">Badulla</option>
                    <option value="Kandy">Kandy</option>
                  </select>
                </div>

                {/* End City Dropdown */}
                <div>
                  <label
                    htmlFor="endCity"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End City:
                  </label>
                  <select
                    id="endCity"
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={endCity}
                    onChange={(e) => setEndCity(e.target.value)}
                  >
                    <option value="">Select End City</option>
                    <option value="Dambulla">Dambulla</option>
                    <option value="Pettah">Pettah</option>
                  </select>
                </div>

                {/* Total Weight Input */}
                <div>
                  <label
                    htmlFor="totalWeight"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Total Weight:
                  </label>
                  <input
                    type="number"
                    id="totalWeight"
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={totalWeight}
                    onChange={(e) => setTotalWeight(e.target.value)}
                  />
                </div>

                {/* Packaging Type Dropdown */}
                <div>
                  <label
                    htmlFor="packagingType"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Packaging Type:
                  </label>
                  <select
                    id="packagingType"
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={packagingType}
                    onChange={(e) => setPackagingType(e.target.value)}
                  >
                    <option value="">Select Packaging Type</option>
                    <option value="Gunny Bags">Gunny Bags</option>
                    <option value="Plastic Crates">Plastic Crates</option>
                  </select>
                </div>

                <button
                  onClick={handlePredictFuelPrice}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Predict Profit/Loss
                </button>

                {fuelPricePrediction ? (
                  <div className="mt-2">
                    {fuelPricePrediction.error ? (
                      <p className="text-red-500">
                        Error: {fuelPricePrediction.error}
                      </p>
                    ) : (
                      <>
                        <p className="text-gray-600">
                          Predicted Diesel Price:{" "}
                          {fuelPricePrediction.predicted_diesel_price * 40}
                        </p>
                        <p className="text-gray-600">
                          Predicted Petrol Price:{" "}
                          {fuelPricePrediction.predicted_petrol_price}
                        </p>
                        {/* Store these values for later calculations. */}
                        {/* transportMode ,startCity , endCity , totalWeight ,packagingType 
                             now i can store these value but can not calculate becuase that implentations for other part. */}
                      </>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostAnalysis;
