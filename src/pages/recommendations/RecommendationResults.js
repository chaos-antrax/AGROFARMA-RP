"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Save,
  Star,
  TrendingUp,
  Calendar,
  Sprout,
  AlertCircle,
  CheckCircle,
  XCircle,
  TrendingDown,
  AlertTriangle,
  Brain,
  X,
  Loader,
} from "lucide-react";

const baseUrl = process.env.NODE_API_URL || "http://localhost:8000";
const ollamaUrl = process.env.OLLAMA_API_URL || "http://localhost:3001";

const RecommendationResults = ({ results, onBack, onSaveSession }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [showInsightsModal, setShowInsightsModal] = useState(false);
  const [insights, setInsights] = useState("");
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [insightsError, setInsightsError] = useState("");

  const getScoreColor = (score) => {
    if (score >= 70) return "text-green-600 bg-green-100";
    if (score >= 50) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getScoreIcon = (score) => {
    if (score >= 70) return <CheckCircle className="w-4 h-4" />;
    if (score >= 50) return <AlertCircle className="w-4 h-4" />;
    return <XCircle className="w-4 h-4" />;
  };

  const handleSaveSession = async () => {
    setIsSaving(true);
    try {
      const sessionData = {
        ...results,
        timestamp: new Date().toISOString(),
        sessionId: Date.now().toString(),
      };

      // Placeholder API call - replace with your actual endpoint
      const response = await fetch(`${baseUrl}/api/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionData),
      });

      if (response.ok) {
        alert("Session saved successfully!");
        if (onSaveSession) {
          onSaveSession(sessionData);
        }
      } else {
        throw new Error("Failed to save session");
      }
    } catch (error) {
      alert("Failed to save session. Please try again.");
      console.error("Error saving session:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatCropName = (cropName) => {
    return cropName.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getMonthName = (monthNumber) => {
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
    return months[monthNumber - 1];
  };

  // Get desired crop analysis
  const getDesiredCropAnalysis = () => {
    if (!results.desiredCrop) return null;

    const desiredCropResult = results.recommendations.find(
      (rec) => rec.crop.toLowerCase() === results.desiredCrop.toLowerCase()
    );

    if (!desiredCropResult) return null;

    const topThree = results.recommendations.slice(0, 3);
    const desiredCropRank =
      results.recommendations.findIndex(
        (rec) => rec.crop.toLowerCase() === results.desiredCrop.toLowerCase()
      ) + 1;

    return {
      crop: desiredCropResult,
      rank: desiredCropRank,
      topThree,
      isInTopThree: desiredCropRank <= 3,
    };
  };

  // Get worst performing crops
  const getWorstCrops = () => {
    const validCrops = results.recommendations.filter(
      (rec) => rec.finalScore > 10
    ); // Filter out error crops
    return validCrops.slice(-2).reverse(); // Get last 2 and reverse to show worst first
  };

  const generateInsights = async () => {
    setLoadingInsights(true);
    setInsightsError("");
    setShowInsightsModal(true);

    try {
      const response = await fetch(`${ollamaUrl}/api/insights`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          results: results,
          topRecommendations: results.recommendations.slice(0, 5),
          desiredCropAnalysis: getDesiredCropAnalysis(),
          worstCrops: getWorstCrops(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setInsights(data.insights);
      } else {
        const errorData = await response.json();
        setInsightsError(errorData.error || "Failed to generate insights");
      }
    } catch (error) {
      console.error("Error generating insights:", error);
      setInsightsError(
        "Failed to connect to insights service. Please try again."
      );
    } finally {
      setLoadingInsights(false);
    }
  };

  const desiredCropAnalysis = getDesiredCropAnalysis();
  const worstCrops = getWorstCrops();

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-4 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Crop Recommendations
              </h1>
              <p className="text-gray-600">
                Planting in {getMonthName(results.plantingMonth)} • Harvest in{" "}
                {getMonthName(results.harvestMonth)} • {results.monthsToHarvest}{" "}
                month(s) to harvest
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={generateInsights}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Brain className="w-4 h-4 mr-2" />
              Get More Insights
            </button>
            <button
              onClick={handleSaveSession}
              disabled={isSaving}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Session"}
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-blue-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Planting Month</p>
                <p className="font-semibold">
                  {getMonthName(results.plantingMonth)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Harvest Month</p>
                <p className="font-semibold">
                  {getMonthName(results.harvestMonth)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex items-center">
              <Sprout className="w-5 h-5 text-purple-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Previous Crop</p>
                <p className="font-semibold">
                  {results.previousCrop || "None"}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Top Score</p>
                <p className="font-semibold">
                  {results.recommendations[0]?.finalScore}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Desired Crop Analysis */}
        {desiredCropAnalysis && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <Star className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">
                Your Desired Crop Analysis
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {formatCropName(desiredCropAnalysis.crop.crop)}
                  </h3>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">
                      Rank #{desiredCropAnalysis.rank}
                    </span>
                    <div
                      className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(
                        desiredCropAnalysis.crop.finalScore
                      )}`}
                    >
                      {getScoreIcon(desiredCropAnalysis.crop.finalScore)}
                      <span className="ml-1">
                        {desiredCropAnalysis.crop.finalScore}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base Score:</span>
                    <span className="font-medium">
                      {desiredCropAnalysis.crop.baseScore}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rotation Score:</span>
                    <span className="font-medium">
                      {desiredCropAnalysis.crop.rotationScore}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Seasonal Score:</span>
                    <span className="font-medium">
                      {desiredCropAnalysis.crop.seasonalScore}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Maturity Score:</span>
                    <span className="font-medium">
                      {desiredCropAnalysis.crop.maturityScore}%
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Comparison with Top Performers
                </h4>
                <div className="space-y-3">
                  {desiredCropAnalysis.topThree.map((topCrop, index) => {
                    const scoreDiff =
                      topCrop.finalScore - desiredCropAnalysis.crop.finalScore;
                    return (
                      <div
                        key={topCrop.crop}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                            {index + 1}
                          </span>
                          <span className="text-sm font-medium">
                            {formatCropName(topCrop.crop)}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {topCrop.finalScore}%
                          </div>
                          {scoreDiff > 0 && (
                            <div className="text-xs text-red-600">
                              +{scoreDiff.toFixed(1)}% better
                            </div>
                          )}
                          {scoreDiff === 0 && (
                            <div className="text-xs text-green-600">
                              Same score
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    {desiredCropAnalysis.isInTopThree
                      ? `Great choice! Your desired crop ranks #${desiredCropAnalysis.rank} among all recommendations.`
                      : `Your desired crop ranks #${desiredCropAnalysis.rank}. Consider the top performers for better results.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Crops to Avoid */}
        {worstCrops.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">
                Crops to Avoid
              </h2>
            </div>

            <p className="text-gray-600 mb-4">
              Based on current conditions, these crops are not recommended for
              planting:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {worstCrops.map((crop, index) => (
                <div
                  key={crop.crop}
                  className="border border-red-200 rounded-lg p-4 bg-red-50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">
                      {formatCropName(crop.crop)}
                    </h3>
                    <div className="flex items-center text-red-600">
                      <TrendingDown className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">
                        {crop.finalScore}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    {crop.rotationComment && (
                      <p className="text-gray-700">
                        <span className="font-medium">Rotation:</span>{" "}
                        {crop.rotationComment}
                      </p>
                    )}
                    {crop.seasonalComment && (
                      <p className="text-gray-700">
                        <span className="font-medium">Seasonal:</span>{" "}
                        {crop.seasonalComment}
                      </p>
                    )}
                    {crop.maturityComment && (
                      <p className="text-gray-700">
                        <span className="font-medium">Maturity:</span>{" "}
                        {crop.maturityComment}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations Grid */}
        <div className="grid gap-6">
          {results.recommendations.map((recommendation, index) => (
            <div
              key={recommendation.crop}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                        index === 0
                          ? "bg-yellow-200 text-yellow-800"
                          : index === 1
                          ? "bg-gray-200 text-gray-700"
                          : index === 2
                          ? "bg-orange-200 text-orange-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {formatCropName(recommendation.crop)}
                    </h3>
                    {results.desiredCrop &&
                      recommendation.crop.toLowerCase() ===
                        results.desiredCrop.toLowerCase() && (
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          Your Choice
                        </span>
                      )}
                  </div>
                  <div
                    className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(
                      recommendation.finalScore
                    )}`}
                  >
                    {getScoreIcon(recommendation.finalScore)}
                    <span className="ml-1">{recommendation.finalScore}%</span>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Base Score</p>
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${getScoreColor(
                        recommendation.baseScore
                      )}`}
                    >
                      {recommendation.baseScore}%
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Rotation</p>
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${getScoreColor(
                        recommendation.rotationScore
                      )}`}
                    >
                      {recommendation.rotationScore}%
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Seasonal</p>
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${getScoreColor(
                        recommendation.seasonalScore
                      )}`}
                    >
                      {recommendation.seasonalScore}%
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Maturity</p>
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${getScoreColor(
                        recommendation.maturityScore
                      )}`}
                    >
                      {recommendation.maturityScore}%
                    </div>
                  </div>
                </div>

                {/* Comments */}
                <div className="space-y-3">
                  {recommendation.rotationComment && (
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Rotation:</span>{" "}
                        {recommendation.rotationComment}
                      </p>
                    </div>
                  )}
                  {recommendation.seasonalComment && (
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Seasonal:</span>{" "}
                        {recommendation.seasonalComment}
                      </p>
                    </div>
                  )}
                  {recommendation.maturityComment && (
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Maturity:</span>{" "}
                        {recommendation.maturityComment}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="bg-gray-50 px-6 py-3">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Overall Recommendation Score</span>
                  <span>{recommendation.finalScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      recommendation.finalScore >= 70
                        ? "bg-green-500"
                        : recommendation.finalScore >= 50
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{
                      width: `${Math.min(recommendation.finalScore, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Insights Modal */}
      {showInsightsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <Brain className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  AI-Powered Crop Insights
                </h2>
              </div>
              <button
                onClick={() => setShowInsightsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {loadingInsights ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader className="w-8 h-8 animate-spin text-blue-600 mb-4" />
                  <p className="text-gray-600">
                    Analyzing your crop recommendations...
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    This may take a few moments
                  </p>
                </div>
              ) : insightsError ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Unable to Generate Insights
                  </h3>
                  <p className="text-gray-600 text-center mb-4">
                    {insightsError}
                  </p>
                  <button
                    onClick={generateInsights}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : insights ? (
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {insights}
                  </div>
                </div>
              ) : null}
            </div>

            {insights && (
              <div className="flex justify-end p-6 border-t border-gray-200">
                <button
                  onClick={() => setShowInsightsModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationResults;
