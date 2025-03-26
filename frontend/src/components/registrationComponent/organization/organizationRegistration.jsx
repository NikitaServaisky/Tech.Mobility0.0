import React, { useState } from "react";
import OrganizationStep1 from "./registrationOrganizationStepOne";
import OrganizationStep2 from "./registrationOrganizationSteptwo";

function Organization() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userId, setUserId] = useState(null);

  return (
    <div className="organization-registration">
      <h2>רישום ארגון</h2>
      {currentStep === 1 && (
        <OrganizationStep1
          onNext={(id) => {
            setUserId(id);
            setCurrentStep(2);
          }}
        />
      )}
      {currentStep === 2 && <OrganizationStep2 userId={userId} />}
    </div>
  );
}

export default Organization;
