import React, { useState } from "react";
import CustomerStep1 from "./customerRegistrationStepOne";
import CustomerStep2 from "./customerRegistrationStepTwo";

function Customer() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userId, setUserId] = useState(null);

  return (
    <div className="customer-registration">
      <h2>Customer Registration</h2>
      {currentStep === 1 && (
        <CustomerStep1
          onNext={(id) => {
            setUserId(id);
            setCurrentStep(2);
          }}
        />
      )}
      {currentStep === 2 && <CustomerStep2 userId={userId} />}
    </div>
  );
}

export default Customer;
