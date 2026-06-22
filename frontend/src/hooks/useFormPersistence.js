import { useEffect } from "react";

export function useFormPersistence(formData) {
  // Sync state to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem("farmForm", JSON.stringify(formData));
    } catch (err) {
      console.error("Failed to save farmForm to localStorage:", err);
    }
  }, [formData]);
}

export function loadPersistedForm(initialDefaults) {
  try {
    const saved = localStorage.getItem("farmForm");
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...initialDefaults, ...parsed };
    }
  } catch (err) {
    console.error("Failed to restore farmForm from localStorage:", err);
  }
  return initialDefaults;
}
