import { useState, useEffect } from "react";
import WhatIfSimulator from "../components/WhatIfSimulator";
import OptimizationEngine from "../components/OptimizationEngine";
import PageLayout from "../components/PageLayout";
import SectionHeader from "../components/SectionHeader";
import EmptyState from "../components/EmptyState";

function Optimization() {
  const [result, setResult] = useState(() => {
    try {
      const saved = localStorage.getItem("current_assessment_result");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [lastPayload, setLastPayload] = useState(() => {
    try {
      const saved = localStorage.getItem("current_assessment_payload");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Keep in sync with local storage updates
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const savedRes = localStorage.getItem("current_assessment_result");
        const savedPayload = localStorage.getItem("current_assessment_payload");
        setResult(savedRes ? JSON.parse(savedRes) : null);
        setLastPayload(savedPayload ? JSON.parse(savedPayload) : null);
      } catch (err) {
        console.error("Failed to sync localStorage on Optimization page:", err);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleStorageChange);
    };
  }, []);

  return (
    <PageLayout
      title="Carbon Reduction Scenario Planning"
      subtitle="Simulate farm operational adjustments and explore optimized pathways to maximize carbon credits and minimize GHG emissions."
      breadcrumbs={[
        { label: "Dashboard", path: "/dashboard" },
        { label: "Optimization" },
        { label: "Scenario Planning" }
      ]}
    >
      <div className="space-y-8">
        {/* Section 1: Optimization Sandbox */}
        <div className="space-y-6">
          <SectionHeader
            title="What-If Simulation Sandbox"
            description="Tweak fertilizer usage and carbon metrics to preview credit potential and footprint reductions"
          />
          {!result ? (
            <EmptyState
              title="No Active Assessment Data"
              description="Perform a carbon evaluation on the Dashboard page or select an entry from your assessment history on the Reports page to explore optimization opportunities."
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-6">
                <WhatIfSimulator
                  carbonFootprint={result.carbon_footprint}
                  formData={lastPayload}
                  loading={false}
                />
              </div>
              <div className="lg:col-span-6">
                <OptimizationEngine
                  carbonFootprint={result.carbon_footprint}
                  sustainability={result.sustainability}
                  formData={lastPayload}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

export default Optimization;
