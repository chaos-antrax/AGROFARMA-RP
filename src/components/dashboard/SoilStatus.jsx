import React, { useState, useEffect } from "react";
import "flatpickr/dist/themes/light.css";
import axios from "axios";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import moment from "moment";

const baseUrl =
  process.env.REACT_APP_SOIL_STATUS_API || "http://127.0.0.1:5000";

const SoilStatus = () => {
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [cropType, setCropType] = useState("");
  const [soilType, setSoilType] = useState("");
  const [phValue, setPhValue] = useState("");
  const [potassium, setPotassium] = useState("");
  const [phosphorus, setPhosphorus] = useState("");
  const [tempMean, setTempMean] = useState("");
  const [daylightDuration, setDaylightDuration] = useState("");
  const [rainSum, setRainSum] = useState("");
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);

  const fetchWeatherData = async (date) => {
    setLoadingWeather(true);
    try {
      const formattedDate = moment(date).format("YYYY-MM-DD");
      const response = await axios.get(
        `${baseUrl}/weather?date=${formattedDate}&latitude=6.9271&longitude=79.8612`
      );
      const data = response.data;
      console.log(data);

      // Set state only if data is available
      setTempMean(
        data.temp_mean_c !== undefined && data.temp_mean_c !== null
          ? data.temp_mean_c
          : ""
      );
      setDaylightDuration(
        data.daylight_duration_hours !== undefined &&
          data.daylight_duration_hours !== null
          ? data.daylight_duration_hours
          : ""
      );
      setRainSum(
        data.rain_sum_mm !== undefined && data.rain_sum_mm !== null
          ? data.rain_sum_mm
          : ""
      );
    } catch (error) {
      console.error("Failed to load weather data", error);
      if (axios.isAxiosError(error)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          weather: `Failed to fetch weather data: ${error.message}. Server responded with ${error.response?.status} status.`,
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          weather: `Failed to fetch weather data: ${error}`,
        }));
      }
      setTempMean("");
      setDaylightDuration("");
      setRainSum("");
    } finally {
      setLoadingWeather(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(selectedDate);
  }, [selectedDate]);

  const validate = () => {
    const newErrors = {};
    const today = moment();
    const selected = moment(selectedDate);
    const diffDays = Math.abs(today.diff(selected, "days"));

    if (diffDays > 7) newErrors.date = "Date must be within 7 days from today.";
    if (!cropType) newErrors.cropType = "Crop type is required.";
    if (!soilType) newErrors.soilType = "Soil type is required.";
    if (!phValue || parseFloat(phValue) < 3.5 || parseFloat(phValue) > 10.0)
      newErrors.phValue = "PH must be between 3.5 and 10.0.";
    if (!potassium || parseFloat(potassium) < 0 || parseFloat(potassium) > 1000)
      newErrors.potassium = "Potassium must be between 0 and 1000.";
    if (
      !phosphorus ||
      parseFloat(phosphorus) < 0 ||
      parseFloat(phosphorus) > 300
    )
      newErrors.phosphorus = "Phosphorus must be between 0 and 300.";
    if (tempMean === "" || isNaN(parseFloat(tempMean)))
      newErrors.tempMean =
        "Average temperature is required and must be a number.";
    if (daylightDuration === "" || isNaN(parseFloat(daylightDuration)))
      newErrors.daylightDuration =
        "Daylight duration is required and must be a number.";
    if (rainSum === "" || isNaN(parseFloat(rainSum)))
      newErrors.rainSum = "Rainfall amount is required and must be a number.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const body = {
      date: moment(selectedDate).format("YYYY-MM-DD"),
      location: "Kandy",
      crop_type: cropType,
      ph_value: parseFloat(phValue),
      "potassium_(ppm)": parseFloat(potassium),
      "phosphorus_(ppm)": parseFloat(phosphorus),
      soil_type: soilType,
      temp_mean_c: parseFloat(tempMean),
      daylight_duration_sec: parseFloat(daylightDuration),
      rain_sum_mm: parseFloat(rainSum),
    };

    try {
      const res = await axios.post(`${baseUrl}/predict`, body);
      setResult(res.data);
    } catch (err) {
      setResult({ error: "Failed to get prediction." });
    }
  };

  const arrangeData = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="flex items-center justify-center w-full h-[96vh] bg-gradient-to-br from-[#a0fbc1] to-white rounded-xl">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Plant Growth Analysis
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Date
                </label>
                <input
                  type="date"
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
                  value={selectedDate}
                  min={moment().startOf("day").format("YYYY-MM-DD")}
                  max={moment()
                    .add(6, "days")
                    .endOf("day")
                    .format("YYYY-MM-DD")}
                  onChange={(e) => arrangeData(e.target.value)}
                  // Make the input field read-only
                />
                {errors.date && (
                  <p className="text-red-500 text-sm">{errors.date}</p>
                )}
              </div>
              {loadingWeather && (
                <p className="text-sm text-gray-500">Loading weather data...</p>
              )}
              {errors.weather && (
                <p className="text-red-500 text-sm">{errors.weather}</p>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Crop Type
                </label>
                <select
                  className="block w-full border-gray-300 rounded-md"
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                >
                  <option value="">Select</option>
                  {["Tomato", "Brinjal", "Bean", "Cabbage", "Capsicum"].map(
                    (crop) => (
                      <option key={crop} value={crop}>
                        {crop}
                      </option>
                    )
                  )}
                </select>
                {errors.cropType && (
                  <p className="text-red-500 text-sm">{errors.cropType}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Soil Type
                </label>
                <select
                  className="block w-full border-gray-300 rounded-md"
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                >
                  <option value="">Select</option>
                  {["Clay Loam", "Sand", "Sandy Clay Loam", "Sandy Loam"].map(
                    (soil) => (
                      <option key={soil} value={soil}>
                        {soil}
                      </option>
                    )
                  )}
                </select>
                {errors.soilType && (
                  <p className="text-red-500 text-sm">{errors.soilType}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    PH Value
                  </label>
                  <input
                    type="number"
                    className="block w-full border-gray-300 rounded-md"
                    value={phValue}
                    onChange={(e) => setPhValue(e.target.value)}
                  />
                  {errors.phValue && (
                    <p className="text-red-500 text-sm">{errors.phValue}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Potassium (ppm)
                  </label>
                  <input
                    type="number"
                    className="block w-full border-gray-300 rounded-md"
                    value={potassium}
                    onChange={(e) => setPotassium(e.target.value)}
                  />
                  {errors.potassium && (
                    <p className="text-red-500 text-sm">{errors.potassium}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phosphorus (ppm)
                </label>
                <input
                  type="number"
                  className="block w-full border-gray-300 rounded-md"
                  value={phosphorus}
                  onChange={(e) => setPhosphorus(e.target.value)}
                />
                {errors.phosphorus && (
                  <p className="text-red-500 text-sm">{errors.phosphorus}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Average Temperature (°C)
                  </label>
                  <input
                    type="number"
                    className="block w-full border-gray-300 rounded-md bg-gray-100"
                    value={tempMean}
                    onChange={(e) => setTempMean(e.target.value)}
                    readOnly
                  />
                  {errors.tempMean && (
                    <p className="text-red-500 text-sm">{errors.tempMean}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Daylight Duration
                  </label>
                  <input
                    type="number"
                    className="block w-full border-gray-300 rounded-md bg-gray-100"
                    value={daylightDuration}
                    onChange={(e) => setDaylightDuration(e.target.value)}
                    readOnly
                  />
                  {errors.daylightDuration && (
                    <p className="text-red-500 text-sm">
                      {errors.daylightDuration}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rainfall (mm)
                </label>
                <input
                  type="number"
                  className="block w-full border-gray-300 rounded-md bg-gray-100"
                  value={rainSum}
                  onChange={(e) => setRainSum(e.target.value)}
                  readOnly
                />
                {errors.rainSum && (
                  <p className="text-red-500 text-sm">{errors.rainSum}</p>
                )}
              </div>

              <button
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                onClick={handleSubmit}
              >
                Start Growth Analysis
              </button>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 pb-2">
                Result
              </h3>
              <div className="bg-gray-50 rounded-md p-4 min-h-[100px]">
                {result ? (
                  result.error ? (
                    <p className="text-red-500">{result.error}</p>
                  ) : (
                    <>
                      {result.predicted_class === "Suitable" &&
                        result.confidence >= 0.6 && (
                          <p className="text-gray-700">
                            Growth success rate:{" "}
                            <span className="font-bold">
                              {Math.round(result.confidence * 100)}%
                            </span>
                          </p>
                        )}

                      {result.predicted_class === "Suitable" ? (
                        <div className="flex items-center gap-2 mt-2">
                          <CheckCircleIcon className="h-6 w-6 text-green-600" />
                          <span className="text-green-700 font-medium">
                            Suitable for growth
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mt-2">
                          <XCircleIcon className="h-6 w-6 text-red-600" />
                          <span className="text-red-700 font-medium">
                            Not suitable for growth
                          </span>
                        </div>
                      )}
                    </>
                  )
                ) : (
                  <p className="text-gray-500">No analysis performed yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoilStatus;
