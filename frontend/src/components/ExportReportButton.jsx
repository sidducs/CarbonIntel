import { useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

function ExportReportButton({ formData, carbonFootprint, sustainability }) {
  const [exportState, setExportState] = useState("default"); // default, loading, success

  const hasValue = carbonFootprint !== null && carbonFootprint !== undefined && formData !== null && formData !== undefined;

  // Show nothing if no assessment exists
  if (!hasValue) {
    return null;
  }

  const handleExport = () => {
    setExportState("loading");

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const numCF = parseFloat(carbonFootprint);
      const crop = formData.Crop_Type || "Rice";
      const fertType = formData.Fertilizer_Type || "Urea";
      const fertAmount = parseFloat(formData.Fertilizer_Amount || 0);
      const soc = parseFloat(formData.SOC || 0);
      const ph = parseFloat(formData.pH || 0);

      // Carbon Credits calculation
      let credits = 0;
      if (numCF < 800) {
        credits = parseFloat(((800 - numCF) / 1000).toFixed(2));
      }
      const revenue = credits * 1500;

      // Crop benchmarks
      const benchmarks = {
        Rice: 1200,
        Corn: 800,
        Wheat: 600,
        Soybeans: 400,
        Vegetables: 700
      };
      const benchmarkVal = benchmarks[crop] || 800;

      // Primary theme branding colors
      const primaryColor = [6, 95, 70]; // Deep Emerald Forest
      const darkColor = [30, 41, 59]; // Slate 800
      const accentColor = [16, 185, 129]; // Emerald Green

      // 1. PAGE HEADER
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 32, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("Agricultural Carbon Footprint Assessment", 14, 18);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Professional ESG & Environmental Sustainability Report", 14, 25);

      // Report Logo / Decorative Block
      doc.setFillColor(...accentColor);
      doc.rect(176, 0, 34, 32, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("ESG", 183, 21);

      let currentY = 42;

      // 2. REPORT METADATA & PROFILE BLOCK
      doc.setTextColor(...darkColor);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Assessment Metadata", 14, currentY);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.4);
      doc.line(14, currentY + 2, 196, currentY + 2);

      currentY += 8;

      const metadataRows = [
        [
          "Generation Date:", new Date().toLocaleDateString(),
          "Evaluation Model:", "FastAPI-LinearRegression (v1.0.0)"
        ],
        [
          "Assessment Type:", "Standard Agricultural ESG",
          "Verification Status:", "System Certified"
        ]
      ];

      autoTable(doc, {
        startY: currentY,
        head: [],
        body: metadataRows,
        margin: { left: 14, right: 14 },
        theme: "plain",
        styles: {
          fontSize: 9,
          cellPadding: 1.5,
          fontStyle: "normal",
        },
        columnStyles: {
          0: { fontStyle: "bold", textColor: [100, 116, 139], width: 35 },
          1: { textColor: [30, 41, 59], width: 60 },
          2: { fontStyle: "bold", textColor: [100, 116, 139], width: 35 },
          3: { textColor: [30, 41, 59], width: 60 }
        }
      });

      currentY = doc.lastAutoTable.finalY + 8;

      // 3. SECTION 1: FARM INFORMATION
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("1. Farm Information Profile", 14, currentY);
      doc.line(14, currentY + 2, 196, currentY + 2);

      currentY += 6;

      const farmInfoBody = [
        ["Crop Type", crop, "Soil pH", ph],
        ["Soil Organic Carbon (SOC)", `${soc} %`, "N Content", `${formData.N_Content} kg/ha`],
        ["P Content", `${formData.P_Content} kg/ha`, "K Content", `${formData.K_Content} kg/ha`],
        ["Fertilizer Type", fertType, "Fertilizer Amount", `${fertAmount} kg/ha`],
        ["Temperature", `${formData.Temperature} °C`, "Relative Humidity", `${formData.Humidity} %`],
        ["Annual Rainfall", `${formData.Rainfall} mm`, "", ""]
      ];

      autoTable(doc, {
        startY: currentY,
        head: [],
        body: farmInfoBody,
        margin: { left: 14, right: 14 },
        theme: "striped",
        styles: {
          fontSize: 9,
          cellPadding: 2.5
        },
        columnStyles: {
          0: { fontStyle: "bold", width: 45 },
          1: { width: 45 },
          2: { fontStyle: "bold", width: 45 },
          3: { width: 45 }
        }
      });

      currentY = doc.lastAutoTable.finalY + 8;

      // 4. SECTION 2: ASSESSMENT RESULTS
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("2. Sustainability Assessment Results", 14, currentY);
      doc.line(14, currentY + 2, 196, currentY + 2);

      currentY += 6;

      const resultsBody = [
        ["Carbon Footprint", `${numCF.toLocaleString()} kg CO2e/ha`, "Predicted total greenhouse gas emission rate per hectare."],
        ["Sustainability Level", sustainability, "Calculated environment rating based on fertilizer usage and sequestration capacity."],
        ["Carbon Credits", `${credits} credits/ha`, "Voluntary carbon market certificate potential based on sustainable targets."],
        ["Estimated Valuation", `$${revenue.toLocaleString()} USD/ha`, "Current market carbon mitigation offset valuation."]
      ];

      autoTable(doc, {
        startY: currentY,
        head: [["Indicator", "Value", "Description"]],
        body: resultsBody,
        margin: { left: 14, right: 14 },
        theme: "grid",
        headStyles: {
          fillColor: primaryColor,
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: "bold"
        },
        styles: {
          fontSize: 9,
          cellPadding: 3
        },
        columnStyles: {
          0: { fontStyle: "bold", width: 45 },
          1: { fontStyle: "bold", width: 45 },
          2: { width: 90 }
        }
      });

      currentY = doc.lastAutoTable.finalY + 8;

      // 5. SECTION 3: KEY FINDINGS
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("3. Key Diagnostic Findings", 14, currentY);
      doc.line(14, currentY + 2, 196, currentY + 2);

      currentY += 6;

      const findings = [];
      if (numCF > benchmarkVal) {
        const diffPct = Math.round(((numCF - benchmarkVal) / benchmarkVal) * 100);
        findings.push([`- Footprint is ${diffPct}% above the regional industry benchmark for ${crop} (${benchmarkVal} kg/ha).`]);
      } else {
        const diffPct = Math.round(((benchmarkVal - numCF) / benchmarkVal) * 100);
        findings.push([`- Footprint performs well, representing a ${diffPct}% decrease compared to standard benchmarks.`]);
      }

      if (soc < 2.0) {
        findings.push([`- Soil Organic Carbon (SOC) is low (${soc}%), limiting potential natural carbon sequestration.`]);
      } else {
        findings.push([`- Soil Organic Carbon (SOC) is healthy (${soc}%), supporting sustainable carbon sink capabilities.`]);
      }

      if (fertAmount > 250) {
        findings.push([`- Chemical fertilizer dose of ${fertAmount} kg/ha represents a major greenhouse gas emission driver.`]);
      }

      if (ph < 5.5 || ph > 7.5) {
        findings.push([`- Soil pH (${ph}) is outside the optimal absorption range, limiting fertilizer efficiency.`]);
      }

      autoTable(doc, {
        startY: currentY,
        head: [],
        body: findings,
        margin: { left: 14, right: 14 },
        theme: "plain",
        styles: {
          fontSize: 9.5,
          cellPadding: 2,
          textColor: [71, 85, 105]
        }
      });

      currentY = doc.lastAutoTable.finalY + 8;

      // Check page break for Recommendations
      if (currentY > 210) {
        doc.addPage();
        currentY = 20;
      }

      // 6. SECTION 4: RECOMMENDATIONS ROADMAP
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("4. Recommended Action Roadmap", 14, currentY);
      doc.line(14, currentY + 2, 196, currentY + 2);

      currentY += 6;

      const recs = [];
      if (soc < 2.0) {
        recs.push(["Rebuild Soil Carbon", "Apply biochar, cover cropping, or compost to increase soil organic carbon above 2.0%."]);
      }
      if (fertAmount > 250) {
        recs.push(["Optimize Nitrogen Rates", "Transition to slow-release coated formulations and split dosing schedules."]);
      } else if (fertType === "Urea") {
        recs.push(["Substitute Urea", "Consider substituting Urea with low-volatilization slow-release fertilizers."]);
      }
      if (ph < 5.5) {
        recs.push(["Buffer Soil Acidity", "Apply agricultural lime (calcium carbonate) to stabilize pH."]);
      } else if (ph > 7.5) {
        recs.push(["Lower Soil Alkalinity", "Add elemental sulfur or organic composts to lower pH levels."]);
      }
      recs.push(["Continuous Carbon Auditing", "Conduct periodic soil tests to track sequestration and footprint trends."]);

      const topRecs = recs.slice(0, 3);

      autoTable(doc, {
        startY: currentY,
        head: [["Recommendation Focus", "Description / Practical Steps"]],
        body: topRecs,
        margin: { left: 14, right: 14 },
        theme: "grid",
        headStyles: {
          fillColor: primaryColor,
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: "bold"
        },
        styles: {
          fontSize: 9,
          cellPadding: 3
        },
        columnStyles: {
          0: { fontStyle: "bold", width: 50 },
          1: { width: 130 }
        }
      });

      currentY = doc.lastAutoTable.finalY + 8;

      // 7. SECTION 5: GENERAL STATEMENT
      let assessmentSummary = "";
      if (sustainability === "High") {
        assessmentSummary = "This farm demonstrates exemplary sustainability performance, maintaining a low-emission carbon footprint well below industry averages. By preserving these regenerative practices, the operation is highly eligible to participate in carbon credit markets, generating additional green revenue.";
      } else if (sustainability === "Medium") {
        assessmentSummary = "This farm demonstrates moderate sustainability performance with clear opportunities for emission reduction through improved fertilizer management and soil carbon enhancement. Mitigating chemical fertilizer quantity and replacing standard urea with coated slow-release options can effectively decrease footprint intensity.";
      } else {
        assessmentSummary = "This farm demonstrates critical environmental footprint impact and low sustainability performance. Urgent priority interventions are recommended, specifically focusing on curbing high fertilizer usage, buffering soil pH levels, and implementing immediate cover cropping to rebuild depleted soil organic carbon reserves.";
      }

      if (currentY > 230) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("General Assessment Summary", 14, currentY);
      currentY += 4;
      doc.setFont("helvetica", "oblique");
      doc.setFontSize(9.5);
      doc.setTextColor(71, 85, 105);
      const textLines = doc.splitTextToSize(assessmentSummary, 180);
      doc.text(textLines, 14, currentY);

      // 8. REPORT FOOTER (Page Numbering & Copyright)
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text("Confidential ESG Report - Page " + i + " of " + pageCount, 14, 287);
        doc.text("CarbonFootprintML Model Evaluation Platform", 135, 287);
      }

      // Save PDF
      doc.save(`carbon_assessment_report_${crop.toLowerCase()}.pdf`);
      setExportState("success");

      // Reset state back to default after 3 seconds
      setTimeout(() => {
        setExportState("default");
      }, 3000);
    } catch (err) {
      console.error("PDF export error:", err);
      setExportState("default");
    }
  };

  return (
    <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-center sm:justify-start">
      <button
        onClick={handleExport}
        disabled={exportState === "loading"}
        className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm tracking-tight shadow-md transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
          exportState === "loading"
            ? "bg-slate-100 dark:bg-slate-900/30 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800 cursor-not-allowed"
            : exportState === "success"
            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
            : "bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white hover:-translate-y-0.5"
        }`}
      >
        {exportState === "loading" ? (
          <>
            <svg className="w-4 h-4 animate-spin text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.228 10H16.24" />
            </svg>
            Generating Report PDF...
          </>
        ) : exportState === "success" ? (
          <>
            <svg className="w-4 h-4 text-emerald-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
            Assessment Report Saved!
          </>
        ) : (
          <>
            <svg className="w-4 h-4 text-emerald-450" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Assessment Report
          </>
        )}
      </button>
    </div>
  );
}

export default ExportReportButton;
