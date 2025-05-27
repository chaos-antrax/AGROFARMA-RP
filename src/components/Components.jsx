import React from "react";
import growthPrediction from "../assets/1.png";
import marketPrice from "../assets/2.png";
import agriAssist from "../assets/4.png";
import solutions from "../assets/3.png";

const Components = () => {
  return (
    <div className="bg-[#f6ebff] py-2 w-full  my-8">
      <div className="max-w-[1100px] mt-8 mx-auto grid md:grid-cols-2 border-4 border-green-600 rounded-2xl">
        <img
          className="w-[400px] ml-[100px] mx-auto my-4 ms-10"
          src={growthPrediction}
          alt=""
        />
        <div className="flex flex-col py-[50px]">
          <h1 className="md:text-3xl sm:text-2xl text-xl py-4text-black uppercase font-poppins font-semibold text-[#1C5739]">
            Plant Growth Analyze
          </h1>
          <div className="py-6 pe-10 text-justify">
            <p className="leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Vestibulum porta magna vitae turpis dictum, sed imperdiet metus
              eleifend. Morbi consectetur tristique velit, eget suscipit ligula
              laoreet at. Sed tempor orci leo, sed tincidunt lacus consequat ac.
              In sem ligula, viverra ac vulputate id, rutrum eget nisl.
              Curabitur pharetra lectus ullamcorper lectus maximus, eget laoreet
              massa tempus. Duis ullamcorper convallis leo vel pretium. Praesent
              vestibulum a nisi vel tincidunt. Duis ante sapien, semper at
              libero eget, congue iaculis lectus. Sed et efficitur sapien, at
              pharetra ex. In porta neque justo, vitae commodo libero lacinia
              sed.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mt-8 mx-auto grid md:grid-cols-2 border-4 border-green-600 rounded-2xl">
        <div className="flex flex-col py-[50px]">
          <h1 className="md:text-3xl sm:text-2xl text-xl ps-10 py-4 uppercase font-poppins font-semibold text-[#1C5739]">
            Market Price Prediction
          </h1>
          <div className="py-6 ps-10 text-justify">
            <p className="leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Vestibulum porta magna vitae turpis dictum, sed imperdiet metus
              eleifend. Morbi consectetur tristique velit, eget suscipit ligula
              laoreet at. Sed tempor orci leo, sed tincidunt lacus consequat ac.
              In sem ligula, viverra ac vulputate id, rutrum eget nisl.
              Curabitur pharetra lectus ullamcorper lectus maximus, eget laoreet
              massa tempus. Duis ullamcorper convallis leo vel pretium. Praesent
              vestibulum a nisi vel tincidunt. Duis ante sapien, semper at
              libero eget, congue iaculis lectus. Sed et efficitur sapien, at
              pharetra ex. In porta neque justo, vitae commodo libero lacinia
              sed.
            </p>
          </div>
        </div>
        <img
          className="w-[400px] me-[100px] mx-auto my-4 "
          src={marketPrice}
          alt=""
        />
      </div>

      <div className="max-w-[1100px] mt-8 mx-auto grid md:grid-cols-2 border-4 border-green-600 rounded-2xl">
        <img
          className="w-[400px] ml-[100px] mx-auto my-4 ms-10"
          src={solutions}
          alt=""
        />
        <div className="flex flex-col py-[50px]">
          <h1 className="md:text-3xl sm:text-2xl text-xl py-4text-black uppercase font-poppins font-semibold text-[#1C5739]">
            Alternative solutions
          </h1>
          <div className="py-6 pe-10 text-justify">
            <p className="leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Vestibulum porta magna vitae turpis dictum, sed imperdiet metus
              eleifend. Morbi consectetur tristique velit, eget suscipit ligula
              laoreet at. Sed tempor orci leo, sed tincidunt lacus consequat ac.
              In sem ligula, viverra ac vulputate id, rutrum eget nisl.
              Curabitur pharetra lectus ullamcorper lectus maximus, eget laoreet
              massa tempus. Duis ullamcorper convallis leo vel pretium. Praesent
              vestibulum a nisi vel tincidunt. Duis ante sapien, semper at
              libero eget, congue iaculis lectus. Sed et efficitur sapien, at
              pharetra ex. In porta neque justo, vitae commodo libero lacinia
              sed.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mt-8 mx-auto grid md:grid-cols-2 border-4 border-green-600 rounded-2xl">
        <div className="flex flex-col py-[50px]">
          <h1 className="md:text-3xl sm:text-2xl text-xl ps-10 py-4 uppercase font-poppins font-semibold text-[#1C5739]">
            Personalized Agri Assistant
          </h1>
          <div className="py-6 ps-10 text-justify">
            <p className="leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Vestibulum porta magna vitae turpis dictum, sed imperdiet metus
              eleifend. Morbi consectetur tristique velit, eget suscipit ligula
              laoreet at. Sed tempor orci leo, sed tincidunt lacus consequat ac.
              In sem ligula, viverra ac vulputate id, rutrum eget nisl.
              Curabitur pharetra lectus ullamcorper lectus maximus, eget laoreet
              massa tempus. Duis ullamcorper convallis leo vel pretium. Praesent
              vestibulum a nisi vel tincidunt. Duis ante sapien, semper at
              libero eget, congue iaculis lectus. Sed et efficitur sapien, at
              pharetra ex. In porta neque justo, vitae commodo libero lacinia
              sed.
            </p>
          </div>
        </div>
        <img
          className="w-[400px] me-[100px] p-4 mx-auto my-4"
          src={agriAssist}
          alt=""
        />
      </div>
    </div>
  );
};

export default Components;
