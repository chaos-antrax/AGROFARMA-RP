"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  Sprout,
} from "lucide-react";

const baseUrl = process.env.NODE_API_URL || "http://localhost:8000";

const SavedSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [selectedSession, setSelectedSession] = useState(null);

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

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    filterSessions();
  }, [sessions, searchTerm, filterMonth]);

  const fetchSessions = async () => {
    try {
      // Placeholder API call - replace with your actual endpoint
      const response = await fetch(`${baseUrl}/api/sessions/recommendations`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      } else {
        // Mock data for demonstration
        const mockSessions = [
          {
            sessionId: "1640995200000",
            timestamp: "2024-01-15T10:30:00.000Z",
            plantingMonth: 7,
            harvestMonth: 8,
            monthsToHarvest: 1,
            previousCrop: "Beans",
            year: 2024,
            recommendations: [
              {
                crop: "Brinjal",
                finalScore: 52.7,
                baseScore: 15.8,
                rotationScore: 80.0,
                seasonalScore: 90.0,
                maturityScore: 10.0,
              },
              {
                crop: "Tomato",
                finalScore: 50.1,
                baseScore: 7.1,
                rotationScore: 80.0,
                seasonalScore: 90.0,
                maturityScore: 10.0,
              },
            ],
          },
          {
            sessionId: "1640908800000",
            timestamp: "2024-01-10T14:20:00.000Z",
            plantingMonth: 6,
            harvestMonth: 9,
            monthsToHarvest: 3,
            previousCrop: "Potato",
            year: 2024,
            recommendations: [
              {
                crop: "Cabbage",
                finalScore: 68.5,
                baseScore: 25.3,
                rotationScore: 85.0,
                seasonalScore: 75.0,
                maturityScore: 80.0,
              },
            ],
          },
        ];
        setSessions(mockSessions);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const filterSessions = () => {
    let filtered = sessions;

    if (searchTerm) {
      filtered = filtered.filter(
        (session) =>
          session.previousCrop
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          session.recommendations.some((rec) =>
            rec.crop.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (filterMonth) {
      filtered = filtered.filter(
        (session) =>
          session.plantingMonth === Number.parseInt(filterMonth) ||
          session.harvestMonth === Number.parseInt(filterMonth)
      );
    }

    setFilteredSessions(filtered);
  };

  const deleteSession = async (sessionId) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      try {
        // Placeholder API call - replace with your actual endpoint
        const response = await fetch(
          `${baseUrl}/api/sessions/recommendations/${sessionId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          setSessions(
            sessions.filter((session) => session.sessionId !== sessionId)
          );
          alert("Session deleted successfully!");
        } else {
          throw new Error("Failed to delete session");
        }
      } catch (error) {
        alert("Failed to delete session. Please try again.");
        console.error("Error deleting session:", error);
      }
    }
  };

  const exportSession = (session) => {
    const dataStr = JSON.stringify(session, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `crop-session-${session.sessionId}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMonthName = (monthNumber) => {
    return months[monthNumber - 1];
  };

  const formatCropName = (cropName) => {
    return cropName.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading saved sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Saved Sessions
          </h1>
          <p className="text-gray-600">
            View and manage your crop recommendation history
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by crop name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
              >
                <option value="">All months</option>
                {months.map((month, index) => (
                  <option key={index} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-600 flex items-center">
              <Sprout className="w-4 h-4 mr-2" />
              {filteredSessions.length} session(s) found
            </div>
          </div>
        </div>

        {/* Sessions Grid */}
        {filteredSessions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Sprout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No sessions found
            </h3>
            <p className="text-gray-600">
              {sessions.length === 0
                ? "You haven't saved any crop recommendation sessions yet."
                : "Try adjusting your search or filter criteria."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredSessions.map((session) => (
              <div
                key={session.sessionId}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-green-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Session from {formatDate(session.timestamp)}
                      </h3>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          setSelectedSession(
                            selectedSession === session.sessionId
                              ? null
                              : session.sessionId
                          )
                        }
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => exportSession(session)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Export session"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteSession(session.sessionId)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete session"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Session Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Planting Month</p>
                      <p className="font-medium">
                        {getMonthName(session.plantingMonth)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Harvest Month</p>
                      <p className="font-medium">
                        {getMonthName(session.harvestMonth)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Previous Crop</p>
                      <p className="font-medium">
                        {session.previousCrop || "None"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Top Recommendation
                      </p>
                      <p className="font-medium">
                        {formatCropName(session.recommendations[0]?.crop)} (
                        {session.recommendations[0]?.finalScore}%)
                      </p>
                    </div>
                  </div>

                  {/* Top 3 Recommendations Preview */}
                  <div className="flex flex-wrap gap-2">
                    {session.recommendations.slice(0, 3).map((rec, index) => (
                      <span
                        key={rec.crop}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          index === 0
                            ? "bg-green-100 text-green-800"
                            : index === 1
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {formatCropName(rec.crop)} ({rec.finalScore}%)
                      </span>
                    ))}
                    {session.recommendations.length > 3 && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                        +{session.recommendations.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Detailed View */}
                  {selectedSession === session.sessionId && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-4">
                        All Recommendations
                      </h4>
                      <div className="space-y-3">
                        {session.recommendations.map((rec, index) => (
                          <div
                            key={rec.crop}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center">
                              <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                                {index + 1}
                              </span>
                              <span className="font-medium">
                                {formatCropName(rec.crop)}
                              </span>
                            </div>
                            <div className="flex space-x-4 text-sm">
                              <span className="text-gray-600">
                                Final: {rec.finalScore}%
                              </span>
                              <span className="text-gray-600">
                                Base: {rec.baseScore}%
                              </span>
                              <span className="text-gray-600">
                                Rotation: {rec.rotationScore}%
                              </span>
                              <span className="text-gray-600">
                                Seasonal: {rec.seasonalScore}%
                              </span>
                              <span className="text-gray-600">
                                Maturity: {rec.maturityScore}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedSessions;
