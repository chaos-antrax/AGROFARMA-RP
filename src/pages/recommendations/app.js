"use client";

import { useState } from "react";
import CropRecommendation from "./CropRecommendation";
import RecommendationResults from "./RecommendationResults";
import SavedSessions from "./SavedSessions";

const App = () => {
  const [currentView, setCurrentView] = useState("recommendation");
  const [results, setResults] = useState(null);

  const handleShowResults = (data) => {
    setResults(data);
    setCurrentView("results");
  };

  const handleBackToForm = () => {
    setCurrentView("recommendation");
    setResults(null);
  };

  const handleSaveSession = (sessionData) => {
    // Handle session save if needed
    console.log("Session saved:", sessionData);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "recommendation":
        return <CropRecommendation onShowResults={handleShowResults} />;
      case "results":
        return (
          <RecommendationResults
            results={results}
            onBack={handleBackToForm}
            onSaveSession={handleSaveSession}
          />
        );
      case "sessions":
        return <SavedSessions />;
      default:
        return <CropRecommendation onShowResults={handleShowResults} />;
    }
  };

  return (
    <div className="App">
      {/* Navigation buttons for testing - remove these in your actual implementation */}
      <div className="fixed top-4 right-4 z-50 flex space-x-2">
        <button
          onClick={() => setCurrentView("recommendation")}
          className={`px-3 py-1 rounded text-sm ${
            currentView === "recommendation"
              ? "bg-green-600 text-white"
              : "bg-white text-gray-600"
          }`}
        >
          Form
        </button>
        <button
          onClick={() => setCurrentView("sessions")}
          className={`px-3 py-1 rounded text-sm ${
            currentView === "sessions"
              ? "bg-green-600 text-white"
              : "bg-white text-gray-600"
          }`}
        >
          Sessions
        </button>
      </div>

      {renderCurrentView()}
    </div>
  );
};

export default App;
