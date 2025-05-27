import React, { useState, useEffect } from "react";
import "flatpickr/dist/themes/light.css";
import axios from "axios";
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  PlantIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/solid"; // Added ClipboardDocumentListIcon
import moment from "moment";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import HistoryPage from "./HistoryPage";

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
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const navigate = useNavigate(); // Initialize navigate

  const fertilizerRecommendations = {
    Tomato: { urea: 65, tsp: 325, mop: 65 },
    Bean: { urea: 110, tsp: 270, mop: 75 },
    Brinjal: { urea: 75, tsp: 325, mop: 85 },
    Cabbage: { urea: 110, tsp: 270, mop: 75 },
    Capsicum: { urea: 100, tsp: 215, mop: 65 },
  };

  const fetchWeatherData = async (date) => {
    setLoadingWeather(true);
    setErrors((prevErrors) => ({ ...prevErrors, weather: undefined }));
    try {
      const formattedDate = moment(date).format("YYYY-MM-DD");
      const response = await axios.get(
        `${baseUrl}/weather?date=${formattedDate}&latitude=6.9271&longitude=79.8612`
      );
      const data = response.data;

      setTempMean(data.temp_mean_c ?? "");
      setDaylightDuration(data.daylight_duration_hours ?? "");
      setRainSum(data.rain_sum_mm ?? "");
    } catch (error) {
      console.error("Failed to load weather data", error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        weather: `Failed to fetch weather data. Please ensure the backend is running. ${
          axios.isAxiosError(error)
            ? `(${error.response?.status || error.message})`
            : ""
        }`,
      }));
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

    setLoadingPrediction(true);
    setResult(null);
    setErrors((prevErrors) => ({ ...prevErrors, prediction: undefined }));

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

      if (!res.data.error) {
        const recommendation = fertilizerRecommendations[cropType] || {};
        const historyRef = collection(db, "soilAnalysisHistory");
        await addDoc(historyRef, {
          date: body.date,
          cropType,
          soilType,
          phValue: body.ph_value,
          potassium: body["potassium_(ppm)"],
          phosphorus: body["phosphorus_(ppm)"],
          tempMean: body.temp_mean_c,
          daylightDuration: body.daylight_duration_sec,
          rainSum: body.rain_sum_mm,
          predictedClass: res.data.predicted_class,
          confidence: res.data.confidence,
          urea: recommendation.urea || null,
          tsp: recommendation.tsp || null,
          mop: recommendation.mop || null,
          createdAt: Timestamp.now(),
        });
      }
    } catch (err) {
      console.error("Failed to get prediction", err);
      setResult({
        error:
          "Failed to get prediction. Please check your inputs and ensure the backend is running.",
      });
      setErrors((prevErrors) => ({
        ...prevErrors,
        prediction: `Prediction failed: ${
          axios.isAxiosError(err)
            ? err.response?.data?.message || err.message
            : err.message
        }`,
      }));
    } finally {
      setLoadingPrediction(false);
    }
  };

  const handleReset = () => {
    setSelectedDate(moment().format("YYYY-MM-DD"));
    setCropType("");
    setSoilType("");
    setPhValue("");
    setPotassium("");
    setPhosphorus("");
    setTempMean("");
    setDaylightDuration("");
    setRainSum("");
    setLoadingWeather(false);
    setLoadingPrediction(false);
    setErrors({});
    setResult(null);
  };

  const handleViewHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-br from-[#a0fbc1] to-white p-4 sm:p-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.005] ring-1 ring-gray-100">
        <div className="px-6 py-8 sm:px-10 sm:py-12">
          {showHistory === true ? (
            <div className="absolute bg-white w-full h-full top-0 left-0">
              <HistoryPage handleViewHistory={handleViewHistory} />
            </div>
          ) : (
            ""
          )}

          <h2 className="text-4xl font-extrabold text-gray-800 mb-4 text-center flex items-center justify-center gap-3">
            <span className="text-green-600">🌱</span> Plant Growth Suitability
            Analysis
          </h2>
          <p className="text-center text-gray-600 mb-10 text-lg">
            Enter your soil and environmental data to predict crop growth
            suitability and get personalized fertilizer recommendations.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
            {/* Input Section */}
            <div className="space-y-6 bg-green-50 p-6 rounded-xl shadow-inner border border-green-100">
              <h3 className="text-2xl font-bold text-green-800 mb-4">
                Input Data
              </h3>
              <div>
                <label
                  htmlFor="selectedDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Select Date (within 7 days)
                </label>
                <input
                  id="selectedDate"
                  type="date"
                  className="block w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
                  value={selectedDate}
                  min={moment().subtract(7, "days").format("YYYY-MM-DD")}
                  max={moment().add(7, "days").format("YYYY-MM-DD")}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
                {errors.date && (
                  <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                )}
                {loadingWeather && (
                  <p className="text-sm text-gray-500 mt-2 flex items-center">
                    <ArrowPathIcon className="h-4 w-4 animate-spin mr-2 text-green-500" />
                    Loading weather data...
                  </p>
                )}
                {errors.weather && (
                  <p className="text-red-500 text-xs mt-1">{errors.weather}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="cropType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Crop Type
                </label>
                <select
                  id="cropType"
                  className="block w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                >
                  <option value="">Select a crop</option>
                  {["Tomato", "Brinjal", "Bean", "Cabbage", "Capsicum"].map(
                    (crop) => (
                      <option key={crop} value={crop}>
                        {crop}
                      </option>
                    )
                  )}
                </select>
                {errors.cropType && (
                  <p className="text-red-500 text-xs mt-1">{errors.cropType}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="soilType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Soil Type
                </label>
                <select
                  id="soilType"
                  className="block w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                >
                  <option value="">Select a soil type</option>
                  {["Clay Loam", "Sand", "Sandy Clay Loam", "Sandy Loam"].map(
                    (soil) => (
                      <option key={soil} value={soil}>
                        {soil}
                      </option>
                    )
                  )}
                </select>
                {errors.soilType && (
                  <p className="text-red-500 text-xs mt-1">{errors.soilType}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="phValue"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    PH Value (3.5 - 10.0)
                  </label>
                  <input
                    id="phValue"
                    type="number"
                    step="0.1"
                    className="block w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
                    value={phValue}
                    onChange={(e) => setPhValue(e.target.value)}
                  />
                  {errors.phValue && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.phValue}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="potassium"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Potassium (ppm) (0 - 1000)
                  </label>
                  <input
                    id="potassium"
                    type="number"
                    className="block w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
                    value={potassium}
                    onChange={(e) => setPotassium(e.target.value)}
                  />
                  {errors.potassium && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.potassium}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="phosphorus"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phosphorus (ppm) (0 - 300)
                </label>
                <input
                  id="phosphorus"
                  type="number"
                  className="block w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
                  value={phosphorus}
                  onChange={(e) => setPhosphorus(e.target.value)}
                />
                {errors.phosphorus && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phosphorus}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="tempMean"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Avg. Temperature (°C)
                  </label>
                  <input
                    id="tempMean"
                    type="number"
                    className="block w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed"
                    value={tempMean}
                    readOnly
                    disabled={loadingWeather}
                  />
                  {errors.tempMean && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.tempMean}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="daylightDuration"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Daylight Duration (hours)
                  </label>
                  <input
                    id="daylightDuration"
                    type="number"
                    className="block w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed"
                    value={daylightDuration}
                    readOnly
                    disabled={loadingWeather}
                  />
                  {errors.daylightDuration && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.daylightDuration}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="rainSum"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Rainfall (mm)
                </label>
                <input
                  id="rainSum"
                  type="number"
                  className="block w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed"
                  value={rainSum}
                  readOnly
                  disabled={loadingWeather}
                />
                {errors.rainSum && (
                  <p className="text-red-500 text-xs mt-1">{errors.rainSum}</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
                {/* New History Button */}
                <button
                  className="flex items-center justify-center px-6 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out shadow-sm"
                  onClick={handleViewHistory}
                  disabled={loadingPrediction || loadingWeather}
                >
                  <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
                  View History
                </button>
                <button
                  className="flex items-center justify-center px-6 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out shadow-sm"
                  onClick={handleReset}
                  disabled={loadingPrediction || loadingWeather}
                >
                  <ArrowPathIcon className="h-5 w-5 mr-2" />
                  Reset Form
                </button>
                <button
                  className="flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSubmit}
                  disabled={loadingPrediction || loadingWeather}
                >
                  {loadingPrediction ? (
                    <ArrowPathIcon className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    "Start Growth Analysis"
                  )}
                </button>
              </div>
            </div>

            {/* Result Section */}

            <div className="flex-grow bg-white rounded-xl p-6 min-h-[300px] flex flex-col justify-center items-start shadow-md">
              {errors.prediction && (
                <div className="text-red-600 bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-4 w-full">
                  <p className="font-semibold">Error:</p>
                  <p className="text-sm">{errors.prediction}</p>
                </div>
              )}
              {result ? (
                result.error ? (
                  <div className="text-red-600 bg-red-50 border-l-4 border-red-500 p-4 rounded-md w-full">
                    <p className="font-bold">Prediction Error:</p>
                    <p>{result.error}</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-6 flex items-center gap-4">
                      <p className="text-xl font-medium text-gray-700">
                        Growth Suitability:{" "}
                        <span
                          className={`${
                            result.predicted_class === "Suitable"
                              ? "text-green-700"
                              : "text-red-700"
                          } font-extrabold text-2xl`}
                        >
                          {result.predicted_class}
                        </span>
                      </p>
                      {result.confidence !== undefined &&
                        result.confidence !== null && (
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              result.predicted_class === "Suitable"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            Confidence: {Math.round(result.confidence * 100)}%
                          </span>
                        )}
                    </div>

                    {result.predicted_class === "Suitable" &&
                    result.confidence >= 0.5 ? (
                      <>
                        <div className="flex items-center gap-2 text-green-700 font-bold text-lg mb-6 p-3 bg-green-50 rounded-md border border-green-200">
                          <CheckCircleIcon className="h-8 w-8 text-green-600" />
                          <span>
                            Great news! Conditions are highly suitable for
                            growth.
                          </span>
                        </div>

                        {fertilizerRecommendations[cropType] ? (
                          <div className="bg-white p-6 rounded-lg border border-green-300 shadow-lg w-full">
                            <h4 className="text-green-700 font-bold mb-4 text-xl flex items-center">
                              <span className="mr-2 text-2xl">🌿</span>
                              Fertilizer Recommendation (kg/ha)
                            </h4>
                            <ul className="text-base space-y-3 text-gray-800">
                              <li className="flex justify-between items-center pb-2 border-b border-gray-100">
                                <strong className="text-gray-600">Urea:</strong>
                                <span className="font-semibold text-right text-green-800">
                                  {fertilizerRecommendations[cropType].urea}
                                </span>
                              </li>
                              <li className="flex justify-between items-center pb-2 border-b border-gray-100">
                                <strong className="text-gray-600">TSP:</strong>
                                <span className="font-semibold text-right text-green-800">
                                  {fertilizerRecommendations[cropType].tsp}
                                </span>
                              </li>
                              <li className="flex justify-between items-center">
                                <strong className="text-gray-600">MOP:</strong>
                                <span className="font-semibold text-right text-green-800">
                                  {fertilizerRecommendations[cropType].mop}
                                </span>
                              </li>
                            </ul>
                            <p className="text-xs text-gray-500 mt-4 italic">
                              *Recommendations are general and may vary based on
                              specific farm conditions.
                            </p>
                          </div>
                        ) : (
                          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 text-yellow-800">
                            <p className="text-sm font-semibold">
                              No specific fertilizer recommendation available
                              for {cropType}.
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-red-700 font-bold text-lg p-3 bg-red-50 rounded-md border border-red-200">
                        <XCircleIcon className="h-8 w-8 text-red-600" />
                        <span>
                          Conditions may not be ideal for optimal growth for
                          this crop.
                        </span>
                      </div>
                    )}
                  </>
                )
              ) : (
                <p className="text-gray-500 text-center w-full text-lg p-4">
                  Your analysis results will appear here after you submit the
                  form.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoilStatus;
