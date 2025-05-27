import React from "react";
import { useState } from "react";
import axios from "axios";

const Assistant = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(""); // Store prediction result
  const [loading, setLoading] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(""); // Left box
  const [selectedDisease, setSelectedDisease] = useState("Select the Disease"); // Right box

  // Plant details for left box (Unchanged)
  const plantInfo = {
    Tomato: (
      <p>
        <ul className="list-square list-inside">
          <li className="font-bold pb-2 underline">
            Best Time to Plant in Sri Lanka
          </li>
          <li className="pb-2">
            Dry Zone (North, East, Hambantota, Anuradhapura, Polonnaruwa) – Best
            in Maha Season (October - February)
          </li>
          <li className="pb-2">
            {" "}
            Wet Zone (Colombo, Kandy, Galle, Matara, Ratnapura) – Can be grown
            year-round but better in the Yala Season (April - August)
          </li>
          <li className="pb-2">
            Intermediate Zone (Kandy, Nuwara Eliya, Badulla) – Best grown during
            the cooler months (October - March)
          </li>
        </ul>
        <ul className="list-square list-inside">
          <li className="font-bold pb-2 underline">
            Week 1-2: Seed Germination
          </li>
          <li className="font-medium">Choose a Tomato Variety</li>
          <ul>
            <li className="pl-2 text-sm">
              Local Varieties: T-245, KC-1, Thilina (Recommended for Sri Lanka)
            </li>
            <li className="pl-2 text-sm pb-2">
              Hybrid Varieties: Maheshi, Lanka Cherry, Tharindu
            </li>
          </ul>
          <li className="font-medium">Prepare Seed Trays</li>
          <ul>
            <li className="pl-2 text-sm">
              Use a seed tray or poly bags with good soil
            </li>
            <li className="pl-2 text-sm pb-2">
              Mix compost + topsoil + sand in equal parts.
            </li>
          </ul>
          <li className="font-medium">Planting the Seeds</li>
          <ul>
            <li className="pl-2 text-sm">
              Sow 2-3 seeds per hole, ¼ inch deep.
            </li>
            <li className="pl-2 text-sm pb-2">
              Cover lightly with soil & spray water.
            </li>
          </ul>
          <li className="font-medium">Ideal Temperature for Germination</li>
          <ul>
            <li className="pl-2 text-sm">
              25-30°C (Warm climate in Sri Lanka is perfect).
            </li>
          </ul>
          <li className="font-medium">Watering</li>
          <ul>
            <li className="pl-2 text-sm">
              Water lightly twice a day (morning & evening).
            </li>
          </ul>
          <li className="pb-2">Seedlings Appear in 5-10 Days</li>
        </ul>
        <ul className="list-square list-inside">
          {/* Week 3-4: Seedling Growth & Transplanting */}
          <li className="font-bold pb-2 underline">
            Week 3-4: Seedling Growth & Transplanting
          </li>
          <li className="font-medium">Hardening the Seedlings</li>
          <ul>
            <li className="pl-2 text-sm">
              Keep seedlings in partial sunlight for 2-3 days before moving
              outside.
            </li>
          </ul>
          <li className="font-medium">Select the Growing Location</li>
          <ul>
            <li className="pl-2 text-sm">
              Use pots, grow bags, or open fields.
            </li>
            <li className="pl-2 text-sm pb-2">
              Need 6-8 hours of sunlight per day.
            </li>
          </ul>
          <li className="font-medium">Transplanting Seedlings</li>
          <ul>
            <li className="pl-2 text-sm">
              After 3-4 weeks, transfer to open ground or pots.
            </li>
            <li className="pl-2 text-sm pb-2">
              Maintain 30-45 cm spacing between plants.
            </li>
          </ul>
          <li className="font-medium">Soil Preparation for Transplanting</li>
          <ul>
            <li className="pl-2 text-sm">
              Mix soil with cow dung, compost, and sand.
            </li>
            <li className="pl-2 text-sm pb-2">Add NPK 10-10-10 fertilizer.</li>
          </ul>
          <li className="font-medium">Mulching</li>
          <ul>
            <li className="pl-2 text-sm">
              Use coconut husks or straw to retain moisture.
            </li>
          </ul>

          {/* Week 5-8: Vegetative Growth */}
          <li className="font-bold pb-2 underline">
            Week 5-8: Vegetative Growth
          </li>
          <li className="font-medium">Watering</li>
          <ul>
            <li className="pl-2 text-sm">Water every 2 days in dry seasons.</li>
            <li className="pl-2 text-sm pb-2">Morning watering is best.</li>
          </ul>
          <li className="font-medium">Fertilization</li>
          <ul>
            <li className="pl-2 text-sm">
              Apply organic compost every 2 weeks.
            </li>
            <li className="pl-2 text-sm pb-2">
              Use banana peel fertilizer for natural potassium.
            </li>
          </ul>
          <li className="font-medium">Pest & Disease Control</li>
          <ul>
            <li className="pl-2 text-sm">
              Watch for whiteflies, aphids, fungal diseases.
            </li>
            <li className="pl-2 text-sm pb-2">
              Use neem oil spray (Sri Lankan traditional method).
            </li>
          </ul>
          <li className="font-medium">Staking & Pruning</li>
          <ul>
            <li className="pl-2 text-sm">
              Tie plants to wooden sticks to support growth.
            </li>
            <li className="pl-2 text-sm pb-2">
              Remove bottom leaves for better airflow.
            </li>
          </ul>

          {/* Week 9-12: Flowering & Fruit Formation */}
          <li className="font-bold pb-2 underline">
            Week 9-12: Flowering & Fruit Formation
          </li>
          <li className="font-medium">Flowers Start Appearing</li>
          <ul>
            <li className="pl-2 text-sm">
              Shake the plant lightly for natural pollination.
            </li>
            <li className="pl-2 text-sm pb-2">
              Attract bees by planting marigolds nearby.
            </li>
          </ul>
          <li className="font-medium">
            Apply Potassium Fertilizer (NPK 5-10-10)
          </li>
          <ul>
            <li className="pl-2 text-sm">
              Helps with stronger fruit formation.
            </li>
          </ul>
          <li className="font-medium">Remove Weak Shoots</li>
          <ul>
            <li className="pl-2 text-sm">Improves fruit size & yield.</li>
          </ul>

          {/* Week 13-16: Fruit Growth & Ripening */}
          <li className="font-bold pb-2 underline">
            Week 13-16: Fruit Growth & Ripening
          </li>
          <li className="font-medium">Green Fruits Appear</li>
          <ul>
            <li className="pl-2 text-sm">
              Takes 2-3 weeks for tomatoes to grow fully.
            </li>
          </ul>
          <li className="font-medium">Water Consistently</li>
          <ul>
            <li className="pl-2 text-sm">
              Maintain moist soil (but not soggy).
            </li>
          </ul>
          <li className="font-medium">Disease Control</li>
          <ul>
            <li className="pl-2 text-sm">
              If leaves turn yellow or spotty, apply neem oil.
            </li>
            <li className="pl-2 text-sm pb-2">
              Remove infected leaves immediately.
            </li>
          </ul>
          <li className="font-medium">Harvesting Tomatoes</li>
          <ul>
            <li className="pl-2 text-sm">
              Pick tomatoes when red and slightly firm.
            </li>
            <li className="pl-2 text-sm pb-2">
              Use scissors to cut tomatoes without damaging the plant.
            </li>
          </ul>

          {/* Final Tips */}
          <li className="font-bold pb-2 underline">
            {" "}
            Sri Lanka-Specific Tomato Growing Tips
          </li>
          <ul>
            <li className="pl-2 text-sm">
              {" "}
              Best Locations – Upcountry (Nuwara Eliya, Bandarawela) is best for
              high-quality tomatoes.
            </li>
            <li className="pl-2 text-sm">
              Monsoon Protection – Use rain shelters or poly tunnels in heavy
              rain seasons.
            </li>
            <li className="pl-2 text-sm">
              {" "}
              Organic Growing – Many Sri Lankans use cow dung, compost & coconut
              husk mulch.
            </li>
            <li className="pl-2 text-sm pb-2">
              {" "}
              Market Strategy – Selling fresh tomatoes early in the season gives
              better profits.
            </li>
          </ul>

          {/* Total Growing Time */}
          <li className="font-bold pb-2 underline"> Total Growing Time</li>
          <ul>
            <li className="pl-2 text-sm">
              ✔ Determinate (Bush Type) – 90-100 Days (Harvest all at once).
            </li>
            <li className="pl-2 text-sm">
              ✔ Indeterminate (Vine Type) – 120+ Days (Keeps producing).
            </li>
          </ul>
        </ul>
      </p>
    ),
    Carrot: (
      <p>
        <ul className="list-square list-inside">
          {/* Stage 1: Seed Preparation & Germination */}
          <li className="font-bold pb-2 underline">
            Stage 1: Seed Preparation & Germination
          </li>
          <li className="font-medium">Choose a Carrot Variety</li>
          <ul>
            <li className="pl-2 text-sm">
              Local Varieties: Nuwara Eliya Carrot, Jaffna Carrot
            </li>
            <li className="pl-2 text-sm pb-2">
              Hybrid Varieties: Kuroda, New Kuroda, Nantes
            </li>
          </ul>
          <li className="font-medium">Ideal Climate & Temperature</li>
          <ul>
            <li className="pl-2 text-sm">
              Best grown in **Upcountry regions (Nuwara Eliya, Badulla,
              Bandarawela)**.
            </li>
            <li className="pl-2 text-sm pb-2">
              Cool temperatures support steady growth.
            </li>
          </ul>
          <li className="font-medium">Soil Preparation</li>
          <ul>
            <li className="pl-2 text-sm">
              Use **loose, well-drained, sandy loam soil**.
            </li>
            <li className="pl-2 text-sm pb-2">
              Mix compost and organic manure for better root development.
            </li>
          </ul>
          <li className="font-medium">Sowing the Seeds</li>
          <ul>
            <li className="pl-2 text-sm">
              Plant seeds directly into prepared soil.
            </li>
            <li className="pl-2 text-sm pb-2">
              Maintain proper spacing for root expansion.
            </li>
          </ul>
          <li className="font-medium">Watering</li>
          <ul>
            <li className="pl-2 text-sm">
              Water regularly to maintain soil moisture.
            </li>
          </ul>

          {/* Stage 2: Early Growth & Thinning */}
          <li className="font-bold pb-2 underline">
            Stage 2: Early Growth & Thinning
          </li>
          <li className="font-medium">Thinning the Plants</li>
          <ul>
            <li className="pl-2 text-sm">
              Thin out weaker seedlings to allow strong roots to develop.
            </li>
          </ul>
          <li className="font-medium">Mulching</li>
          <ul>
            <li className="pl-2 text-sm">
              Use **straw or coconut husk mulch** to retain moisture and
              suppress weeds.
            </li>
          </ul>
          <li className="font-medium">Fertilization</li>
          <ul>
            <li className="pl-2 text-sm">
              Use **organic compost** or **NPK-based fertilizer** for healthy
              growth.
            </li>
          </ul>
          <li className="font-medium">Weed Control</li>
          <ul>
            <li className="pl-2 text-sm">
              Keep the area weed-free to prevent competition for nutrients.
            </li>
          </ul>

          {/* Stage 3: Root Development */}
          <li className="font-bold pb-2 underline">
            Stage 3: Root Development
          </li>
          <li className="font-medium">Watering Schedule</li>
          <ul>
            <li className="pl-2 text-sm">
              Water deeply at regular intervals to encourage root elongation.
            </li>
          </ul>
          <li className="font-medium">Pest & Disease Management</li>
          <ul>
            <li className="pl-2 text-sm">
              Monitor for **carrot flies, aphids, and fungal diseases**.
            </li>
            <li className="pl-2 text-sm pb-2">
              Use **neem oil or organic pesticides** for control.
            </li>
          </ul>
          <li className="font-medium">Soil Hilling</li>
          <ul>
            <li className="pl-2 text-sm">
              Add soil around growing carrots to prevent **greening** at the
              tops.
            </li>
          </ul>

          {/* Stage 4: Maturity & Harvesting */}
          <li className="font-bold pb-2 underline">
            Stage 4: Maturity & Harvesting
          </li>
          <li className="font-medium">Checking for Maturity</li>
          <ul>
            <li className="pl-2 text-sm">
              Carrots are ready for harvest when they reach a good size and
              color.
            </li>
          </ul>
          <li className="font-medium">Harvesting Carrots</li>
          <ul>
            <li className="pl-2 text-sm">
              Loosen the soil before pulling to prevent breakage.
            </li>
            <li className="pl-2 text-sm pb-2">
              Wash and remove excess dirt before storage.
            </li>
          </ul>
          <li className="font-medium">Storage</li>
          <ul>
            <li className="pl-2 text-sm pb-2">
              Store in a cool, humid environment or refrigerate for longer
              freshness.
            </li>
          </ul>

          {/* Final Tips */}
          <li className="font-bold pb-2 underline">
            {" "}
            Sri Lanka-Specific Carrot Growing Tips
          </li>
          <ul>
            <li className="pl-2 text-sm">
              **Best Locations** – Nuwara Eliya & Bandarawela are ideal.
            </li>
            <li className="pl-2 text-sm">
              {" "}
              **Avoid Monsoon Rains** – Raised beds help prevent waterlogging.
            </li>
            <li className="pl-2 text-sm">
              {" "}
              **Organic Farming** – Compost & natural manure improve yield.
            </li>
            <li className="pl-2 text-sm pb-2">
              **Market Demand** – Higher prices from October to March.
            </li>
          </ul>
        </ul>
      </p>
    ),
    Beans: (
      <p>
        <ul className="list-square list-inside">
          {/* Stage 1: Seed Selection & Germination */}
          <li className="font-bold pb-2  underline">
            Stage 1: Seed Selection & Germination
          </li>
          <li className="font-medium">Choose a Bean Variety</li>
          <ul>
            <li className="pl-2 text-sm">
              Local Varieties: Butter Bean, Bush Bean, Climbing Bean
            </li>
            <li className="pl-2 text-sm pb-2">
              Hybrid Varieties: Top Crop, Contender, Kentucky Wonder
            </li>
          </ul>
          <li className="font-medium">Ideal Climate & Temperature</li>
          <ul>
            <li className="pl-2 text-sm">
              Grows well in **Wet & Intermediate zones (Kandy, Nuwara Eliya,
              Badulla, Ratnapura, Matale)**.
            </li>
            <li className="pl-2 text-sm pb-2">
              Prefers warm temperatures with moderate humidity.
            </li>
          </ul>
          <li className="font-medium">Soil Preparation</li>
          <ul>
            <li className="pl-2 text-sm">
              Use **well-drained, sandy loam soil** rich in organic matter.
            </li>
            <li className="pl-2 text-sm pb-2">
              Mix compost and aged manure to enhance soil fertility.
            </li>
          </ul>
          <li className="font-medium">Planting the Seeds</li>
          <ul>
            <li className="pl-2 text-sm">
              Sow seeds **1 inch deep** in rows with proper spacing.
            </li>
            <li className="pl-2 text-sm pb-2">
              Climbing varieties need support structures like poles or
              trellises.
            </li>
          </ul>
          <li className="font-medium">Watering</li>
          <ul>
            <li className="pl-2 text-sm">
              Keep soil **consistently moist but not soggy**.
            </li>
          </ul>

          {/* Stage 2: Early Growth & Vegetation */}
          <li className="font-bold pb-2 underline">
            Stage 2: Early Growth & Vegetation
          </li>
          <li className="font-medium">Thinning the Plants</li>
          <ul>
            <li className="pl-2 text-sm">
              Thin plants if too crowded to allow proper airflow.
            </li>
          </ul>
          <li className="font-medium">
            Providing Support (For Climbing Beans)
          </li>
          <ul>
            <li className="pl-2 text-sm">
              Install **bamboo sticks or netting** for vines to climb.
            </li>
          </ul>
          <li className="font-medium">Fertilization</li>
          <ul>
            <li className="pl-2 text-sm">
              Use **NPK (5-10-10) fertilizer** for steady growth.
            </li>
            <li className="pl-2 text-sm pb-2">
              Add **bone meal** for stronger root development.
            </li>
          </ul>
          <li className="font-medium">Weed Control</li>
          <ul>
            <li className="pl-2 text-sm">
              Remove weeds regularly to prevent competition for nutrients.
            </li>
          </ul>

          {/* Stage 3: Flowering & Pod Formation */}
          <li className="font-bold pb-2 underline">
            Stage 3: Flowering & Pod Formation
          </li>
          <li className="font-medium">Watering Needs</li>
          <ul>
            <li className="pl-2 text-sm">
              Maintain even moisture, especially during flowering.
            </li>
          </ul>
          <li className="font-medium">Pest & Disease Control</li>
          <ul>
            <li className="pl-2 text-sm">
              Watch for **aphids, bean beetles, and powdery mildew**.
            </li>
            <li className="pl-2 text-sm pb-2">
              Use **organic neem oil spray** to control pests.
            </li>
          </ul>
          <li className="font-medium">Encouraging More Pods</li>
          <ul>
            <li className="pl-2 text-sm">
              Harvesting regularly **stimulates more flowering and fruiting**.
            </li>
          </ul>

          {/* Stage 4: Harvesting & Storage */}
          <li className="font-bold pb-2 underline">
            Stage 4: Harvesting & Storage
          </li>
          <li className="font-medium">When to Harvest</li>
          <ul>
            <li className="pl-2 text-sm">
              Beans are ready when pods are **firm but not fully mature**.
            </li>
          </ul>
          <li className="font-medium">How to Harvest</li>
          <ul>
            <li className="pl-2 text-sm">
              Pick beans **gently by hand** to avoid damaging the plant.
            </li>
          </ul>
          <li className="font-medium">Storage</li>
          <ul>
            <li className="pl-2 text-sm">
              Store fresh beans in **a cool, dry place**.
            </li>
            <li className="pl-2 text-sm pb-2">
              For long-term storage, **blanch and freeze** beans.
            </li>
          </ul>

          {/* Final Tips */}
          <li className="font-bold pb-2 underline">
            {" "}
            Sri Lanka-Specific Bean Growing Tips
          </li>
          <ul>
            <li className="pl-2 text-sm">
              **Best Locations** – Upcountry and Intermediate Zones provide best
              yields.
            </li>
            <li className="pl-2 text-sm">
              **Avoid Overwatering** – Excess moisture leads to fungal
              infections.
            </li>
            <li className="pl-2 text-sm">
              **Organic Farming** – Use **compost and natural fertilizers**.
            </li>
            <li className="pl-2 text-sm pb-2">
              **Market Demand** – Beans have **high demand year-round**.
            </li>
          </ul>

          {/* Total Growing Time */}
          <li className="font-bold pb-2 underline">Total Growing Time</li>
          <ul>
            <li className="pl-2 text-sm">
              ✔ **Bush Beans** – Faster-growing, ready for harvest earlier.
            </li>
            <li className="pl-2 text-sm">
              ✔ **Climbing Beans** – Take longer but produce continuously.
            </li>
          </ul>
        </ul>
      </p>
    ),
  };

  // Disease details for right box (Unchanged)
  const diseaseInfo = {
    "Tomato - Spider Mites": (
      <p>
        <li className="font-bold py-2  underline">Medicines</li>

        <ul>
          <li className="pl-2 text-sm">
            Abamectin 1.8% EC (Vertimec) - LKR 1,500 per 100ml
          </li>
          <li className="pl-2 text-sm">
            Sulfur Dust (Sultaf) - LKR 750 per 500g
          </li>
          <li className="pl-2 text-sm">
            Neem Oil Extract - LKR 1,200 per 250ml
          </li>
        </ul>
        <li className="font-bold py-2  underline">How to Apply</li>

        <ul>
          <li className="pl-2 text-sm">
            Step 1: Mix 2ml of Abamectin per 1L of water.
          </li>
          <li className="pl-2 text-sm">
            Step 2: Spray on the underside of leaves every 7-10 days.
          </li>
          <li className="pl-2 text-sm">
            Step 3: If using Sulfur Dust, dust plants in the evening.
          </li>
          <li className="pl-2 text-sm">
            Step 4: Neem Oil can be mixed with water (5ml per 1L) and sprayed
            twice weekly.
          </li>
        </ul>

        <li className="font-bold py-2  underline">Warnings</li>

        <ul className="pb-2">
          <li className="pl-2 text-sm">
            Avoid spraying Abamectin during flowering—it can harm pollinators.
          </li>
          <li className="pl-2 text-sm">
            Do not apply sulfur dust in extremely hot conditions; it may burn
            plants.
          </li>
        </ul>
      </p>
    ),
    "Tomato - Septoria Leaf Spot": (
      <p className="pb-2">
        <li className="font-bold py-2 underline">Medicines</li>
        <ul className="pb-2">
          <li className="pl-2 text-sm">
            Mancozeb 80% WP (Dithane M-45) - LKR 900 per 500g
          </li>
          <li className="pl-2 text-sm">
            Copper Oxychloride 50% WP (Blitox) - LKR 850 per 500g
          </li>
          <li className="pl-2 text-sm">
            Chlorothalonil 75% WP (Bravo) - LKR 1,500 per 250ml
          </li>
        </ul>

        <li className="font-bold py-2 underline">How to Apply</li>
        <ul>
          <li className="pl-2 text-sm">
            Step 1: Mix Mancozeb (2g per 1L of water) and spray on affected
            leaves.
          </li>
          <li className="pl-2 text-sm">
            Step 2: If the infection is severe, use Copper Oxychloride (3g per
            1L of water).
          </li>
          <li className="pl-2 text-sm">
            Step 3: Repeat application every 10 days.
          </li>
        </ul>

        <li className="font-bold py-2 underline">Warnings</li>
        <ul>
          <li className="pl-2 text-sm">
            Do not apply Mancozeb within 14 days of harvesting.
          </li>
          <li className="pl-2 text-sm">
            Wear protective gloves while handling Copper-based fungicides.
          </li>
        </ul>
      </p>
    ),

    "Tomato - Leaf Mold": (
      <p>
        <li className="font-bold py-2 underline">Medicines</li>
        <ul>
          <li className="pl-2 text-sm">
            Copper Hydroxide 50% WP (Kocide 3000) - LKR 1,200 per 500g
          </li>
          <li className="pl-2 text-sm">
            Chlorothalonil 75% WP (Bravo) - LKR 1,500 per 250ml
          </li>
          <li className="pl-2 text-sm">
            Bordeaux Mixture (Copper Sulfate + Lime) - LKR 900 per 500g
          </li>
        </ul>

        <li className="font-bold py-2 underline">How to Apply</li>
        <ul>
          <li className="pl-2 text-sm">
            Step 1: Mix Kocide 3000 (3g per 1L of water) and spray evenly.
          </li>
          <li className="pl-2 text-sm">
            Step 2: Apply Bordeaux mixture every 10 days to prevent spread.
          </li>
          <li className="pl-2 text-sm">
            Step 3: Use Chlorothalonil if symptoms persist (5ml per 1L of
            water).
          </li>
        </ul>

        <li className="font-bold py-2 underline">Warnings</li>
        <ul>
          <li className="pl-2 text-sm">
            Avoid applying copper-based sprays in extreme heat.
          </li>
          <li className="pl-2 text-sm">
            Do not mix with fertilizers or other chemicals.
          </li>
        </ul>
      </p>
    ),

    "Tomato - Late Blight": (
      <p>
        <li className="font-bold py-2 underline">Medicines</li>
        <ul>
          <li className="pl-2 text-sm">
            Metalaxyl 8% + Mancozeb 64% WP (Ridomil Gold) - LKR 1,600 per 500g
          </li>
          <li className="pl-2 text-sm">
            Copper Oxychloride 50% WP (Blitox) - LKR 850 per 500g
          </li>
          <li className="pl-2 text-sm">
            Fosetyl-Aluminum 80% WP (Aliette) - LKR 1,900 per 500g
          </li>
        </ul>

        <li className="font-bold py-2 underline">How to Apply</li>
        <ul>
          <li className="pl-2 text-sm">
            Step 1: Mix Ridomil Gold (3g per 1L of water) and spray every 10
            days.
          </li>
          <li className="pl-2 text-sm">
            Step 2: Use Copper Oxychloride if symptoms persist (5g per 1L of
            water).
          </li>
          <li className="pl-2 text-sm">
            Step 3: Apply Fosetyl-Aluminum as a preventive measure during wet
            conditions.
          </li>
        </ul>

        <li className="font-bold py-2 underline">Warnings</li>
        <ul>
          <li className="pl-2 text-sm">
            Avoid using Ridomil Gold near water sources—can harm aquatic life.
          </li>
          <li className="pl-2 text-sm">
            Wear gloves and mask when handling Fosetyl-Aluminum.
          </li>
        </ul>
      </p>
    ),

    "Tomato - Early Blight": (
      <p>
        <li className="font-bold py-2 underline">Medicines</li>
        <ul>
          <li className="pl-2 text-sm">
            Azoxystrobin 23% SC (Quadris) - LKR 1,700 per 250ml
          </li>
          <li className="pl-2 text-sm">
            Difenoconazole 25% EC (Score) - LKR 1,200 per 250ml
          </li>
          <li className="pl-2 text-sm">
            Mancozeb 80% WP (Dithane M-45) - LKR 900 per 500g
          </li>
        </ul>

        <li className="font-bold py-2 underline">How to Apply</li>
        <ul>
          <li className="pl-2 text-sm">
            Step 1: Mix Score (2ml per 1L of water) and spray every 10 days.
          </li>
          <li className="pl-2 text-sm">
            Step 2: If symptoms persist, use Quadris (4ml per 1L of water).
          </li>
          <li className="pl-2 text-sm">
            Step 3: Mancozeb can be used for preventive spraying.
          </li>
        </ul>

        <li className="font-bold py-2 underline">Warnings</li>
        <ul>
          <li className="pl-2 text-sm">
            Do not use Difenoconazole near water bodies—it is toxic to fish.
          </li>
          <li className="pl-2 text-sm">
            Avoid excessive use of Mancozeb—it may leave residues on fruit.
          </li>
        </ul>
      </p>
    ),

    "Tomato - Bacterial Spot": (
      <p>
        <li className="font-bold py-2 underline">Medicines</li>
        <ul>
          <li className="pl-2 text-sm">
            Copper Hydroxide 77% WP (Kocide 3000) - LKR 1,200 per 500g
          </li>
          <li className="pl-2 text-sm">
            Streptomycin Sulfate 20% (Agrimycin) - LKR 1,500 per 250g
          </li>
          <li className="pl-2 text-sm">
            Bordeaux Mixture (Copper Sulfate + Lime) - LKR 900 per 500g
          </li>
        </ul>

        <li className="font-bold py-2 underline">How to Apply</li>
        <ul>
          <li className="pl-2 text-sm">
            Step 1: Mix Kocide 3000 (3g per 1L of water) and spray on affected
            areas.
          </li>
          <li className="pl-2 text-sm">
            Step 2: Apply Agrimycin (1g per 1L of water) weekly to prevent
            further spread.
          </li>
          <li className="pl-2 text-sm">
            Step 3: Bordeaux Mixture can be used every 10 days for preventive
            control.
          </li>
        </ul>

        <li className="font-bold py-2 underline">Warnings</li>
        <ul>
          <li className="pl-2 text-sm">
            Avoid excessive copper-based sprays as they may build up in soil.
          </li>
          <li className="pl-2 text-sm">
            Do not mix Agrimycin with other pesticides.
          </li>
        </ul>
      </p>
    ),

    "Tomato - Yellow Leaf Curl": (
      <p>
        <li className="font-bold py-2 underline">Medicines</li>
        <ul>
          <li className="pl-2 text-sm">
            Imidacloprid 17.8% SL (Confidor) - LKR 1,200 per 100ml
          </li>
          <li className="pl-2 text-sm">
            Acetamiprid 20% SP (Mospilan) - LKR 950 per 100g
          </li>
          <li className="pl-2 text-sm">
            Neem Oil Extract - LKR 1,200 per 250ml
          </li>
        </ul>

        <li className="font-bold py-2 underline">How to Apply</li>
        <ul>
          <li className="pl-2 text-sm">
            Step 1: Mix Confidor (2ml per 1L of water) and spray on plant
            leaves.
          </li>
          <li className="pl-2 text-sm">
            Step 2: Apply Mospilan every 7 days to control whiteflies (virus
            carriers).
          </li>
          <li className="pl-2 text-sm">
            Step 3: Use neem oil (5ml per 1L of water) as a natural alternative.
          </li>
        </ul>

        <li className="font-bold py-2 underline">Warnings</li>
        <ul>
          <li className="pl-2 text-sm">
            Avoid spraying Confidor on flowering plants—it affects pollinators.
          </li>
          <li className="pl-2 text-sm">
            Do not use Imidacloprid more than twice per season to prevent
            resistance.
          </li>
        </ul>
      </p>
    ),

    "Tomato - Mosaic Virus": (
      <p>
        <li className="font-bold py-2 underline">Medicines</li>
        <ul>
          <li className="pl-2 text-sm">No direct cure—focus on prevention.</li>
          <li className="pl-2 text-sm">
            Neem Oil Extract - LKR 1,200 per 250ml
          </li>
          <li className="pl-2 text-sm">
            Bio-Fungicides (Trichoderma) - LKR 1,000 per 500g
          </li>
        </ul>

        <li className="font-bold py-2 underline">How to Apply</li>
        <ul>
          <li className="pl-2 text-sm">
            Step 1: Remove and destroy infected plants immediately.
          </li>
          <li className="pl-2 text-sm">
            Step 2: Spray neem oil every 10 days to control virus-spreading
            insects.
          </li>
          <li className="pl-2 text-sm">
            Step 3: Apply Trichoderma to soil to improve plant immunity.
          </li>
        </ul>

        <li className="font-bold py-2 underline">Warnings</li>
        <ul>
          <li className="pl-2 text-sm">
            Do not compost infected plants—it spreads the virus.
          </li>
          <li className="pl-2 text-sm">
            Ensure tools and hands are sanitized after handling diseased plants.
          </li>
        </ul>
      </p>
    ),

    "Tomato - Target Spot": (
      <p>
        <li className="font-bold py-2 underline">Medicines</li>
        <ul>
          <li className="pl-2 text-sm">
            Azoxystrobin 23% SC (Amistar) - LKR 1,600 per 250ml
          </li>
          <li className="pl-2 text-sm">
            Mancozeb 80% WP (Dithane M-45) - LKR 900 per 500g
          </li>
          <li className="pl-2 text-sm">
            Chlorothalonil 75% WP (Bravo) - LKR 1,500 per 250ml
          </li>
        </ul>

        <li className="font-bold py-2 underline">How to Apply</li>
        <ul>
          <li className="pl-2 text-sm">
            Step 1: Mix Amistar (3ml per 1L of water) and spray every 10 days.
          </li>
          <li className="pl-2 text-sm">
            Step 2: Apply Mancozeb (4g per 1L of water) as a preventive measure.
          </li>
          <li className="pl-2 text-sm">
            Step 3: Use Bravo if the disease spreads (5ml per 1L of water).
          </li>
        </ul>

        <li className="font-bold py-2 underline">Warnings</li>
        <ul>
          <li className="pl-2 text-sm">
            Avoid spraying fungicides during strong sunlight—it reduces
            effectiveness.
          </li>
          <li className="pl-2 text-sm">
            Ensure a 7-day waiting period before harvesting after spraying.
          </li>
        </ul>
      </p>
    ),
  };

  // ✅ Handle File Selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Show preview
    }
  };

  // ✅ Open Camera
  const handleCameraOpen = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";
    input.onchange = handleImageChange;
    input.click();
  };

  // ✅ Send Image to Flask for Prediction
  const handleProceed = async () => {
    if (!image) {
      alert("Please select an image first!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await axios.post(
        "http://127.0.0.1:7000/predict",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.confidence < 0.8) {
        setPrediction("Unknown Image - Not a Tomato");
      } else {
        setPrediction(
          `Disease: ${response.data.class} (Confidence: ${(
            response.data.confidence * 100
          ).toFixed(2)}%)`
        );
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setPrediction("Error: Could not get prediction.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset Everything
  const handleReset = () => {
    setImage(null);
    setPreview(null);
    setPrediction("");
  };

  return (
    <div className="flex items-center justify-center w-full h-[95vh] bg-gradient-to-br from-[#a0fbc1] to-white rounded-xl">
      <div className="flex items-start justify-center rounded-3xl p-6 pt-10 max-w-[1340px] mx-auto ">
        {/* Left Box (Unchanged) */}
        <div className="w-1/3 h-[500px] border-2 border-green-500 rounded-2xl p-6">
          <h2 className="py-2 font-poppins text-[20px] font-semibold">
            Roadmap
          </h2>
          <select
            className="w-full p-2 text-[16px] rounded-lg text-md font-semibold font-poppins"
            onChange={(e) => setSelectedPlant(e.target.value)}
            value={selectedPlant}
          >
            <option value="text-sm">Select Plant</option>
            <option value="Tomato">Tomato</option>
            <option value="Carrot">Carrot</option>
            <option value="Beans">Beans</option>
          </select>

          <div className="mt-4 p-4 bg-white rounded-lg shadow-lg text-[14px] h-[350px] overflow-y-auto">
            <p>
              {selectedPlant
                ? plantInfo[selectedPlant]
                : "Select a plant to view details."}
            </p>
          </div>
        </div>

        {/* Middle Box (Modified for Backend Integration) */}
        <div className="flex h-[500px] justify-center px-6 pt-0">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-96 flex flex-col items-center">
            {/* Image Preview */}
            <div className="w-full h-40 flex items-center justify-center bg-gray-200 rounded-lg mb-4">
              {preview ? (
                <img
                  src={preview}
                  alt="Uploaded"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-gray-600 font-semibold text-center">
                  <p>Upload Image</p>
                  <p>Make sure the Image is close to the leaves</p>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col w-full space-y-3">
              <label className="bg-green-600 text-white py-2 rounded-lg text-center cursor-pointer">
                Select Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              <button
                onClick={handleCameraOpen}
                className="bg-blue-500 text-white py-2 rounded-lg"
              >
                Camera
              </button>
              <button
                onClick={handleProceed}
                className="bg-teal-500 text-white py-2 rounded-lg"
              >
                {loading ? "Processing..." : "Proceed"}
              </button>
              {image && (
                <button
                  onClick={handleReset}
                  className="bg-red-500 text-white py-2 rounded-lg"
                >
                  Reset
                </button>
              )}
            </div>

            {/* ✅ Display Prediction Result */}
            {prediction && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-lg text-center">
                <p className="font-bold">{prediction}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Box (Unchanged) */}
        <div className="w-1/3 h-[500px] border-2 border-green-500 rounded-2xl p-6">
          {/* Dropdown for Disease Selection */}
          <select
            className="w-full p-2 text-md font-medium rounded-lg"
            onChange={(e) => setSelectedDisease(e.target.value)}
            value={selectedDisease}
          >
            <option value="Select the Disease">Select the Disease</option>
            {Object.keys(diseaseInfo).map((disease) => (
              <option key={disease} value={disease}>
                {disease}
              </option>
            ))}
          </select>

          {/* Dynamic Text Box Updates for Disease Info */}
          <div className="mt-4 p-4 text-md bg-white rounded-lg shadow-md h-[390px] overflow-y-auto">
            <p className="text-sm">
              {selectedDisease === "Select the Disease"
                ? "Select a disease from the dropdown to see details."
                : diseaseInfo[selectedDisease]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
