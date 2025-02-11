export const registerFieldsForCustomer = [
  { name: "email", label: "Email", type: "email", required: true },
  { name: "password", label: "Password", type: "password", required: true },
  { name: "confirmPassword", label: "Confirm Password", type: "password", required: true },
  { name: "firstName", label: "First Name", type: "text", required: true },
  { name: "lastName", label: "Last Name", type: "text", required: true },
  { name: "phone", label: "Phone Number", type: "tel", required: true },
  { name: "cardHolderName", label: "Card Holder Name", type: "text", required: true },
  {name: "cardNumber", label: "Card Number", type: 'text', required: true,},
  {name: "expiryDate", label: "Expiry Date (MM/YY)", type: "text", required: true,},
  {name: "cvv", label: "CVV", type: "password", required: true,},
  {
    name: "role",
    label: "Role",
    type: "hidden",
    required: true,
    value: "customer",
  },
  {
    name: "profilePicture",
    label: "Profile Picture",
    type: "file",
    required: false,
  },
];

export const registerFieldsForOrganization = [
  { name: "organizationName", label: "שם הארגון", type: "text", required: true },
  { name: "address", label: "כתובת", type: "text", required: true },
  { name: "taxId", label: "מספר ח.פ / ע.מ", type: "text", required: true },
  { name: "contactPerson", label: "איש קשר", type: "text", required: true },
  { name: "email", label: "אימייל", type: "email", required: true },
  { name: "password", label: "סיסמה", type: "password", required: true },
  { name: "confirmPassword", label: "אימות סיסמה", type: "password", required: true },
  { name: "phone", label: "מספר טלפון", type: "tel", required: true },
  { name: "businessLicense", label: "רישיון עסק", type: "file", required: true },
];

export const registerFieldsforDriver = [
  {name: "firstName", label: "First Name", type: "text", required: true},
  {name: "lastName", label: "Last Name", type: "text", required: true},
  {name: "phone", label: "Phone", type: "text", required: true},
  {name: "email", label: "Email", type: "text", required: true},
  {name: "password", label: "Password", type: "password", required: true},
  {name: "confirmPassword", label: "Confirm Password", type: "password", required: true},
  {name: "driverLicense", label: "Driver License", type: "file", required: true},
  {name: "licenseNumber", label: "License Number", type: "tel", required: true},
  {name: "vehicleMake", label: "Vehicle Make", type: "text", required: true},
  {name: "vehicleColor", label: "Vehicle Color", type: "text", required: true},
  {name: "vehicleYear", label: "vehicle Year", type: "text", required: true},
  {name: "vehiclePlate", label: "Vehicle Plate", type: 'tel', required: true}
];