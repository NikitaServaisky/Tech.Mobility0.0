import React, { useState } from "react";
import DriverStepOne from "./driverRegistrationStepOne";
import DriverStepTwo from "./driverRegistrationStepTwo";

function Driver() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userId, setUserId] = useState(null);

  return (
    <div className="driver-registration">
      <h2>Driver Registration</h2>
      {currentStep === 1 && (
        <DriverStepOne
          onNext={(id) => {
            setUserId(id);
            setCurrentStep(2);
          }}
        />
      )}
      {currentStep === 2 && <DriverStepTwo userId={userId} />}
    </div>
  );
}

export default Driver;
