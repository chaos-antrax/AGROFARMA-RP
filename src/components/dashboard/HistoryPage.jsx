// src/pages/HistoryPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"; // Import query, orderBy, limit
import { db } from "../firebase";
import {
  FaSeedling,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaDownload,
  FaArrowLeft,
  FaHistory,
  FaSpinner,
} from "react-icons/fa"; // Added FaTimesCircle, FaArrowLeft, FaHistory, FaSpinner
import { Dialog } from "@headlessui/react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import moment from "moment"; // Import moment for date formatting
import { useNavigate } from "react-router-dom"; // Import useNavigate

const HistoryPage = ({ handleViewHistory }) => {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pdfRef = useRef(); // Ref for the modal content to be captured as PDF
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const historyRef = collection(db, "soilAnalysisHistory");
        const q = query(historyRef, orderBy("createdAt", "desc"), limit(50));
        const querySnapshot = await getDocs(q);
        const fetchedRecords = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt
              ? moment(doc.data().createdAt.toDate()).format(
                  "MMM D, YYYY h:mm A"
                )
              : "N/A",
          }))
          .filter((record) => record.predictedClass === "Suitable"); // 🔍 filter only Suitable

        setRecords(fetchedRecords);
      } catch (err) {
        console.error("Failed to fetch history:", err);
        setError(
          "Failed to load history data. Please ensure Firebase is configured correctly and you have access."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openModal = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const downloadPDF = async () => {
    if (!selectedRecord) return;

    // Use a temporary element for PDF generation with significantly improved styling
    const printContent = document.createElement("div");
    printContent.style.padding = "30px";
    printContent.style.fontFamily = "Inter, Arial, sans-serif"; // Use Inter or a clean sans-serif font
    printContent.style.fontSize = "12px";
    printContent.style.color = "#333";
    printContent.style.lineHeight = "1.6";
    printContent.style.backgroundColor = "#ffffff"; // Ensure white background for PDF
    printContent.style.boxSizing = "border-box"; // Ensure padding is included in element's total width/height

    printContent.innerHTML = `
      <div style="text-align: center; margin-bottom: 40px; padding-bottom: 15px; border-bottom: 2px solid #e0e0e0;">
        <h1 style="color: #166534; font-size: 32px; font-weight: bold; margin: 0;">Soil Analysis Report</h1>
        <p style="color: #4CAF50; font-size: 18px; margin-top: 5px;">Detailed Analysis for ${
          selectedRecord.cropType
        }</p>
      </div>

      <div style="margin-bottom: 30px;">
        <h3 style="color: #2E7D32; font-size: 20px; font-weight: bold; margin-bottom: 15px; border-bottom: 1px solid #c8e6c9; padding-bottom: 5px;">
          <span style="display: inline-block; width: 25px; height: 25px; background-color: #4CAF50; border-radius: 50%; text-align: center; line-height: 25px; color: white; font-size: 16px; margin-right: 10px;">&#10003;</span>
          Growth Suitability Overview
        </h3>
        <div style="display: flex; justify-content: space-between; align-items: center; background-color: #e8f5e9; padding: 15px 20px; border-radius: 8px; border: 1px solid #c8e6c9;">
          <p style="font-size: 16px; font-weight: bold; color: #333;">Predicted Class:</p>
          <span style="background-color: #4CAF50; color: white; padding: 8px 15px; border-radius: 20px; font-weight: bold; font-size: 18px;">
            ${selectedRecord.predictedClass}
          </span>
        </div>
        <p style="font-size: 14px; color: #555; margin-top: 10px; text-align: right;">
          Confidence: <span style="font-weight: bold;">${(
            selectedRecord.confidence * 100
          ).toFixed(2)}%</span>
        </p>
      </div>

      <div style="margin-bottom: 30px;">
        <h3 style="color: #2E7D32; font-size: 20px; font-weight: bold; margin-bottom: 15px; border-bottom: 1px solid #c8e6c9; padding-bottom: 5px;">
          <span style="display: inline-block; width: 25px; height: 25px; background-color: #81C784; border-radius: 50%; text-align: center; line-height: 25px; color: white; font-size: 16px; margin-right: 10px;">&#x2692;</span>
          Soil & Climate Data
        </h3>
        <div style="display: flex; flex-wrap: wrap; gap: 15px 30px;">
          <div style="flex: 1 1 45%; min-width: 200px;">
            <p style="margin-bottom: 5px;"><strong style="color: #555;">Analysis Date:</strong> ${
              selectedRecord.date
            }</p>
            <p style="margin-bottom: 5px;"><strong style="color: #555;">Soil Type:</strong> ${
              selectedRecord.soilType
            }</p>
            <p style="margin-bottom: 5px;"><strong style="color: #555;">PH Value:</strong> ${
              selectedRecord.phValue
            }</p>
            <p style="margin-bottom: 5px;"><strong style="color: #555;">Potassium (ppm):</strong> ${
              selectedRecord.potassium
            }</p>
            <p style="margin-bottom: 5px;"><strong style="color: #555;">Phosphorus (ppm):</strong> ${
              selectedRecord.phosphorus
            }</p>
          </div>
          <div style="flex: 1 1 45%; min-width: 200px;">
            <p style="margin-bottom: 5px;"><strong style="color: #555;">Average Temp (°C):</strong> ${
              selectedRecord.tempMean
            }</p>
            <p style="margin-bottom: 5px;"><strong style="color: #555;">Daylight (hours):</strong> ${
              selectedRecord.daylightDuration
            }</p>
            <p style="margin-bottom: 5px;"><strong style="color: #555;">Rainfall (mm):</strong> ${
              selectedRecord.rainSum
            }</p>
          </div>
        </div>
      </div>

      ${
        selectedRecord.urea && selectedRecord.tsp && selectedRecord.mop
          ? `
        <div style="background-color: #e8f5e9; padding: 20px; border-radius: 8px; border: 1px solid #c8e6c9; margin-bottom: 30px;">
          <h3 style="color: #2E7D32; font-size: 20px; font-weight: bold; margin-bottom: 15px;">
            <span style="display: inline-block; width: 25px; height: 25px; background-color: #66BB6A; border-radius: 50%; text-align: center; line-height: 25px; color: white; font-size: 16px; margin-right: 10px;">&#x1F331;</span>
            Fertilizer Recommendation (kg/ha)
          </h3>
          <ul style="list-style-type: none; padding: 0; margin: 0;">
            <li style="margin-bottom: 8px; padding-left: 25px; position: relative;">
                <span style="position: absolute; left: 0; color: #4CAF50; font-size: 18px;">&bull;</span>
                <strong style="color: #333;">Urea:</strong> <span style="color: #2E7D32; font-weight: bold;">${selectedRecord.urea}</span>
            </li>
            <li style="margin-bottom: 8px; padding-left: 25px; position: relative;">
                <span style="position: absolute; left: 0; color: #4CAF50; font-size: 18px;">&bull;</span>
                <strong style="color: #333;">TSP:</strong> <span style="color: #2E7D32; font-weight: bold;">${selectedRecord.tsp}</span>
            </li>
            <li style="margin-bottom: 8px; padding-left: 25px; position: relative;">
                <span style="position: absolute; left: 0; color: #4CAF50; font-size: 18px;">&bull;</span>
                <strong style="color: #333;">MOP:</strong> <span style="color: #2E7D32; font-weight: bold;">${selectedRecord.mop}</span>
            </li>
          </ul>
          <p style="font-size: 10px; color: #666; margin-top: 20px; font-style: italic; text-align: right;">
            *Recommendations are general and may vary based on specific farm conditions.
          </p>
        </div>
      `
          : `
        <div style="background-color: #fffde7; padding: 20px; border-radius: 8px; border: 1px solid #ffe082; margin-bottom: 30px;">
          <p style="font-size: 14px; color: #ff8f00; font-weight: bold; text-align: center;">
            No specific fertilizer recommendation available for this crop type in the recorded data.
          </p>
        </div>
      `
      }

      <div style="text-align: center; font-size: 10px; color: #999; margin-top: 40px; padding-top: 15px; border-top: 1px solid #f0f0f0;">
        Generated by Plant Growth Suitability Analyzer on ${moment().format(
          "MMMM D, YYYY"
        )}
      </div>
    `;

    document.body.appendChild(printContent);

    const canvas = await html2canvas(printContent, {
      scale: 3, // Increased scale for even higher resolution
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff", // Explicitly ensure white background
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);

    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 10; // 10mm margin on all sides

    let currentHeight = 0;
    const imgRatio = imgProps.width / imgProps.height;
    let imgDisplayWidth = pageWidth - 2 * margin;
    let imgDisplayHeight = imgDisplayWidth / imgRatio; // Correctly calculated image height for display

    // Corrected the variable name here from `imgHeight` to `imgDisplayHeight`
    while (currentHeight < imgDisplayHeight) {
      if (currentHeight > 0) {
        pdf.addPage();
      }
      // Calculate the Y position for the current slice of the image
      const sliceHeight = Math.min(
        imgDisplayHeight - currentHeight,
        pageHeight - 2 * margin
      );
      const startY = currentHeight * (imgProps.height / imgDisplayHeight); // Y-coordinate in original image
      const endY =
        (currentHeight + sliceHeight) * (imgProps.height / imgDisplayHeight); // Y-coordinate in original image

      const canvasSlice = document.createElement("canvas");
      canvasSlice.width = imgProps.width;
      canvasSlice.height = endY - startY;
      const ctx = canvasSlice.getContext("2d");
      ctx.drawImage(
        canvas,
        0,
        startY,
        imgProps.width,
        endY - startY,
        0,
        0,
        canvasSlice.width,
        canvasSlice.height
      );

      const sliceImgData = canvasSlice.toDataURL("image/png");
      pdf.addImage(
        sliceImgData,
        "PNG",
        margin,
        margin,
        imgDisplayWidth,
        sliceHeight
      );

      currentHeight += sliceHeight;
    }

    pdf.save(
      `Soil_Analysis_${selectedRecord.cropType}_${selectedRecord.date}.pdf`
    );
    document.body.removeChild(printContent); // Clean up the temporary element
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-white p-4">
        <FaSpinner className="animate-spin text-green-500 text-4xl mr-3" />
        <p className="text-xl text-gray-600">Loading analysis history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-white p-4">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md max-w-lg text-center">
          <FaTimesCircle className="text-red-500 text-3xl mb-3" />
          <p className="font-semibold text-lg mb-2">
            Oops! Something went wrong.
          </p>
          <p className="text-sm">{error}</p>
          <button
            onClick={handleViewHistory}
            className="mt-6 flex items-center justify-center px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200 text-sm"
          >
            <FaArrowLeft className="mr-2" /> Back to Analysis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={handleViewHistory}
          className="mb-6 inline-flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <FaArrowLeft className="mr-2" /> Back to Analysis
        </button>

        <h1 className="text-4xl font-extrabold text-green-800 mb-4 text-center flex items-center justify-center gap-3">
          <FaHistory className="text-green-600 text-4xl" /> Plant Growth
          Analysis History
        </h1>
        <p className="text-center text-gray-600 mb-10 text-lg">
          A record of your past soil analysis results and fertilizer
          recommendations.
        </p>

        {records.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-xl shadow-lg border border-gray-200 max-w-xl mx-auto">
            <FaSeedling className="text-green-400 text-6xl mb-6 mx-auto" />
            <p className="text-2xl font-semibold text-gray-700 mb-3">
              No Analysis History Yet!
            </p>
            <p className="text-md text-gray-500">
              It looks like you haven't performed any soil analyses. Start a new
              analysis on the main page to see your results recorded here.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-8 inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-200 text-base font-medium"
            >
              Start New Analysis
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {records.map((record) => (
              <div
                key={record.id}
                className="bg-white shadow-xl rounded-xl p-6 border border-green-100 flex flex-col justify-between transform hover:scale-105 transition duration-300 cursor-pointer"
                onClick={() => openModal(record)} // Make the whole card clickable
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                      <FaSeedling className="text-green-600" />{" "}
                      {record.cropType}
                    </h2>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        record.predictedClass === "Suitable"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {record.predictedClass}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    Analyzed on:{" "}
                    <span className="font-medium">{record.createdAt}</span>
                  </p>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>
                      <span className="font-medium">Soil:</span>{" "}
                      {record.soilType}
                    </p>
                    <p>
                      <span className="font-medium">PH:</span> {record.phValue}
                    </p>
                    <p>
                      <span className="font-medium">K:</span> {record.potassium}{" "}
                      ppm
                    </p>
                    <p>
                      <span className="font-medium">P:</span>{" "}
                      {record.phosphorus} ppm
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(record);
                  }} // Stop propagation to prevent card click
                  className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm transition duration-200"
                >
                  <FaInfoCircle className="mr-2" /> View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4"
      >
        <div
          className="bg-white rounded-xl p-8 w-full max-w-2xl shadow-2xl relative"
          ref={pdfRef}
        >
          {selectedRecord && (
            <>
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
              >
                &times;
              </button>
              <h3 className="text-3xl font-bold mb-6 text-green-700 text-center">
                Detailed Analysis Report
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-700 mb-8">
                <div>
                  <p className="text-lg font-semibold text-green-600 mb-2">
                    Crop & Suitability
                  </p>
                  <p className="text-md">
                    <strong className="font-medium">Crop Type:</strong>{" "}
                    {selectedRecord.cropType}
                  </p>
                  <p className="text-md flex items-center">
                    <strong className="font-medium">Growth Suitability:</strong>
                    <span
                      className={`ml-2 font-bold ${
                        selectedRecord.predictedClass === "Suitable"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {selectedRecord.predictedClass}
                    </span>
                    {selectedRecord.predictedClass === "Suitable" ? (
                      <FaCheckCircle className="ml-1 text-green-500" />
                    ) : (
                      <FaTimesCircle className="ml-1 text-red-500" />
                    )}
                  </p>
                  <p className="text-md">
                    <strong className="font-medium">Confidence:</strong>{" "}
                    {(selectedRecord.confidence * 100).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-green-600 mb-2">
                    Soil & Climate Data
                  </p>
                  <p className="text-md">
                    <strong className="font-medium">Analysis Date:</strong>{" "}
                    {selectedRecord.date}
                  </p>
                  <p className="text-md">
                    <strong className="font-medium">Soil Type:</strong>{" "}
                    {selectedRecord.soilType}
                  </p>
                  <p className="text-md">
                    <strong className="font-medium">PH Value:</strong>{" "}
                    {selectedRecord.phValue}
                  </p>
                  <p className="text-md">
                    <strong className="font-medium">Potassium (ppm):</strong>{" "}
                    {selectedRecord.potassium}
                  </p>
                  <p className="text-md">
                    <strong className="font-medium">Phosphorus (ppm):</strong>{" "}
                    {selectedRecord.phosphorus}
                  </p>
                  <p className="text-md">
                    <strong className="font-medium">Avg. Temp (°C):</strong>{" "}
                    {selectedRecord.tempMean}
                  </p>
                  <p className="text-md">
                    <strong className="font-medium">Daylight (hours):</strong>{" "}
                    {selectedRecord.daylightDuration}
                  </p>
                  <p className="text-md">
                    <strong className="font-medium">Rainfall (mm):</strong>{" "}
                    {selectedRecord.rainSum}
                  </p>
                </div>
              </div>

              {selectedRecord.urea &&
              selectedRecord.tsp &&
              selectedRecord.mop ? (
                <div className="bg-green-50 border-l-4 border-green-300 p-4 rounded-lg mb-8">
                  <h4 className="text-lg font-bold text-green-800 mb-2">
                    Fertilizer Recommendation (kg/ha):
                  </h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>
                      <strong>Urea:</strong> {selectedRecord.urea}
                    </li>
                    <li>
                      <strong>TSP:</strong> {selectedRecord.tsp}
                    </li>
                    <li>
                      <strong>MOP:</strong> {selectedRecord.mop}
                    </li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-2 italic">
                    *Recommendations are general and may vary based on specific
                    farm conditions.
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-300 text-yellow-800 p-4 rounded-lg mb-8">
                  <p className="text-sm font-semibold">
                    No specific fertilizer recommendation available for this
                    crop type in the recorded data.
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 text-sm font-medium"
                >
                  Close
                </button>
                <button
                  onClick={downloadPDF}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 text-sm font-medium inline-flex items-center"
                >
                  <FaDownload className="mr-2" /> Download Report
                </button>
              </div>
            </>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default HistoryPage;
