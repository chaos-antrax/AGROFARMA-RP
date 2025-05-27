import React, { useState, useEffect } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';
import moment from 'moment';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Import icons from react-icons
import {
  FaCalendarAlt, FaMapMarkerAlt, FaLeaf, FaGasPump, FaTruck, FaWeightHanging,
  FaBoxOpen, FaCalculator, FaTags, FaInfoCircle, FaChartPie, FaChartBar,
  FaArrowUp, FaArrowDown, FaCheckCircle, FaBox, FaShoppingBag,
  FaChevronDown, FaChevronUp, FaMoneyBillWave, FaPlusCircle, FaFileInvoiceDollar
} from 'react-icons/fa';
import { MdLocationOn, MdAttachMoney, MdTimeline, MdAssessment } from 'react-icons/md';
import { GiPlainCircle, GiPowderBag } from 'react-icons/gi'; // For a generic dot/type icon

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// Packaging constants
const gunnyBagWeight = 50; // kg
const gunnyBagCost = 50; // Rs per package (assuming this is the cost for one bag, which can be used twice)
const gunnyBagEffectiveCost = gunnyBagCost / 2; // Cost per use
const gunnyBagReusability = 2;
const plasticCrateWeight = 20; // kg
const plasticCrateFullCost = 3000; // Full cost of a crate
const plasticCrateReusability = 215;
const plasticCrateEffectiveCost = plasticCrateFullCost / plasticCrateReusability; // Cost per use

// Transport mode constants
const threeWheelerMaxCapacity = 350; // kg
const threeWheelerFuelConsumption = 30; // km/L
const lorryMaxCapacity = 1000; // kg
const lorryFuelConsumption = 15; // km/L

// Distance from each farm (city) to each market in km
const distances = {
  Kurunegala: { Dambulla: 80, Pettah: 90 },
  "Nuwara Eliya": { Dambulla: 120, Pettah: 180 },
  Anuradhapura: { Dambulla: 65, Pettah: 200 },
  Badulla: { Dambulla: 150, Pettah: 210 },
  Kandy: { Dambulla: 72, Pettah: 115 },
};


function MarketPricePrediction() {
  const [predictionResult1, setPredictionResult1] = useState(null);
  const [date, setDate] = useState(new Date());
  const [market1, setMarket1] = useState('Dambulla');
  const [type1, setType1] = useState('Retail');
  const [vegetable1, setVegetable1] = useState('Carrot');
  const [fuelType1, setFuelType1] = useState('LP_92');

  const backendURL = 'http://127.0.0.1:5000';
  const marketPriceEndpoint = '/predict_price';
  const fuelPriceEndpoint = '/predict_fuel_price';

  const [fuelPricePrediction, setFuelPricePrediction] = useState(null);
  const [transportMode, setTransportMode] = useState('');
  const [startCity, setStartCity] = useState('');
  const [endCity, setEndCity] = useState('');
  const [totalWeight, setTotalWeight] = useState('');
  const [packagingType, setPackagingType] = useState('');
  const [transportCostDetails, setTransportCostDetails] = useState(null);
  const [packagingCostDetails, setPackagingCostDetails] = useState(null);

  const [costBreakdownChartData, setCostBreakdownChartData] = useState(null);
  const [financialSummaryChartData, setFinancialSummaryChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // New state for Additional Expenses
  const [productionCostPerKg, setProductionCostPerKg] = useState('');
  const [otherExpenses, setOtherExpenses] = useState('');
  const [isAdditionalExpensesExpanded, setIsAdditionalExpensesExpanded] = useState(false);

  // Helper to parse float and default to 0
  const safeParseFloat = (value) => parseFloat(value) || 0;

  const calculatedTotalWeight = safeParseFloat(totalWeight);
  const calculatedProductionCostPerKg = safeParseFloat(productionCostPerKg);
  const calculatedOtherExpenses = safeParseFloat(otherExpenses);
  const totalCalculatedProductionCost = calculatedProductionCostPerKg * calculatedTotalWeight;


  useEffect(() => {
    // This effect updates charts whenever any relevant cost component or prediction result changes.
    if (transportCostDetails && packagingCostDetails) { // Base costs must be ready
        const totalTransport = transportCostDetails.totalTransportCost || 0;
        const totalPackaging = packagingCostDetails.totalPackagingCost || 0;
        const totalProdCost = totalCalculatedProductionCost || 0;
        const currentOtherExp = calculatedOtherExpenses || 0;

        // Update Cost Breakdown Chart - pie chart
        const newCostBreakdownData = {
            labels: ['Transport Cost', 'Packaging Cost'],
            datasets: [
                {
                    label: 'Cost Breakdown (Rs.)',
                    data: [totalTransport, totalPackaging],
                    backgroundColor: ['rgba(20, 184, 166, 0.8)', 'rgba(22, 163, 74, 0.8)'], // teal, green
                    borderColor: ['rgba(20, 184, 166, 1)', 'rgba(22, 163, 74, 1)'],
                    borderWidth: 1,
                },
            ],
        };
        if (totalProdCost > 0) {
            newCostBreakdownData.labels.push('Production Cost');
            newCostBreakdownData.datasets[0].data.push(totalProdCost);
            newCostBreakdownData.datasets[0].backgroundColor.push('rgba(59, 130, 246, 0.8)'); // blue-500
            newCostBreakdownData.datasets[0].borderColor.push('rgba(59, 130, 246, 1)');
        }
        if (currentOtherExp > 0) {
            newCostBreakdownData.labels.push('Other Expenses');
            newCostBreakdownData.datasets[0].data.push(currentOtherExp);
            newCostBreakdownData.datasets[0].backgroundColor.push('rgba(168, 85, 247, 0.8)'); // purple-500
            newCostBreakdownData.datasets[0].borderColor.push('rgba(168, 85, 247, 1)');
        }
        setCostBreakdownChartData(newCostBreakdownData);

        // Update Financial Summary Chart (if vegetable price is available)- bar chart
        if (predictionResult1 && typeof predictionResult1.predicted_price === 'number' && calculatedTotalWeight > 0) {
            const predictedVegetablePrice = safeParseFloat(predictionResult1.predicted_price);
            const totalVegetableRevenue = predictedVegetablePrice * calculatedTotalWeight;
            const totalCosts = totalTransport + totalPackaging + totalProdCost + currentOtherExp;
            const netRevenue = totalVegetableRevenue - totalCosts;

            setFinancialSummaryChartData({
                labels: ['Total Revenue', 'Total Costs', 'Gross Profit/Loss'],
                datasets: [
                    {
                        label: 'Financial Summary (Rs.)',
                        data: [totalVegetableRevenue, totalCosts, netRevenue],
                        backgroundColor: [
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(239, 68, 68, 0.8)',
                            netRevenue >= 0 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(220, 38, 38, 0.8)',
                        ],
                        borderColor: [
                            'rgba(16, 185, 129, 1)',
                            'rgba(239, 68, 68, 1)',
                            netRevenue >= 0 ? 'rgba(34, 197, 94, 1)' : 'rgba(220, 38, 38, 1)',
                        ],
                        borderWidth: 1,
                    },
                ],
            });
        } else {
             setFinancialSummaryChartData(null); // Clear if no price or weight
        }
    } else { // If base costs are not ready, ensure charts are cleared
        setCostBreakdownChartData(null);
        setFinancialSummaryChartData(null);
    }
  }, [
      transportCostDetails, 
      packagingCostDetails, 
      predictionResult1, 
      totalWeight, // for calculatedTotalWeight
      productionCostPerKg, // for totalCalculatedProductionCost
      otherExpenses, // for calculatedOtherExpenses
      // include derived values in dependency array for clarity, or rely on primary states
      calculatedTotalWeight, 
      totalCalculatedProductionCost, 
      calculatedOtherExpenses
    ]);


  const isFormValid = () => {
    return (
      transportMode &&
      startCity &&
      endCity &&
      totalWeight &&
      packagingType &&
      date &&
      market1 &&
      type1 &&
      vegetable1 &&
      fuelType1
    );
  };

  const handleDateChange = (dates) => {
    if (dates && dates.length > 0) {
      setDate(dates[0]);
    }
  };

  const handlePredictPrice = async () => {
    const requestBody = {
      Date: moment(date).format('YYYY-MM-DD'),
      Market: market1,
      Type: type1,
      Vegetable: vegetable1,
    };

    try {
      const response = await axios.post(`${backendURL}${marketPriceEndpoint}`, requestBody, { // WHere Predicted market price is fetched from backend
        headers: { 'Content-Type': 'application/json' },
      });
      setPredictionResult1(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching market price prediction:', error);
      const errorData = { predicted_price: 'Error', error: error.message };
      setPredictionResult1(errorData);
      return errorData;
    }
  };
  
  const handleCostAnalysis = async () => {
    setIsLoading(true);
    setPredictionResult1(null); // Reset market price prediction
    setFuelPricePrediction(null); // Reset fuel price prediction
    setTransportCostDetails(null); // Reset calculated transport costs
    setPackagingCostDetails(null); // Reset calculated packaging costs
    setCostBreakdownChartData(null); // Reset data for the cost breakdown (pie) chart
    setFinancialSummaryChartData(null); // Reset data for the financial summary (bar) chart

    
    // 2. Fetch Predicted Market Price
    // Call the `handlePredictPrice` function (which makes an API call to the backend).
    // `await` pauses the execution of `handleCostAnalysis` here until `handlePredictPrice`
    // finishes and returns its result (either the prediction data or an error object).
    // `handlePredictPrice` itself will set the `predictionResult1` state.
    const marketPriceData = await handlePredictPrice(); 

    // 3. Prepare Request for Fuel Price Prediction
    // Create an object that will be sent as the body of the request to the fuel price API
    const fuelRequestBody = {
      Date: moment(date).format('YYYY-MM-DD'),
      FuelType: fuelType1
    };

    try {
      // 5. Fetch Predicted Fuel Price
      // Make an HTTP POST request to the backend endpoint for fuel price prediction
      //fuelRequestBody - sends data to the backend and the response is saved to fuelResponse 
      const fuelResponse = await axios.post(`${backendURL}${fuelPriceEndpoint}`, fuelRequestBody, { // The URL of the fuel price API endpoint
        headers: { 'Content-Type': 'application/json' },
      });
      // If the request is successful, update the `fuelPricePrediction` state with the data from the backend.
      setFuelPricePrediction(fuelResponse.data);

      // 6. Calculate Transport Costs (Frontend Logic)
      // Get the distance between the selected start and end cities from the predefined `distances` object.
       //   - `|| 0` provides a default value of 0 if the distance isn't found (e.g., invalid city selection).
      const distance = distances[startCity]?.[endCity] || 0;
      let fuelPrice = 0;
      // Determine the actual fuel price to use based on the fuel type selected by the user
      // and the predicted prices received from the backend.
      if (fuelType1 === 'LP_92' && fuelResponse.data.predicted_petrol_price) {
        // If petrol is selected and a petrol price prediction is available.
        fuelPrice = safeParseFloat(fuelResponse.data.predicted_petrol_price);
      } else if (fuelType1 === 'LAD' && fuelResponse.data.predicted_diesel_price) {
        // If diesel is selected and a diesel price prediction is available.
        // The `* 40` suggests a potential unit conversion or adjustment specific to how the diesel price is provided.
        fuelPrice = safeParseFloat(fuelResponse.data.predicted_diesel_price) * 40; 
      }
      
      let fuelEfficiency = 1, vehicleCapacity = 1; //default values
      // Set the fuel efficiency and capacity based on the selected transport mode using predefined constants.
      if (transportMode === 'Threewheel') {
        fuelEfficiency = threeWheelerFuelConsumption;
        vehicleCapacity = threeWheelerMaxCapacity;
      } else if (transportMode === 'Lorry') {
        fuelEfficiency = lorryFuelConsumption;
        vehicleCapacity = lorryMaxCapacity;
      }

      // Perform the transport cost calculations:
      const fuelCostPerKm = fuelEfficiency > 0 ? fuelPrice / fuelEfficiency : 0; // Avoid division by zero.
      const totalFuelCost = fuelCostPerKm * distance * 2; // Cost for a round trip (to market and back).
      // Cost to transport 1kg if the vehicle is filled to its maximum capacity.
      const transportCostPerKg = vehicleCapacity > 0 ? totalFuelCost / vehicleCapacity : 0;
      // Actual total transport cost for the `totalWeight` of produce entered by the user.
      const calculatedTotalTransportCost = transportCostPerKg * safeParseFloat(totalWeight || 0);
      
      // Bundle all calculated transport details into an object.
      const currentTransportDetails = {
        totalTransportCost: calculatedTotalTransportCost,
        fuelCostPerKm, totalFuelCost, transportCostPerKg, distance,
        fuelPrice, fuelEfficiency, vehicleCapacity,
      };
      // Update the `transportCostDetails` state, which will make these details available to the UI and the `useEffect` hook for charts.
      setTransportCostDetails(currentTransportDetails);

      // 7. Calculate Packaging Costs (Frontend Logic)
      let packageWeight = 1, packageCostPerUse = 0;
       // Set the weight capacity per package and the effective cost per use based on the selected packaging type.
      if (packagingType === 'Gunny Bags') {
        packageWeight = gunnyBagWeight;
        packageCostPerUse = gunnyBagEffectiveCost;
      } else if (packagingType === 'Plastic Crates') {
        packageWeight = plasticCrateWeight;
        packageCostPerUse = plasticCrateEffectiveCost;
      }

       // Calculate the number of packages required. `Math.ceil` rounds up to ensure enough packages
      const numPackages = packageWeight > 0 ? Math.ceil(safeParseFloat(totalWeight || 0) / packageWeight) : 0;
      // Total cost for all packages.
      const totalPackagingCost = numPackages * packageCostPerUse;
      // Bundle all calculated packaging details into an object.
      const currentPackagingDetails = {
        numPackages, packageWeight, packageCostPerUse, totalPackagingCost, packagingType,
      };
      // Update the `packagingCostDetails` state.
      setPackagingCostDetails(currentPackagingDetails);

      // 8. Trigger Chart Updates (Implicitly)
      // Chart data will be set by the useEffect hook now

    } catch (error) {
      console.error('Error in cost analysis pipeline:', error);
      setFuelPricePrediction({ error: error.message }); 
    } finally {
        setIsLoading(false);
    }
  };
  
  const inputStyle = "mt-1 block w-full bg-white/60 backdrop-blur-sm border-gray-300/50 text-gray-800 placeholder-gray-500 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-all duration-150";
  const labelStyle = "block text-sm font-medium text-gray-700 mb-1 flex items-center";
  const cardBaseStyle = "bg-white/60 backdrop-blur-lg p-6 rounded-xl shadow-xl border border-gray-200/40";
  const sectionTitleStyle = "text-xl font-semibold text-teal-700 mb-4 flex items-center";
  const iconClass = "mr-2 text-teal-600";
  const resultIconClass = "mr-2 text-teal-700";

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#374151', font: { size: 12 } } 
      },
      title: {
        display: true,
        text: 'Chart Title', 
        color: '#0D9488', // teal-600
        font: { size: 16, weight: 'bold' }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        titleColor: '#111827', 
        bodyColor: '#374151', 
        borderColor: '#9CA3AF', 
        borderWidth: 1,
        padding: 10,
        cornerRadius: 6,
        boxPadding: 3,
        callbacks: {
            label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed.y !== null && context.dataset.label?.includes('(Rs.)')) { // Check if y exists and label indicates currency
                    label += new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(context.parsed.y);
                } else if (context.parsed !== null && context.dataset.label?.includes('(Rs.)')) { // For Pie charts, context.parsed is the value
                    label += new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(context.parsed);
                }
                 else if (context.parsed.y !== null) { // Fallback for non-currency data if any
                    label += context.parsed.y;
                } else if (context.parsed !== null) {
                    label += context.parsed;
                }
                return label;
            }
        }
      }
    },
    scales: { 
        x: {
            ticks: { color: '#4B5563', font: { size: 11 } }, 
            grid: { color: 'rgba(156, 163, 175, 0.3)' } 
        },
        y: {
            ticks: { color: '#4B5563', font: {size: 11}, callback: function(value) { return 'Rs.' + value.toLocaleString(); } },
            grid: { color: 'rgba(156, 163, 175, 0.4)' }
        }
    }
  };
  
  const pieChartOptions = { ...chartOptions, scales: {} }; // Pie charts don't have scales

  return (
    <div className="bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100 text-gray-800 min-h-screen flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full bg-white/50 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden p-6 md:p-10 space-y-8 border border-gray-200/30">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#16b766] bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
            Forecast & Cost Analysis
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Market Price Forecasting, Transport & Package Cost Analysis for Agricultural Produce
          </p>
        </header>

        <div className={`${cardBaseStyle}`}>
          <label htmlFor="date-picker" className={`${labelStyle} text-lg`}>
            <FaCalendarAlt className={`${iconClass} w-6 h-6`} />
            Select Analysis Date:
          </label>
          <Flatpickr
            id="date-picker"
            className={`${inputStyle} cursor-pointer mt-2`}
            options={{ 
              dateFormat: 'Y-m-d', 
              defaultDate: date,
              minDate: "today"
            }}
            onChange={handleDateChange}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className={`${cardBaseStyle} space-y-5`}>
            <h3 className={sectionTitleStyle}>
              <MdAssessment className={`${iconClass} w-6 h-6`} /> Market & Product Details
            </h3>
            <div>
              <label htmlFor="market1" className={labelStyle}><FaMapMarkerAlt className={iconClass} /> Target Market:</label>
              <select id="market1" className={inputStyle} value={market1} onChange={(e) => setMarket1(e.target.value)}>
                <option value="Dambulla">Dambulla</option>
                <option value="Pettah">Pettah</option>
              </select>
            </div>
            <div>
              <label htmlFor="type1" className={labelStyle}><FaTags className={iconClass} /> Sale Type:</label>
              <select id="type1" className={inputStyle} value={type1} onChange={(e) => setType1(e.target.value)}>
                <option value="Retail">Retail</option>
              </select>
            </div>
            <div>
              <label htmlFor="vegetable1" className={labelStyle}><FaLeaf className={iconClass} /> Vegetable:</label>
              <select id="vegetable1" className={inputStyle} value={vegetable1} onChange={(e) => setVegetable1(e.target.value)}>
                <option value="Carrot">Carrot</option>
                <option value="Tomato">Tomato</option>
                <option value="Cabbage">Cabbage</option>
                <option value="Beans">Beans</option>
                <option value="Snake gourd">Snake gourd</option>
                <option value="Brinjal">Brinjal</option>
              </select>
            </div>
             <div>
              <label htmlFor="fuelType1" className={labelStyle}><FaGasPump className={iconClass} /> Fuel Type for Transport:</label>
              <select id="fuelType1" className={inputStyle} value={fuelType1} onChange={(e) => setFuelType1(e.target.value)}>
                <option value="LP_92">Petrol (LP_92)</option>
                <option value="LAD">Diesel (LAD)</option>
              </select>
            </div>
          </div>

          <div className={`${cardBaseStyle} space-y-5`}>
            <h3 className={sectionTitleStyle}>
              <FaTruck className={`${iconClass} w-6 h-6`} /> Logistics Parameters
            </h3>
            <div>
              <label htmlFor="transportMode" className={labelStyle}><FaTruck className={iconClass} /> Transport Mode:</label>
              <select id="transportMode" className={inputStyle} value={transportMode} onChange={(e) => setTransportMode(e.target.value)}>
                <option value="">Select Transport Mode</option>
                <option value="Threewheel">Threewheel</option>
                <option value="Lorry">Lorry</option>
              </select>
            </div>
            <div>
              <label htmlFor="startCity" className={labelStyle}><MdLocationOn className={iconClass} /> Start City (Farm):</label>
              <select id="startCity" className={inputStyle} value={startCity} onChange={(e) => setStartCity(e.target.value)}>
                <option value="">Select Start City</option>
                <option value="Kurunegala">Kurunegala</option>
                <option value="Nuwara Eliya">Nuwara Eliya</option>
                <option value="Anuradhapura">Anuradhapura</option>
                <option value="Badulla">Badulla</option>
                <option value="Kandy">Kandy</option>
              </select>
            </div>
            <div>
              <label htmlFor="endCity" className={labelStyle}><MdLocationOn className={iconClass} /> End City (Market):</label>
              <select id="endCity" className={inputStyle} value={endCity} onChange={(e) => setEndCity(e.target.value)}>
                <option value="">Select End City</option>
                <option value="Dambulla">Dambulla</option>
                <option value="Pettah">Pettah</option>
              </select>
            </div>
            <div>
              <label htmlFor="totalWeight" className={labelStyle}><FaWeightHanging className={iconClass} /> Total Weight (kg):</label>
              <input type="number" id="totalWeight" className={inputStyle} value={totalWeight} onChange={(e) => setTotalWeight(e.target.value)} placeholder="e.g., 300"/>
              {transportMode === 'Threewheel' && safeParseFloat(totalWeight) > threeWheelerMaxCapacity && (
                <p className="text-red-600 text-xs mt-1">Max weight for Threewheel is {threeWheelerMaxCapacity}kg.</p>
              )}
              {transportMode === 'Lorry' && safeParseFloat(totalWeight) > lorryMaxCapacity && (
                <p className="text-red-600 text-xs mt-1">Max weight for Lorry is {lorryMaxCapacity}kg.</p>
              )}
            </div>
            <div>
              <label className={labelStyle}><FaBoxOpen className={iconClass}/> Packaging Type:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                <div
                  onClick={() => setPackagingType('Gunny Bags')}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 group relative flex flex-col items-center justify-center text-center hover:shadow-lg
                              ${packagingType === 'Gunny Bags' ? 'border-teal-500 bg-teal-500/10 ring-2 ring-teal-500 shadow-lg' : 'border-gray-300/70 hover:border-teal-400 bg-white/50'}`}
                >
                  <GiPowderBag className={`w-8 h-8 mb-2 ${packagingType === 'Gunny Bags' ? 'text-teal-500' : 'text-gray-500 group-hover:text-teal-500'}`} />
                  <h5 className="font-semibold text-gray-700">Gunny Bags</h5>
                  <p className="text-xs text-gray-500 mt-1">Reusable: {gunnyBagReusability} times</p>
                  {packagingType === 'Gunny Bags' && <FaCheckCircle className="w-5 h-5 text-teal-500 absolute top-2 right-2" />}
                </div>
                <div
                  onClick={() => setPackagingType('Plastic Crates')}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 group relative flex flex-col items-center justify-center text-center hover:shadow-lg
                              ${packagingType === 'Plastic Crates' ? 'border-teal-500 bg-teal-500/10 ring-2 ring-teal-500 shadow-lg' : 'border-gray-300/70 hover:border-teal-400 bg-white/50'}`}
                >
                   <FaBox className={`w-8 h-8 mb-2 ${packagingType === 'Plastic Crates' ? 'text-teal-500' : 'text-gray-500 group-hover:text-teal-500'}`} />
                  <h5 className="font-semibold text-gray-700">Plastic Crates</h5>
                  <p className="text-xs text-gray-500 mt-1">Reusable: {plasticCrateReusability} times</p>
                  {packagingType === 'Plastic Crates' && <FaCheckCircle className="w-5 h-5 text-teal-500 absolute top-2 right-2" />}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleCostAnalysis}
            disabled={isLoading || !isFormValid() || (transportMode === 'Threewheel' && safeParseFloat(totalWeight) > threeWheelerMaxCapacity) || (transportMode === 'Lorry' && safeParseFloat(totalWeight) > lorryMaxCapacity)}
            className={`py-3.5 px-10 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white flex items-center justify-center transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100
              ${!isFormValid() || (transportMode === 'Threewheel' && safeParseFloat(totalWeight) > threeWheelerMaxCapacity) || (transportMode === 'Lorry' && safeParseFloat(totalWeight) > lorryMaxCapacity)
                ? 'bg-gray-400 cursor-not-allowed opacity-80' // Disabled state
          : 'bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 hover:from-emerald-600 hover:via-green-700 hover:to-teal-700 focus:ring-green-500'
            }`}>
            {isLoading 
                ? <FaInfoCircle className={`w-5 h-5 mr-2 text-white animate-spin`} />
                : <FaCalculator className={`w-5 h-5 mr-2 text-white`} />
            }
            {isLoading ? 'Calculating...' : 'Calculate Forecast'}
          </button>
        </div>

        {(predictionResult1 || fuelPricePrediction || transportCostDetails || packagingCostDetails) && !isLoading && (
          <div className="mt-12 space-y-10">
            <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 border-b-2 border-green-500/30 pb-4">
              <MdTimeline className="inline-block mr-3 w-8 h-8 align-middle" /> Forecast Summary & Breakdown
            </h2>
            
            {predictionResult1?.error && (
                <div className="bg-red-100/80 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md" role="alert">
                    <p className="font-bold flex items-center"><FaInfoCircle className="mr-2"/>Market Price Prediction Error</p>
                    <p>{predictionResult1.error}</p>
                </div>
            )}
            {fuelPricePrediction?.error && !fuelPricePrediction?.predicted_petrol_price && !fuelPricePrediction?.predicted_diesel_price && (
                 <div className="bg-red-100/80 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md" role="alert">
                    <p className="font-bold flex items-center"><FaInfoCircle className="mr-2"/>Fuel Price Prediction Error</p>
                    <p>{fuelPricePrediction.error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                    {predictionResult1 && typeof predictionResult1.predicted_price === 'number' && (
                    <div className={cardBaseStyle}>
                        <h4 className={`${sectionTitleStyle} text-green-500`}>
                          <MdAttachMoney className={`mr-2 w-6 h-6 text-green-500`} />
                          Predicted Price <span className="text-sm font-normal text-gray-500 ml-1">({vegetable1} in {market1})</span>
                        </h4>
                        <p className="text-5xl font-bold text-gray-800">
                        Rs. {predictionResult1.predicted_price.toFixed(2)}
                        <span className="text-2xl font-normal text-gray-600"> / kg</span>
                        </p>
                    </div>
                    )}

                    {fuelPricePrediction && (fuelPricePrediction.predicted_diesel_price || fuelPricePrediction.predicted_petrol_price) && (
                    <div className={cardBaseStyle}>
                        <h4 className={`${sectionTitleStyle}`}>
                          <FaGasPump className={`${resultIconClass} w-6 h-6`} /> Predicted Fuel Prices
                          <span className="text-xs font-normal text-gray-500 ml-2">({moment(date).format('MMM Do, YYYY')})</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-lg">
                        {fuelPricePrediction.predicted_petrol_price && (
                            <p><span className="font-semibold">Petrol:</span> Rs. {safeParseFloat(fuelPricePrediction.predicted_petrol_price).toFixed(2)}<span className="text-sm">/L</span></p>
                        )}
                        {fuelPricePrediction.predicted_diesel_price && (
                            <p><span className="font-semibold">Diesel:</span> Rs. {(safeParseFloat(fuelPricePrediction.predicted_diesel_price) * 40).toFixed(2)}<span className="text-sm">/L</span></p>
                        )}
                        </div>
                    </div>
                    )}

                    {/* Additional Expenses Card */}
                    <div className={cardBaseStyle}>
                        <div 
                            className="flex justify-between items-center cursor-pointer"
                            onClick={() => setIsAdditionalExpensesExpanded(!isAdditionalExpensesExpanded)}
                        >
                            <h4 className={`${sectionTitleStyle} mb-0`}> {/* Removed mb-4 for tighter look */}
                                <FaFileInvoiceDollar className={`${resultIconClass} w-6 h-6`} /> Additional Expenses
                            </h4>
                            {isAdditionalExpensesExpanded ? <FaChevronUp className="text-teal-600" /> : <FaChevronDown className="text-teal-600" />}
                        </div>
                        {isAdditionalExpensesExpanded && (
                            <div className="mt-4 space-y-4">
                                <div>
                                    <label htmlFor="productionCostPerKg" className={labelStyle}>
                                        <FaMoneyBillWave className={iconClass} /> Production Cost per/kg (Rs.):
                                    </label>
                                    <input
                                        type="number"
                                        id="productionCostPerKg"
                                        className={inputStyle}
                                        value={productionCostPerKg}
                                        onChange={(e) => setProductionCostPerKg(e.target.value)}
                                        placeholder="e.g., 20"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="otherExpenses" className={labelStyle}>
                                        <FaPlusCircle className={iconClass} /> Other Expenses (Rs.):
                                    </label>
                                    <input
                                        type="number"
                                        id="otherExpenses"
                                        className={inputStyle}
                                        value={otherExpenses}
                                        onChange={(e) => setOtherExpenses(e.target.value)}
                                        placeholder="e.g., 500"
                                    />
                                </div>
                                {calculatedTotalWeight > 0 && calculatedProductionCostPerKg > 0 && (
                                    <p className="text-sm text-gray-700 mt-2">
                                        Total Production Cost (for {calculatedTotalWeight} kg):
                                        <span className="font-semibold ml-1">
                                            Rs. {totalCalculatedProductionCost.toFixed(2)}
                                        </span>
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                    
                    {transportCostDetails && (
                    <div className={cardBaseStyle}>
                        <h4 className={`${sectionTitleStyle}`}>
                          <FaTruck className={`${resultIconClass} w-6 h-6`} /> Transport Cost Analysis
                        </h4>
                        <div className="space-y-1.5 text-sm text-gray-600">
                            <p><strong>Route:</strong> <span className="font-medium text-gray-800">{startCity} to {endCity}</span></p>
                            <p><strong>Distance:</strong> <span className="font-medium text-gray-800">{transportCostDetails.distance} km (Round Trip: {transportCostDetails.distance * 2} km)</span></p>
                            <p><strong>Fuel Price ({fuelType1}):</strong> <span className="font-medium text-gray-800">Rs. {transportCostDetails.fuelPrice.toFixed(2)} /L</span></p>
                            <p><strong>Vehicle:</strong> <span className="font-medium text-gray-800">{transportMode}</span> (Efficiency: {transportCostDetails.fuelEfficiency} km/L, Capacity: {transportCostDetails.vehicleCapacity} kg)</p>
                            <p><strong>Fuel Cost/km:</strong> <span className="font-medium text-gray-800">Rs. {transportCostDetails.fuelCostPerKm.toFixed(2)}</span></p>
                            <p><strong>Total Fuel Cost:</strong> <span className="font-medium text-gray-800">Rs. {transportCostDetails.totalFuelCost.toFixed(2)}</span></p>
                            <p><strong>Transport Cost/kg:</strong> <span className="font-medium text-gray-800">Rs. {transportCostDetails.transportCostPerKg.toFixed(2)}</span></p>
                        </div>
                        <p className="mt-4 text-2xl text-emerald-700 font-bold">Total Transport: Rs. {transportCostDetails.totalTransportCost.toFixed(2)} <span className="text-base font-normal text-gray-600">(for {totalWeight}kg)</span></p>
                    </div>
                    )}

                    {packagingCostDetails && (
                    <div className={cardBaseStyle}>
                        <h4 className={`${sectionTitleStyle}`}>
                          <FaBoxOpen className={`${resultIconClass} w-6 h-6`} /> Packaging Cost Analysis
                        </h4>
                        <div className="space-y-1.5 text-sm text-gray-600">
                        <p><strong>Type:</strong> <span className="font-medium text-gray-800">{packagingCostDetails.packagingType}</span></p>
                        <p><strong>Weight/Package:</strong> <span className="font-medium text-gray-800">{packagingCostDetails.packageWeight} kg</span></p>
                        <p><strong>Cost/Package (per use):</strong> <span className="font-medium text-gray-800">Rs. {packagingCostDetails.packageCostPerUse.toFixed(2)}</span></p>
                        <p><strong>No. of Packages:</strong> <span className="font-medium text-gray-800">{packagingCostDetails.numPackages}</span></p>
                        </div>
                        <p className="mt-4 text-2xl text-emerald-700 font-bold">Total Packaging: Rs. {packagingCostDetails.totalPackagingCost.toFixed(2)}</p>
                    </div>
                    )}
                </div>

                <div className="space-y-6">
                    {costBreakdownChartData && (
                        <div className={cardBaseStyle}>
                          <h4 className={`${sectionTitleStyle}`}>
                              <FaChartPie className={`${resultIconClass} w-6 h-6`} /> Cost Distribution
                          </h4>
                          <div style={{ height: '300px' }}>
                              <Pie 
                                data={costBreakdownChartData} 
                                options={{...pieChartOptions, plugins: {...pieChartOptions.plugins, title: {...pieChartOptions.plugins.title, text: 'Cost Proportions (Rs.)'}}}} 
                              />
                          </div>
                        </div>
                    )}
                    
                    {financialSummaryChartData && ( // Show bar chart if data exists
                        <div className={cardBaseStyle}>
                          <h4 className={`${sectionTitleStyle}`}>
                              <FaChartBar className={`${resultIconClass} w-6 h-6`} /> Financial Overview
                          </h4>
                          <div style={{ height: '300px' }}>
                              <Bar 
                                data={financialSummaryChartData} 
                                options={{...chartOptions, plugins: {...chartOptions.plugins, title: {...chartOptions.plugins.title, text: 'Financial Summary (Rs.)'}}}} 
                              />
                          </div>
                        </div>
                    )}

                    {transportCostDetails && packagingCostDetails && predictionResult1 && typeof predictionResult1.predicted_price === 'number' && calculatedTotalWeight > 0 && (
                    (() => {
                        const totalTransportCost = transportCostDetails.totalTransportCost;
                        const totalPackagingCost = packagingCostDetails.totalPackagingCost;
                        // totalCalculatedProductionCost and calculatedOtherExpenses are already available from the top scope
                        
                        const predictedVegetablePrice = safeParseFloat(predictionResult1.predicted_price);
                        const totalVegetableRevenue = predictedVegetablePrice * calculatedTotalWeight;
                        const totalAllExpenditures = totalTransportCost + totalPackagingCost + totalCalculatedProductionCost + calculatedOtherExpenses;
                        const netRevenue = totalVegetableRevenue - totalAllExpenditures;
                        return (
                        <div className={`p-6 rounded-xl shadow-2xl mt-6 text-white ${netRevenue >= 0 ? 'bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700' : 'bg-gradient-to-br from-red-500 via-rose-600 to-pink-700'} border ${netRevenue >=0 ? 'border-green-400/70' : 'border-red-400/70'}`}>
                            <h4 className="text-2xl font-bold mb-4 flex items-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${netRevenue >= 0 ? 'bg-green-700 text-green-100' : 'bg-red-700 text-red-100'}`}>
                                {netRevenue >=0 ? <FaArrowUp size={14} className="mr-1"/> : <FaArrowDown size={14} className="mr-1"/> }
                                {netRevenue >=0 ? "Profitable Venture" : "Potential Loss"}
                              </span>
                            </h4>
                            <div className="space-y-2.5 text-sm ">
                                <div className="flex justify-between items-center py-1 border-b border-white/20"><span>Predicted Veg. Price/Kg:</span> <span className="font-semibold text-lg">Rs. {predictedVegetablePrice.toFixed(2)}</span></div>
                                <div className="flex justify-between items-center py-1 border-b border-white/20"><span>Total Weight:</span> <span className="font-semibold text-lg">{calculatedTotalWeight} kg</span></div>
                                <div className="flex justify-between items-center py-1.5 text-lg border-b border-white/20"><strong>Total Estimated Revenue:</strong> <strong className={`font-bold ${netRevenue >=0 ? "text-green-200" : "text-red-200"}`}>Rs. {totalVegetableRevenue.toFixed(2)}</strong></div>
                                
                                <div className="flex justify-between items-center pt-2 pb-1 border-b border-white/20"><span>Total Transport Cost (-):</span> <span className="font-semibold">Rs. {totalTransportCost.toFixed(2)}</span></div>
                                <div className="flex justify-between items-center py-1 border-b border-white/20"><span>Total Packaging Cost (-):</span> <span className="font-semibold">Rs. {totalPackagingCost.toFixed(2)}</span></div>
                                {totalCalculatedProductionCost > 0 && (
                                  <div className="flex justify-between items-center py-1 border-b border-white/20"><span>Total Production Cost (-):</span> <span className="font-semibold">Rs. {totalCalculatedProductionCost.toFixed(2)}</span></div>
                                )}
                                {calculatedOtherExpenses > 0 && (
                                  <div className="flex justify-between items-center py-1"><span>Other Expenses (-):</span> <span className="font-semibold">Rs. {calculatedOtherExpenses.toFixed(2)}</span></div>
                                )}
                            </div>
                            <div className="mt-5 pt-3 border-t border-white/30">
                                <p className="text-md uppercase tracking-wider mb-1">{netRevenue >=0 ? "Estimated Net Profit" : "Estimated Net Loss"}</p>
                                <p className={`text-5xl font-extrabold ${netRevenue >=0 ? "text-green-100" : "text-red-100"}`}>
                                    Rs. {netRevenue.toFixed(2)}
                                </p>
                                <p className="text-xs mt-1 opacity-80"> (Revenue - All Expenditures)</p>
                            </div>
                        </div>
                        );
                    })()
                    )}
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MarketPricePrediction;