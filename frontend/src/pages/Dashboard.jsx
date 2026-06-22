import { useState, useEffect } from "react";
import { predictCarbonFootprint } from "../services/api";
import PredictionForm from "../components/PredictionForm";
import EmissionGaugeChart from "../components/charts/EmissionGaugeChart";
import EmissionBreakdownChart from "../components/charts/EmissionBreakdownChart";
import SustainabilityScoreChart from "../components/charts/SustainabilityScoreChart";
import PageLayout from "../components/PageLayout";

function Dashboard() {
  const [result, setResult] = useState(() => {
    try {
      const saved = localStorage.getItem("current_assessment_result");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  // Sync state to localStorage
  useEffect(() => {
    try {
      if (result) {
        localStorage.setItem("current_assessment_result", JSON.stringify(result));
      } else {
        localStorage.removeItem("current_assessment_result");
      }
    } catch (err) {
      console.error("Failed to sync current_assessment_result:", err);
    }
  }, [result]);

  useEffect(() => {
    try {
      if (lastPayload) {
        localStorage.setItem("current_assessment_payload", JSON.stringify(lastPayload));
      } else {
        localStorage.removeItem("current_assessment_payload");
      }
    } catch (err) {
      console.error("Failed to sync current_assessment_payload:", err);
    }
  }, [lastPayload]);


  const handleResetForm = () => {
    setResult(null);
    setLoading(false);
    setError("");
    setLastPayload(null);
  };

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
    setResult({
      carbon_footprint: record.carbonFootprint,
      sustainability: record.sustainability
    });
    setLastPayload(record.formData);
  };

  const handlePredictionSubmit = async (payload) => {
    setLoading(true);
    setError("");
    setResult(null);
    setLastPayload(null);

    try {
      const data = await predictCarbonFootprint(payload);
      setResult(data);
      setLastPayload(payload);

      // Auto-save to history list
      const numCF = parseFloat(data.carbon_footprint);
      let credits = 0;
      if (!isNaN(numCF) && numCF < 800) {
        credits = parseFloat(((800 - numCF) / 1000).toFixed(2));
      }
      const newRecord = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        cropType: payload.Crop_Type,
        carbonFootprint: data.carbon_footprint,
        sustainability: data.sustainability,
        carbonCredits: credits,
        formData: payload
      };
      const updatedHistory = [newRecord, ...history];
      setHistory(updatedHistory);
      localStorage.setItem("carbon_assessment_history", JSON.stringify(updatedHistory));
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.detail) {
        const detail = err.response.data.detail;
        if (typeof detail === "string") {
          setError(detail);
        } else if (Array.isArray(detail)) {
          const messages = detail.map((d) => {
            const field = d.loc[d.loc.length - 1];
            return `${field}: ${d.msg}`;
          }).join(", ");
          setError(`Validation Error: ${messages}`);
        } else {
          setError("Validation failed. Please check your inputs.");
        }
      } else {
        setError("Failed to connect to the prediction server. Please make sure the backend is running.");
      }
    } finally {
      setLoading(false);
    }
  };



  return (
    <PageLayout
      title="Farm Sustainability Assessment"
      subtitle="Input farm parameters to evaluate carbon footprint, eco rating, and carbon credit potential."
      breadcrumbs={[
        { label: "Dashboard", path: "/dashboard" },
        { label: "Farm Sustainability Assessment" }
      ]}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Prediction Form with Progressive Flow */}
        <PredictionForm
          onSubmit={handlePredictionSubmit}
          onReset={handleResetForm}
          loading={loading}
          apiError={error}
          clearApiError={() => setError("")}
          result={result}
        />

        {/* Subsequent Analytics & Insights Folds - Rendered only after prediction result is available */}
        {result && (
          <div className="space-y-6 pt-8 border-t border-slate-200 dark:border-slate-805/60 animate-fade-in">
            <div>
              <h2 className="text-base font-black text-slate-800 dark:text-white tracking-tight">
                Carbon & Sustainability Analytics
              </h2>
              <p className="text-xs text-slate-450 dark:text-slate-500 mt-0.5">
                Real-time charts showcasing emissions distribution and scorecards
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <EmissionGaugeChart carbonFootprint={result.carbon_footprint} loading={loading} />
              <EmissionBreakdownChart carbonFootprint={result.carbon_footprint} formData={lastPayload} loading={loading} />
              <SustainabilityScoreChart carbonFootprint={result.carbon_footprint} loading={loading} />
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

export default Dashboard;