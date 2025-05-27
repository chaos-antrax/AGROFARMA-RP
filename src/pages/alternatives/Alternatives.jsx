import React, { useState, useEffect } from "react";
import AlternativeForm from "../../components/alternatives/alternatives/AlternativeForm";
import TipsSection from "../../components/alternatives/alternatives/TipsSection";
import { useNavigate } from "react-router-dom";
import Recommendations from "./Recommendations";

const Alternatives = () => {
  const [vegetables, setVegetables] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  useEffect(() => {
    const url = `${process.env.REACT_APP_CROP_RECOMMENDATION_API}/api/vegetables`;
    console.log("Fetching from:", url);

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch vegetables");
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);
        setVegetables(data.vegetables); // correct based on your Postman response
      })
      .catch((err) => {
        setError("Failed to load crop data. Please try again later.");
        console.error("Fetch error:", err);
      });
  }, []);

  console.log("Vegetables:", vegetables);

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setRecommendations(null);
    setSelectedCrop(null);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_CROP_RECOMMENDATION_API}/api/recommend`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get recommendations");
      }
      setRecommendations(data);
      setIsFormSubmitted(true);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCropSelect = (crop) => {
    setSelectedCrop(crop);
  };

  const navigate = useNavigate();

  return isFormSubmitted ? (
    <Recommendations recommendations={recommendations} />
  ) : (
    <div className="bg-gradient-to-l from-[#a0fbc1] to-white overflow-hidden max-h-[96vh] rounded-xl grid grid-cols-2">
      <div className="col-span-1 flex items-center justify-center relative overflow-hidden">
        <div className="absolute bg-[#72f5b3] w-[100vh] h-[100vh] rounded-3xl rotate-[20deg] left-[-48%] top-[-2%] z-0" />
        <AlternativeForm
          vegetables={vegetables}
          onSubmit={handleFormSubmit}
          loading={loading}
        />
      </div>
      <div className="col-span-1">
        <TipsSection />
      </div>
    </div>
  );
};

export default Alternatives;
