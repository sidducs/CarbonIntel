/**
 * Sustainability Copilot Rule-based Response Engine
 * Designed for future compatibility to easily swap in an LLM call.
 */

// Helper to calculate risk details if not fully available in props
function getRiskAssessment(carbonFootprint, sustainability, formData) {
  const risks = [];
  if (carbonFootprint > 600) {
    risks.push({
      factor: "High Emission Volatility",
      detail: "Net carbon footprint exceeds 600 kg CO₂e/ha, driven primarily by intensive inputs or soil management practices."
    });
  }
  if (formData?.fertilizerAmount > 150) {
    risks.push({
      factor: "Fertilizer Over-application",
      detail: "Fertilizer amount is high (>150 kg/ha), causing high synthetic nitrous oxide (N₂O) soil volatilization."
    });
  }
  if (formData?.soilOrganicCarbon < 1.5) {
    risks.push({
      factor: "Low Soil Organic Carbon",
      detail: "SOC is below 1.5%. Soil organic matter is low, reducing the potential of the field to act as a carbon sink."
    });
  }
  if (formData?.soilPh < 5.5 || formData?.soilPh > 7.5) {
    risks.push({
      factor: "pH Stress Level",
      detail: `Soil pH of ${formData?.soilPh} is outside the optimal 6.0-7.0 range, which can lead to low fertilizer utilization efficiency.`
    });
  }
  if (risks.length === 0) {
    risks.push({
      factor: "Nominal Climate Risk",
      detail: "Current agricultural parameters display high carbon sequestration efficiency and stable nutrient metrics."
    });
  }
  return risks;
}

// Generate rule-based response
export function generateCopilotResponse({
  message,
  formData,
  carbonFootprint,
  sustainability,
  history = []
}) {
  const cleanMessage = message.trim().toLowerCase();
  
  // Calculate contextual metrics
  const crop = formData?.cropType || "N/A";
  const fert = formData?.fertilizerType || "N/A";
  const fertAmt = formData?.fertilizerAmount || 0;
  const soc = formData?.soilOrganicCarbon || 0;
  const ph = formData?.soilPh || 7.0;
  const credits = carbonFootprint < 300 ? Math.max(0, Math.floor((300 - carbonFootprint) * 1.5)) : 0;
  
  const risks = getRiskAssessment(carbonFootprint, sustainability, formData);
  
  // Response template selector
  if (cleanMessage.includes("reduce emission") || cleanMessage.includes("carbon footprint") || cleanMessage.includes("footprint")) {
    return `To reduce your farm's carbon footprint of **${carbonFootprint?.toFixed(1) || "N/A"} kg CO₂e/ha**, here are the most effective actions you can take:

1. **Optimize Fertilizer Application**: Fertilizer represents a key contributor here. Since you are using **${fert}** at **${fertAmt} kg/ha**, consider moving to organic fertilizer or reducing synthetic NPK application rates.
2. **Cultivate SOC (Soil Organic Carbon)**: Your current SOC is **${soc}%**. Increasing this by applying biochar, adopting cover cropping, or reducing tillage will sequester more carbon and build a larger offset sink.
3. **Select Low-Emission Crop Alternatives**: Crop types have baseline biological factors. For example, transition from high-emission flooded rice systems if possible, or rotate with legumes to build organic nitrogen.`;
  }
  
  if (cleanMessage.includes("sustainability score") || cleanMessage.includes("sustainability rating") || cleanMessage.includes("score") || cleanMessage.includes("rating")) {
    return `Your current sustainability rating is **${sustainability || "N/A"}**.

- A score of **A** or **B** indicates strong organic soil offset and balanced inputs.
- A score of **C**, **D**, or **E** suggests elevated risk, usually from high synthetic nitrogen fertilization, low soil carbon, or sub-optimal pH levels.

To improve your score:
- **Calibrate pH**: Your soil pH is **${ph}**. Soil pH affects nutrient absorption. Keep pH between 6.0 and 7.0 to maximize nutrient uptake and minimize runoff.
- **Boost carbon sinks**: Build up Soil Organic Carbon. A higher SOC acts as a carbon buffer, pulling carbon back into the soil matrix and instantly raising your sustainability grade.`;
  }
  
  if (cleanMessage.includes("fertilizer") || cleanMessage.includes("fertilizer changes")) {
    return `You are currently applying **${fertAmt} kg/ha** of **${fert}**.

Here is a customized fertilizer strategy to decrease greenhouse gas emissions:
1. **Reduce synthetic fertilizer amount**: Try reducing synthetic fertilizer application. Consider implementing the **4R Nutrient Stewardship** principles: right source, right rate, right time, and right place.
2. **Transition to Organic Blends**: Organic options (compost, manure) have a significantly lower carbon factor (0.4) compared to synthetic alternatives like Ammonium Nitrate (2.9) or Urea (2.3).
3. **Use Nitrification Inhibitors**: If using synthetic nitrogen, inhibitors can reduce the biological conversion of ammonium to nitrate, reducing N₂O gas loss.`;
  }
  
  if (cleanMessage.includes("carbon credit") || cleanMessage.includes("credit") || cleanMessage.includes("increase credit")) {
    return `Your farm's carbon credit potential is currently estimated at **${credits} credits**.

Carbon credits are generated when emissions drop below the regional baseline (e.g., 300 kg CO₂e/ha). To maximize your credit generation:
1. **Increase Soil Carbon (SOC)**: Each 1% increase in SOC offsets approximately **150 kg CO₂e/ha**, which directly drives credit potential.
2. **Target a negative net footprint**: By combining high organic sequestration with zero or minimal synthetic inputs, your field becomes a net carbon sink, yielding maximum credits.
3. **No-till or conservation tillage**: Retaining crop residues prevents the oxidation of organic carbon into CO₂, securing your offset claims.`;
  }
  
  if (cleanMessage.includes("soil health") || cleanMessage.includes("soil")) {
    return `Based on your soil data:
- **Soil Organic Carbon (SOC)**: **${soc}%**
- **Soil pH**: **${ph}**

Recommended practices for optimal soil health:
1. **Grow cover crops**: Legumes and grasses during off-seasons stabilize soil carbon, prevent leaching of nutrients, and improve biodiversity.
2. **Correct pH imbalances**: If pH is too acidic (<5.5), apply agricultural lime. If alkaline (>7.5), add elemental sulfur.
3. **Add organic matter**: Regularly top-dress with compost or manure. This slowly builds humus and improves the soil structure.`;
  }
  
  if (cleanMessage.includes("what should i do first") || cleanMessage.includes("first") || cleanMessage.includes("help") || cleanMessage.includes("hello") || cleanMessage.includes("hi")) {
    return `Hello! I am your AI Sustainability Copilot. Based on your current farm assessment, here is your primary roadmap order:

1. **Assess Soil Carbon**: With your SOC at **${soc}%**, your immediate focus should be building soil organic matter to capture carbon naturally.
2. **Refine Fertilizer Inputs**: Look at reducing your **${fertAmt} kg/ha** of **${fert}** or substituting part of it with organic materials.
3. **Stabilize Soil pH**: Make sure your pH of **${ph}** is optimized for crop growth, reducing the need for chemical fertilizers.

*Ask me about any specific parameter or metrics to dive deeper!*`;
  }
  
  // Default general response
  return `Based on your farm's current assessment data:
- **Crop Type**: ${crop}
- **Net Carbon Footprint**: ${carbonFootprint?.toFixed(1) || "N/A"} kg CO₂e/ha
- **Sustainability Grade**: ${sustainability || "N/A"}
- **Fertilizer Info**: ${fertAmt} kg/ha of ${fert}

**Active Risk Factors Detected**:
${risks.map((r, i) => `${i+1}. **${r.factor}**: ${r.detail}`).join("\n")}

Feel free to ask me questions like:
- *"How can I reduce emissions?"*
- *"Why is my sustainability score low?"*
- *"What fertilizer changes should I make?"*
- *"How do I improve carbon credits?"*
- *"What should I do first?"*`;
}

/**
 * Modern LLM integration placeholder (OpenAI / Gemini / Ollama).
 * In the future, the frontend can swap `generateCopilotResponse` with this async function:
 */
export async function generateLLMResponse({
  message,
  formData,
  carbonFootprint,
  sustainability,
  history = [],
  provider = "openai", // "gemini" | "ollama"
  apiKey
}) {
  // Real implementation will perform fetch/SDK call to the corresponding provider
  // e.g.
  // const prompt = `User: ${message}. Farm Context: ...`;
  // const response = await fetch("https://api.openai.com/v1/chat/completions", ...);
  // return response.json().choices[0].message.content;
  throw new Error("LLM Engine not configured. Please supply API keys to integrate.");
}
