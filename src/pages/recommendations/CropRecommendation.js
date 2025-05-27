"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Sprout,
  Target,
  AlertCircle,
} from "lucide-react";

const API_BASE_URL =
  process.env.REACT_APP_CROP_RECOMMENDATION_API || "http://localhost:5000";

const CropRecommendation = ({ onShowResults }) => {
  const [formData, setFormData] = useState({
    targetMonth: new Date().getMonth() + 1,
    previousCrop: "",
    desiredCrop: "",
    plantingMonth: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    useCurrentMonth: true,
  });

  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [crops, setCrops] = useState([]);
  const [cropsLoading, setCropsLoading] = useState(true);

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

  const tips = [
    {
      title: "Don't know your soil acidity?",
      subtitle: "try one of these simple tests and find out for yourself!",
      methods: [
        {
          title: "pH strip test",
          content:
            "Take a small sample of soil and mix it with distilled water to create a slurry. Dip a pH strip into the mixture and compare the color change to the provided scale to determine the pH level.",
        },
        {
          title: "baking soda and vinegar test",
          content:
            "Take two small containers of soil. Pour vinegar onto one sample; if it fizzes, the soil is alkaline. On the other sample, add water and sprinkle baking soda; fizzing indicates acidity.",
        },
        {
          title: "cabbage juice indicator",
          content:
            "Boil red cabbage in water and let the water cool to create a natural pH indicator. Mix this cabbage water with soil slurry. Observe the color change: red indicates acidic soil, green/blue indicates neutral to alkaline soil.",
        },
      ],
    },
    {
      title: "Crop Rotation Benefits",
      subtitle: "why rotating crops is essential for healthy soil",
      methods: [
        {
          title: "nutrient management",
          content:
            "Different crops use different nutrients from the soil. Rotating helps prevent depletion of specific nutrients and maintains soil fertility naturally.",
        },
        {
          title: "pest control",
          content:
            "Many pests are crop-specific. Rotating breaks their life cycles and reduces pest populations without chemical interventions.",
        },
        {
          title: "disease prevention",
          content:
            "Soil-borne diseases often target specific plant families. Rotation helps break disease cycles and keeps your soil healthy.",
        },
      ],
    },
    {
      title: "Seasonal Planting Tips",
      subtitle: "maximize your harvest with proper timing",
      methods: [
        {
          title: "temperature considerations",
          content:
            "Monitor soil temperature before planting. Most vegetables prefer soil temperatures between 60-70°F for optimal germination.",
        },
        {
          title: "frost dates",
          content:
            "Know your last spring frost and first fall frost dates. Plant tender crops after the last frost and harvest before the first fall frost.",
        },
        {
          title: "day length sensitivity",
          content:
            "Some crops are sensitive to day length. Lettuce bolts in long days, while onions need long days to form bulbs.",
        },
      ],
    },
    {
      title: "Water Management Strategies",
      subtitle: "efficient irrigation for better yields",
      methods: [
        {
          title: "drip irrigation benefits",
          content:
            "Drip irrigation delivers water directly to plant roots, reducing water waste and preventing leaf diseases caused by overhead watering.",
        },
        {
          title: "mulching advantages",
          content:
            "Apply organic mulch around plants to retain soil moisture, suppress weeds, and regulate soil temperature throughout the growing season.",
        },
        {
          title: "watering timing",
          content:
            "Water early morning or late evening to minimize evaporation. Avoid watering during midday heat to prevent water stress and leaf burn.",
        },
      ],
    },
  ];

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      setCropsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/vegetables`);
      if (response.ok) {
        const data = await response.json();
        setCrops(data.vegetables || data); // Handle different response formats
      } else {
        console.error("Failed to fetch crops");
        // Fallback to hardcoded crops if API fails
        setCrops([
          "Beans",
          "Brinjal",
          "Tomato",
          "Cabbage",
          "Carrot",
          "Potato",
          "Pumpkin",
          "Lime",
          "Snake_gourd",
          "Green_Chilli",
        ]);
      }
    } catch (error) {
      console.error("Error fetching crops:", error);
      // Fallback to hardcoded crops if API fails
      setCrops([
        "Beans",
        "Brinjal",
        "Tomato",
        "Cabbage",
        "Carrot",
        "Potato",
        "Pumpkin",
        "Lime",
        "Snake_gourd",
        "Green_Chilli",
      ]);
    } finally {
      setCropsLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      changeTip((prev) => (prev + 1) % tips.length);
    }, 12000); // Change tip every 12 seconds

    return () => clearInterval(interval);
  }, [tips.length]);

  const changeTip = (newIndex) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentTipIndex(newIndex);
      setIsTransitioning(false);
    }, 300);
  };

  const getCurrentMonthName = () => {
    const currentMonth = new Date().getMonth();
    return months[currentMonth];
  };

  const validateField = (name, value) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const selectedYear = Number.parseInt(formData.year) || currentYear;

    switch (name) {
      case "targetMonth":
        if (!value) {
          return "Target harvest month is required";
        }
        const targetMonth = Number.parseInt(value);
        if (selectedYear === currentYear) {
          const minAllowedMonth = currentMonth + 2;
          if (targetMonth < minAllowedMonth) {
            return `Target harvest month must be at least 2 months away (minimum: ${
              months[Math.min(minAllowedMonth - 1, 11)]
            })`;
          }
        }
        return "";

      case "plantingMonth":
        if (!formData.useCurrentMonth) {
          if (!value) {
            return "Planting month is required";
          }
          const plantingMonth = Number.parseInt(value);
          const targetMonth = Number.parseInt(formData.targetMonth);

          if (selectedYear === currentYear && plantingMonth < currentMonth) {
            return "Cannot select a past month for the current year";
          }

          if (
            plantingMonth > targetMonth &&
            selectedYear === Number.parseInt(formData.year)
          ) {
            return "Planting month cannot be after harvest month in the same year";
          }
        }
        return "";

      case "year":
        if (!value) {
          return "Year is required";
        }
        const year = Number.parseInt(value);
        if (year < currentYear) {
          return "Cannot select a past year";
        }
        if (year > currentYear + 5) {
          return "Year cannot be more than 5 years in the future";
        }
        return "";

      default:
        return "";
    }
  };

  const isFormValid = () => {
    const requiredFields = ["targetMonth", "year"];
    if (!formData.useCurrentMonth) {
      requiredFields.push("plantingMonth");
    }

    // Check if all required fields have values
    for (const field of requiredFields) {
      if (!formData[field]) {
        return false;
      }
    }

    // Check if any field has validation errors
    for (const field of requiredFields) {
      const error = validateField(field, formData[field]);
      if (error) {
        return false;
      }
    }

    return true;
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ["targetMonth", "year"];
    if (!formData.useCurrentMonth) {
      requiredFields.push("plantingMonth");
    }

    requiredFields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Real-time validation for the changed field
    if (name === "targetMonth" || name === "plantingMonth" || name === "year") {
      const error = validateField(name, newValue);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleFieldBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleCurrentMonthToggle = (e) => {
    const useCurrentMonth = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      useCurrentMonth,
      plantingMonth: useCurrentMonth
        ? new Date().getMonth() + 1
        : prev.plantingMonth,
    }));

    // Clear planting month error when toggling and revalidate if needed
    if (useCurrentMonth) {
      setErrors((prev) => ({
        ...prev,
        plantingMonth: "",
      }));
    } else {
      // Validate planting month if not using current month
      const error = validateField("plantingMonth", formData.plantingMonth);
      setErrors((prev) => ({
        ...prev,
        plantingMonth: error,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetMonth: Number.parseInt(formData.targetMonth),
          previousCrop: formData.previousCrop || null,
          desiredCrop: formData.desiredCrop || null,
          plantingMonth: Number.parseInt(formData.plantingMonth),
          year: Number.parseInt(formData.year),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onShowResults(data);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert("Failed to get recommendations. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextTip = () => {
    changeTip((currentTipIndex + 1) % tips.length);
  };

  const prevTip = () => {
    changeTip((currentTipIndex - 1 + tips.length) % tips.length);
  };

  const getAvailableMonths = (isForPlanting = false, isForHarvest = false) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const selectedYear = Number.parseInt(formData.year);

    // If selected year is in the future, allow all months
    if (selectedYear > currentYear) {
      return months.map((month, index) => ({
        name: month,
        value: index + 1,
        disabled: false,
      }));
    }

    // If selected year is current year
    if (selectedYear === currentYear) {
      return months.map((month, index) => {
        const monthValue = index + 1;
        let disabled = false;

        if (isForHarvest) {
          // For harvest month, must be at least 2 months away
          disabled = monthValue < currentMonth + 2;
        } else {
          // For planting month, just can't be in the past
          disabled = monthValue < currentMonth;
        }

        return {
          name: month,
          value: monthValue,
          disabled: disabled,
        };
      });
    }

    // For past years (shouldn't happen due to year validation)
    return months.map((month, index) => ({
      name: month,
      value: index + 1,
      disabled: true,
    }));
  };

  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const selectedYear = Number.parseInt(formData.year);

    // If year changes to current year and selected months are in the past, reset them
    if (selectedYear === currentYear) {
      const minHarvestMonth = currentMonth + 2;
      if (Number.parseInt(formData.targetMonth) < minHarvestMonth) {
        setFormData((prev) => ({
          ...prev,
          targetMonth: Math.min(minHarvestMonth, 12),
        }));
      }
      if (
        !formData.useCurrentMonth &&
        Number.parseInt(formData.plantingMonth) < currentMonth
      ) {
        setFormData((prev) => ({ ...prev, plantingMonth: currentMonth }));
      }
    }
  }, [formData.year]);

  return (
    <div className="h-screen bg-gray-50 p-4 lg:p-8 overflow-hidden">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Crop Alternatives
          </h1>
          <p className="text-gray-600">
            Get personalized crop recommendations based on your farming
            conditions
          </p>
        </div>

        <div className="grid grid-cols-10 gap-8 flex-1 min-h-0">
          {/* Form Section - 3/10 width */}
          <div className="col-span-10 lg:col-span-3 bg-white rounded-xl shadow-lg p-6 overflow-y-auto">
            <div className="flex items-center mb-6">
              <Sprout className="w-6 h-6 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">
                Recommendation Form
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Target Harvest Month */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Target className="w-4 h-4 mr-2" />
                  Target Harvest Month
                </label>
                <select
                  name="targetMonth"
                  value={formData.targetMonth}
                  onChange={handleInputChange}
                  onBlur={handleFieldBlur}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.targetMonth ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                >
                  {getAvailableMonths(false, true).map((month, index) => (
                    <option
                      key={index}
                      value={month.value}
                      disabled={month.disabled}
                    >
                      {month.name} {month.disabled ? "(Too soon)" : ""}
                    </option>
                  ))}
                </select>
                {errors.targetMonth && (
                  <div className="flex items-center mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.targetMonth}
                  </div>
                )}
              </div>

              {/* Previous Crop */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Previous Crop (Optional)
                </label>
                <select
                  name="previousCrop"
                  value={formData.previousCrop}
                  onChange={handleInputChange}
                  disabled={cropsLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                >
                  <option value="">
                    {cropsLoading ? "Loading crops..." : "Select previous crop"}
                  </option>
                  {!cropsLoading &&
                    crops.map((crop) => (
                      <option key={crop} value={crop}>
                        {crop.replace("_", " ")}
                      </option>
                    ))}
                </select>
              </div>

              {/* Desired Crop */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Desired Crop (Optional)
                </label>
                <select
                  name="desiredCrop"
                  value={formData.desiredCrop}
                  onChange={handleInputChange}
                  disabled={cropsLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                >
                  <option value="">
                    {cropsLoading ? "Loading crops..." : "Select desired crop"}
                  </option>
                  {!cropsLoading &&
                    crops.map((crop) => (
                      <option key={crop} value={crop}>
                        {crop.replace("_", " ")}
                      </option>
                    ))}
                </select>
              </div>

              {/* Planting Month */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                  <Calendar className="w-4 h-4 mr-2" />
                  Planting Month
                </label>

                <div className="mb-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.useCurrentMonth}
                      onChange={handleCurrentMonthToggle}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Use current month for planting ({getCurrentMonthName()})
                    </span>
                  </label>
                </div>

                {!formData.useCurrentMonth && (
                  <div>
                    <select
                      name="plantingMonth"
                      value={formData.plantingMonth}
                      onChange={handleInputChange}
                      onBlur={handleFieldBlur}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 ${
                        errors.plantingMonth
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      {getAvailableMonths(true).map((month, index) => (
                        <option
                          key={index}
                          value={month.value}
                          disabled={month.disabled}
                        >
                          {month.name} {month.disabled ? "(Past)" : ""}
                        </option>
                      ))}
                    </select>
                    {errors.plantingMonth && (
                      <div className="flex items-center mt-1 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.plantingMonth}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  onBlur={handleFieldBlur}
                  min={new Date().getFullYear()}
                  max={new Date().getFullYear() + 5}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.year ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors.year && (
                  <div className="flex items-center mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.year}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !isFormValid()}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Getting Recommendations...
                  </>
                ) : !isFormValid() ? (
                  "Please complete all required fields"
                ) : (
                  "Get Recommendations"
                )}
              </button>
            </form>
          </div>

          {/* Tips Section - 7/10 width */}
          <div className="col-span-10 lg:col-span-7 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-2">
                <button
                  onClick={prevTip}
                  className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:bg-gray-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextTip}
                  className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:bg-gray-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Tip Indicators */}
              <div className="flex space-x-2">
                {tips.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => changeTip(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTipIndex
                        ? "bg-green-500 scale-110"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ease-in-out ${
                  isTransitioning
                    ? "opacity-0 transform translate-x-8"
                    : "opacity-100 transform translate-x-0"
                }`}
              >
                <div className="h-full overflow-y-auto pr-2 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {tips[currentTipIndex].title}
                    </h3>
                    <p className="text-lg text-gray-600 mb-8">
                      {tips[currentTipIndex].subtitle}
                    </p>
                  </div>

                  <div className="space-y-6">
                    {tips[currentTipIndex].methods.map((method, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow duration-300"
                      >
                        <h4 className="text-lg font-semibold text-gray-900 mb-3 capitalize">
                          {method.title}
                        </h4>
                        <p className="text-gray-700 leading-relaxed">
                          {method.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropRecommendation;
