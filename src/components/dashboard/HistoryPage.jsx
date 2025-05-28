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

  // get the data from firebase storage when visit the page
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const historyRef = collection(db, "soilAnalysisHistory");
        const q = query(historyRef, orderBy("createdAt", "desc"), limit(50));
        const querySnapshot = await getDocs(q);
        const fetchedRecords = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // Ensure 'date' field is also formatted if it's a Firestore Timestamp
          // For example, if 'date' is also a timestamp:
          // date: doc.data().date ? moment(doc.data().date.toDate()).format("MMM D, YYYY") : "N/A",
          createdAt: doc.data().createdAt
            ? moment(doc.data().createdAt.toDate()).format("MMM D, YYYY h:mm A")
            : "N/A",
        }));

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
    // Define a fixed width for rendering, helps with consistent layout for html2canvas
    printContent.style.width = "800px";
    printContent.style.margin = "0 auto"; // Center it if it were visible
    printContent.style.padding = "40px"; // Increased padding
    printContent.style.fontFamily =
      "Arial, 'Helvetica Neue', Helvetica, sans-serif";
    printContent.style.fontSize = "12px"; // Base font size
    printContent.style.color = "#333333"; // Dark gray for text
    printContent.style.lineHeight = "1.6";
    printContent.style.backgroundColor = "#ffffff";
    printContent.style.boxSizing = "border-box";

    // Determine predicted class color
    const predictedClassColor =
      selectedRecord.predictedClass === "Suitable" ? "#4CAF50" : "#EF5350"; // Green for Suitable, Red for Unsuitable
    const predictedClassText =
      selectedRecord.predictedClass === "Suitable"
        ? "Suitable for Growth"
        : "Not Ideal for Growth";

    printContent.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e0e0e0;">
        <h1 style="color: #1B5E20; font-size: 28px; font-weight: bold; margin: 0 0 5px 0;">Growth Suitability Report</h1>
        <p style="color: #4CAF50; font-size: 16px; margin: 0;">Detailed Analysis for ${
          selectedRecord.cropType
        }</p>
      </div>

      <div style="margin-bottom: 25px; background-color: #F1F8E9; padding: 20px; border-radius: 8px; border-left: 5px solid #66BB6A;">
        <h3 style="color: #2E7D32; font-size: 20px; font-weight: bold; margin:0 0 15px 0; display: flex; align-items: center;">
          <span style="display: inline-block; width: 28px; height: 28px; background-color: #66BB6A; border-radius: 50%; text-align: center; line-height: 28px; color: white; font-size: 16px; margin-right: 12px; font-weight:normal;"></span>
          Growth Suitability Overview
        </h3>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding: 10px; background-color: #ffffff; border-radius: 6px; border: 1px solid #DCE775;">
          <p style="font-size: 15px; font-weight: 600; color: #333; margin:0;">Predict Result:</p>
          <span style="background-color: ${predictedClassColor}; color: white; padding: 8px 15px; border-radius: 18px; font-weight: bold; font-size: 15px;">
            ${predictedClassText}
          </span>
        </div>
        <p style="font-size: 13px; color: #555555; text-align: right; margin: 5px 5px 0 0;">
          Confidence Score: <span style="font-weight: bold; color: #1B5E20;">${(
            selectedRecord.confidence * 100
          ).toFixed(2)}%</span>
        </p>
      </div>

      <div style="margin-bottom: 25px; background-color: #E3F2FD; padding: 20px; border-radius: 8px; border-left: 5px solid #42A5F5;">
        <h3 style="color: #1565C0; font-size: 20px; font-weight: bold; margin:0 0 15px 0; display: flex; align-items: center;">
          <span style="display: inline-block; width: 28px; height: 28px; background-color: #42A5F5; border-radius: 50%; text-align: center; line-height: 28px; color: white; font-size: 16px; margin-right: 12px; font-weight:normal;"></span>
          Soil & Weather Data
        </h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px 20px; font-size: 13px;">
          ${/* Column 1 */ ""}
          <div>
            <p style="margin: 0 0 6px 0;"><strong style="color: #424242; font-weight: 600; min-width: 110px; display: inline-block;">Analysis Date:</strong> <span style="color: #0D47A1;">${
              selectedRecord.date || selectedRecord.createdAt
            }</span></p>
            <p style="margin: 0 0 6px 0;"><strong style="color: #424242; font-weight: 600; min-width: 110px; display: inline-block;">Soil Type:</strong> <span style="color: #0D47A1;">${
              selectedRecord.soilType
            }</span></p>
            <p style="margin: 0 0 6px 0;"><strong style="color: #424242; font-weight: 600; min-width: 110px; display: inline-block;">PH Value:</strong> <span style="color: #0D47A1;">${
              selectedRecord.phValue
            }</span></p>
            <p style="margin: 0 0 6px 0;"><strong style="color: #424242; font-weight: 600; min-width: 110px; display: inline-block;">Potassium:</strong> <span style="color: #0D47A1;">${
              selectedRecord.potassium
            } ppm</span></p>
          </div>
          ${/* Column 2 */ ""}
          <div>
            <p style="margin: 0 0 6px 0;"><strong style="color: #424242; font-weight: 600; min-width: 120px; display: inline-block;">Phosphorus:</strong> <span style="color: #0D47A1;">${
              selectedRecord.phosphorus
            } ppm</span></p>
            <p style="margin: 0 0 6px 0;"><strong style="color: #424242; font-weight: 600; min-width: 120px; display: inline-block;">Average Temp:</strong> <span style="color: #0D47A1;">${
              selectedRecord.tempMean
            } °C</span></p>
            <p style="margin: 0 0 6px 0;"><strong style="color: #424242; font-weight: 600; min-width: 120px; display: inline-block;">Daylight:</strong> <span style="color: #0D47A1;">${
              selectedRecord.daylightDuration
            } hours</span></p>
            <p style="margin: 0 0 6px 0;"><strong style="color: #424242; font-weight: 600; min-width: 120px; display: inline-block;">Rainfall:</strong> <span style="color: #0D47A1;">${
              selectedRecord.rainSum
            } mm</span></p>
          </div>
        </div>
      </div>

      ${
        selectedRecord.urea && selectedRecord.tsp && selectedRecord.mop
          ? `
        <div style="background-color: #E8F5E9; padding: 20px; border-radius: 8px; border-left: 5px solid #388E3C; margin-bottom: 30px;">
          <h3 style="color: #1B5E20; font-size: 20px; font-weight: bold; margin:0 0 15px 0; display: flex; align-items: center;">
            <span style="display: inline-block; width: 28px; height: 28px; background-color: #388E3C; border-radius: 50%; text-align: center; line-height: 28px; color: white; font-size: 16px; margin-right: 12px; font-weight:normal;"></span>
            Fertilizer Recommendation (kg/ha)
          </h3>
          <ul style="list-style-type: none; padding: 0; margin: 0; font-size: 14px;">
            <li style="margin-bottom: 8px; padding: 8px 0; border-bottom: 1px dashed #C8E6C9;">
                <strong style="color: #333333; font-weight: 600; min-width: 80px; display: inline-block;">Urea:</strong> 
                <span style="color: #2E7D32; font-weight: bold;">${selectedRecord.urea}</span>
            </li>
            <li style="margin-bottom: 8px; padding: 8px 0; border-bottom: 1px dashed #C8E6C9;">
                <strong style="color: #333333; font-weight: 600; min-width: 80px; display: inline-block;">TSP:</strong> 
                <span style="color: #2E7D32; font-weight: bold;">${selectedRecord.tsp}</span>
            </li>
            <li style="padding: 8px 0;">
                <strong style="color: #333333; font-weight: 600; min-width: 80px; display: inline-block;">MOP:</strong> 
                <span style="color: #2E7D32; font-weight: bold;">${selectedRecord.mop}</span>
            </li>
          </ul>
          <p style="font-size: 11px; color: #616161; margin-top: 15px; font-style: italic; text-align: right;">
            *These are general recommendations. Adjust based on local conditions and soil tests.
          </p>
        </div>
      `
          : `
        <div style="background-color: #FFF9C4; padding: 20px; border-radius: 8px; border-left: 5px solid #FBC02D; margin-bottom: 30px; text-align: center;">
          <p style="font-size: 14px; color: #F57F17; font-weight: 600; margin:0;">
            No specific fertilizer recommendation available for this crop type in the recorded data.
          </p>
        </div>
      `
      }

      <div style="text-align: center; font-size: 10px; color: #757575; margin-top: 30px; padding-top: 15px; border-top: 1px solid #eeeeee;">
        Report generated by Plant Growth Suitability Analyzer on ${moment().format(
          "MMMM D, YYYY, h:mm A"
        )}
        <br/>
        Document ID: ${selectedRecord.id}
      </div>
    `;

    document.body.appendChild(printContent);

    try {
      const canvas = await html2canvas(printContent, {
        scale: 2.5, // Adjusted scale for balance between quality and performance
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        scrollX: 0, // Prevent horizontal scroll issues
        scrollY: -window.scrollY, // Account for page scroll
        windowWidth: printContent.scrollWidth, // Use scrollWidth for full content
        windowHeight: printContent.scrollHeight, // Use scrollHeight for full content
      });

      const imgData = canvas.toDataURL("image/png", 1.0); // Quality 1.0
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);
      const margin = 15; // 15mm margin

      // Calculate dimensions to fit image within PDF page margins
      const usableWidth = pdfWidth - 2 * margin;
      const usableHeight = pdfHeight - 2 * margin;

      const imgRatio = imgProps.width / imgProps.height;
      let finalImgWidth = imgProps.width;
      let finalImgHeight = imgProps.height;

      if (finalImgWidth > usableWidth) {
        finalImgWidth = usableWidth;
        finalImgHeight = finalImgWidth / imgRatio;
      }

      // If after scaling to width, height is still too large for one page, it will be split.
      // For a single image that needs to be scaled to fit one page (if small enough) or split if too tall:
      const effectiveImgWidthInPdf = usableWidth;
      const effectiveImgHeightInPdf = effectiveImgWidthInPdf / imgRatio;

      let currentPosition = 0;
      const totalImageHeightInPdf = effectiveImgHeightInPdf;

      while (currentPosition < totalImageHeightInPdf) {
        if (currentPosition > 0) {
          pdf.addPage();
        }

        // Calculate the height of the slice for the current PDF page
        const heightForThisPage = Math.min(
          totalImageHeightInPdf - currentPosition,
          usableHeight
        );

        // Calculate source image (canvas) coordinates for this slice
        // sy: y-coordinate in original canvas pixels
        // sHeight: height of slice in original canvas pixels
        const sy = (currentPosition / totalImageHeightInPdf) * imgProps.height;
        const sHeight =
          (heightForThisPage / totalImageHeightInPdf) * imgProps.height;

        // Create a temporary canvas for the slice
        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = imgProps.width;
        sliceCanvas.height = sHeight;
        const sliceCtx = sliceCanvas.getContext("2d");

        // Draw the slice from the main canvas to the temporary slice canvas
        sliceCtx.drawImage(
          canvas,
          0,
          sy,
          imgProps.width,
          sHeight,
          0,
          0,
          imgProps.width,
          sHeight
        );

        const sliceImgData = sliceCanvas.toDataURL("image/png", 1.0);

        pdf.addImage(
          sliceImgData,
          "PNG",
          margin,
          margin,
          effectiveImgWidthInPdf,
          heightForThisPage
        );
        currentPosition += heightForThisPage;
      }

      pdf.save(
        `Soil_Analysis_${selectedRecord.cropType}_${selectedRecord.id}.pdf`
      );
    } catch (e) {
      console.error("Error generating PDF:", e);
      // Optionally, inform the user that PDF generation failed
      alert("Could not generate PDF. Please try again.");
    } finally {
      document.body.removeChild(printContent); // Clean up the temporary element
    }
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
          Suitability History
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
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
                    <span className="font-medium">{record.createdAt}</span>{" "}
                    {/* Using createdAt for display consistency */}
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
          className="bg-white rounded-xl p-8 w-full max-w-2xl shadow-2xl relative overflow-y-auto max-h-[90vh]"
          ref={pdfRef}
        >
          {" "}
          {/* Added overflow and max-height for modal */}
          {selectedRecord && (
            <>
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl z-10" // Ensure button is above content
              >
                ×
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
                    Soil & Weather Data
                  </p>
                  <p className="text-md">
                    <strong className="font-medium">Analysis Date:</strong>{" "}
                    {selectedRecord.date || selectedRecord.createdAt}
                  </p>{" "}
                  {/* Fallback to createdAt */}
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
