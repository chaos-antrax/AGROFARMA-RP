import React from "react";

const DashboardHome = () => {
  return (
    <div className="h-[96vh] bg-gradient-to-br from-[#a0fbc1] to-white rounded-xl overflow-hidden">
      <div className="grid grid-cols-12 h-full">
        <div className="col-span-12 flex flex-col items-center justify-center px-80 text-center gap-4 font-light text-xl">
          <p>
            Explore the features offered by team Agrofarma from the panel to
            your left.
          </p>
          <p>
            Under the features section, you can find the list of currently
            supported features as of version 0.1.
          </p>
          <p>
            Please be aware that the software is still in development and some
            features may not function as expected. If you encounter any such
            errors, feel free to reach out to us via our contact page.
          </p>
          <p className="pt-20">
            {" "}
            *Refer to the log section to view a summary of your usage history.
          </p>
        </div>
        {/* <div className="col-span-6">asd</div> */}
      </div>
      <div></div>
    </div>
  );
};

export default DashboardHome;
