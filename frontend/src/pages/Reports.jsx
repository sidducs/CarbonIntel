import { useState, useEffect } from "react";
import ExecutiveSummary from "../components/ExecutiveSummary";
import SustainabilityRoadmap from "../components/SustainabilityRoadmap";
import SustainabilityScorecard from "../components/SustainabilityScorecard";
import AssessmentHistory from "../components/AssessmentHistory";
import AssessmentComparison from "../components/AssessmentComparison";
import ExportReportButton from "../components/ExportReportButton";
import PageLayout from "../components/PageLayout";
import SectionHeader from "../components/SectionHeader";

function Reports() {
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

  const [history, setHistory] = useState(() => {
    try {
      const stored = localStorage.getItem("carbon_assessment_history");
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error("Failed to load assessment history:", err);
      return [];
    }
  });

  // Keep in sync with local storage updates
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const savedRes = localStorage.getItem("current_assessment_result");
        const savedPayload = localStorage.getItem("current_assessment_payload");
        const storedHistory = localStorage.getItem("carbon_assessment_history");
        setResult(savedRes ? JSON.parse(savedRes) : null);
        setLastPayload(savedPayload ? JSON.parse(savedPayload) : null);
        setHistory(storedHistory ? JSON.parse(storedHistory) : []);
      } catch (err) {
        console.error("Failed to sync localStorage on Reports page:", err);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleStorageChange);
    };
  }, []);

  const handleDeleteAssessment = (id) => {
    try {
      const updated = history.filter((item) => item.id !== id);
      setHistory(updated);
      localStorage.setItem("carbon_assessment_history", JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to delete assessment:", err);
    }
  };

  const handleSelectAssessment = (record) => {
    const resObj = {
      carbon_footprint: record.carbonFootprint,
      sustainability: record.sustainability
    };
    setResult(resObj);
    setLastPayload(record.formData);
    try {
      localStorage.setItem("current_assessment_result", JSON.stringify(resObj));
      localStorage.setItem("current_assessment_payload", JSON.stringify(record.formData));
    } catch (err) {
      console.error("Failed to update active assessment in localStorage:", err);
    }
  };

  return (
    <PageLayout
      title="Assessment Reports & Documentation"
      subtitle="Access generated ESG scorecards, view sustainability timelines, export audit-ready PDF reports, and audit assessment history."
      breadcrumbs={[
        { label: "Dashboard", path: "/dashboard" },
        { label: "Reports" },
        { label: "Documentation" }
      ]}
    >
      <div className="space-y-12">
        {/* Section 1: Active ESG Report */}
        {result && lastPayload && (
          <div className="space-y-8">
            <SectionHeader
              title="Active Assessment ESG Profile"
              description="Report components for current selected farm evaluation"
              action={
                <div className="bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-100 dark:border-slate-850 shadow-xs">
                  <ExportReportButton
                    carbonFootprint={result.carbon_footprint}
                    sustainability={result.sustainability}
                    formData={lastPayload}
                  />
                </div>
              }
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <ExecutiveSummary
                carbonFootprint={result.carbon_footprint}
                sustainability={result.sustainability}
                formData={lastPayload}
              />
              <SustainabilityScorecard
                carbonFootprint={result.carbon_footprint}
                sustainability={result.sustainability}
                formData={lastPayload}
              />
            </div>

            <div className="grid grid-cols-1">
              <SustainabilityRoadmap
                carbonFootprint={result.carbon_footprint}
                sustainability={result.sustainability}
                formData={lastPayload}
              />
            </div>
          </div>
        )}

        {/* Section 2: Audit History & Comparison */}
        <div className="space-y-6 pt-8 border-t border-slate-200 dark:border-slate-800">
          <SectionHeader
            title="Audit History & Side-by-Side Comparison"
            description="Toggle past assessments to reload parameters or select entries to compare side-by-side"
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
              <AssessmentHistory
                history={history}
                onDelete={handleDeleteAssessment}
                onSelect={handleSelectAssessment}
              />
            </div>
            <div className="lg:col-span-5">
              <AssessmentComparison history={history} />
            </div>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}

export default Reports;