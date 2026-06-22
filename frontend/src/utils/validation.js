import { constraints } from "./constants";

export const validateField = (name, value) => {
  const ignoredFields = [
    "Crop_Type", "Fertilizer_Type", "Location", "Latitude", "Longitude", 
    "ReadableAddress", "Village", "Taluk", "District", "State", 
    "Country", "PostalCode", "selectedDistrict"
  ];

  if (ignoredFields.includes(name)) return "";
  if (value === undefined || value === null || String(value).trim() === "") {
    return "Field is required";
  }
  
  const num = parseFloat(value);
  if (isNaN(num)) return "Value must be a valid number";

  const rule = constraints[name];
  if (rule) {
    if (num < rule.min || num > rule.max) {
      return `Value must be between ${rule.min} and ${rule.max}`;
    }
  }
  return "";
};
