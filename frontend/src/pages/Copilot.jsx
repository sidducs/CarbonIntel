import { useState, useEffect, useRef } from "react";
import PageLayout from "../components/PageLayout";
import DashboardCard from "../components/DashboardCard";
import { generateCopilotResponse } from "../services/copilotEngine";

function Copilot() {
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

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const responseText = generateCopilotResponse({
        message: textToSend,
        formData: lastPayload,
        carbonFootprint: result?.carbon_footprint,
        sustainability: result?.sustainability,
        history: messages
      });

      const copilotMsg = {
        id: Date.now() + 1,
        role: "copilot",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, copilotMsg]);
      setIsTyping(false);
    }, 850);
  };

  const suggestedQuestions = [
    { label: "Reduce Carbon Footprint", query: "How can I reduce emissions?" },
    { label: "Improve Sustainability", query: "Why is my sustainability score low?" },
    { label: "Increase Carbon Credits", query: "How do I improve carbon credits?" },
    { label: "Reduce Fertilizer Usage", query: "What fertilizer changes should I make?" },
    { label: "Improve Soil Health", query: "How can I improve soil health?" }
  ];

  // Helper to get active context values
  const carbonFootprint = result?.carbon_footprint;
  const sustainability = result?.sustainability;
  const crop = lastPayload?.cropType || "N/A";
  const fert = lastPayload?.fertilizerType || "N/A";
  const fertAmt = lastPayload?.fertilizerAmount || 0;
  const soc = lastPayload?.soilOrganicCarbon || 0;
  const ph = lastPayload?.soilPh || 7.0;
  const credits = carbonFootprint < 300 ? Math.max(0, Math.floor((300 - carbonFootprint) * 1.5)) : 0;

  // Simple Risk Builder for Context Display
  const getContextRisks = () => {
    const risks = [];
    if (carbonFootprint > 600) risks.push("High emission baseline");
    if (fertAmt > 150) risks.push("High fertilizer inputs");
    if (soc < 1.5) risks.push("Low organic soil sink");
    if (ph < 5.5 || ph > 7.5) risks.push("Suboptimal soil pH");
    if (risks.length === 0) risks.push("No immediate carbon risks");
    return risks;
  };

  return (
    <PageLayout
      title="Sustainability Copilot"
      subtitle="Ask the Sustainability Copilot anything about your assessment."
      breadcrumbs={[
        { label: "Dashboard", path: "/dashboard" },
        { label: "Copilot" }
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-[calc(100vh-230px)]">
        {/* Left Side: Assessment Context */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <DashboardCard
            title="Assessment Context"
            icon={
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          >
            {!result ? (
              <div className="text-center py-8 space-y-3">
                <div className="inline-flex p-3 rounded-full bg-slate-50 dark:bg-slate-900 text-slate-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                  No active assessment loaded. Complete the evaluation on the Dashboard first to populate farm metrics.
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* Metric 1 */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <span className="font-semibold text-slate-500 dark:text-slate-450">Net Carbon Footprint</span>
                  <span className="font-extrabold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded">
                    {carbonFootprint?.toFixed(1)} kg CO₂e/ha
                  </span>
                </div>
                {/* Metric 2 */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <span className="font-semibold text-slate-550 dark:text-slate-450">Sustainability Rating</span>
                  <span className={`font-extrabold px-2.5 py-0.5 rounded-full ${
                    sustainability === "A" || sustainability === "B"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450"
                      : "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-450"
                  }`}>
                    Grade {sustainability}
                  </span>
                </div>
                {/* Metric 3 */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <span className="font-semibold text-slate-550 dark:text-slate-450">Carbon Credits</span>
                  <span className="font-extrabold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded">
                    {credits} Credits
                  </span>
                </div>
                {/* Metric 4 */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <span className="font-semibold text-slate-550 dark:text-slate-450">Crop Type</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{crop}</span>
                </div>
                {/* Metric 5 */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <span className="font-semibold text-slate-550 dark:text-slate-450">Fertilizer Blend</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{fert} ({fertAmt} kg/ha)</span>
                </div>
                {/* Metric 6 */}
                <div className="space-y-1.5 pt-1">
                  <span className="font-semibold text-slate-550 dark:text-slate-450 block">Key Risks</span>
                  <div className="flex flex-wrap gap-1.5">
                    {getContextRisks().map((risk, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-rose-50/50 text-rose-700 border border-rose-100 dark:bg-rose-950/25 dark:text-rose-400 dark:border-rose-900/30 rounded text-[10px] font-semibold"
                      >
                        {risk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DashboardCard>
        </div>

        {/* Right Side: AI Chat Interface */}
        <div className="lg:col-span-8 flex flex-col bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden min-h-[500px]">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/30">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Sustainability Copilot</h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Decisions helper • Rule-based simulation</p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[400px]">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-full animate-bounce">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="space-y-1 max-w-sm mx-auto">
                  <p className="text-sm font-bold text-slate-800 dark:text-white">Ask the Sustainability Copilot anything about your assessment.</p>
                  <p className="text-xs text-slate-450 dark:text-slate-500">Get help with carbon offsets, fertilizer adjustments, and soil chemistry guidelines.</p>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[90%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
                >
                  {/* Avatar */}
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${
                    msg.role === "user"
                      ? "bg-slate-150 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                      : "bg-emerald-600 text-white"
                  }`}>
                    {msg.role === "user" ? "U" : "COP"}
                  </div>

                  {/* Bubble */}
                  <div className="space-y-1">
                    <div className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-emerald-650 text-white rounded-tr-none font-medium"
                        : "bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 text-slate-800 dark:text-slate-100 rounded-tl-none shadow-xs"
                    }`}>
                      {msg.text}
                    </div>
                    <span className={`block text-[9px] text-slate-400 dark:text-slate-500 ${msg.role === "user" ? "text-right" : ""}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                  COP
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 px-4 py-3 rounded-2xl rounded-tl-none shadow-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Actions Panel */}
          <div className="px-6 py-3 bg-slate-50/50 dark:bg-slate-900/20 border-t border-slate-100 dark:border-slate-850">
            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Suggested Questions</span>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q.query)}
                  className="px-2.5 py-1.5 bg-white dark:bg-slate-850 border border-slate-150 dark:border-slate-750 text-[10px] font-bold text-slate-700 dark:text-slate-350 rounded-lg hover:border-emerald-500 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-450 transition-all cursor-pointer shadow-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="flex items-center gap-3"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask a question about your farm assessment..."
                className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-750 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition shadow-sm hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                aria-label="Send Message"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default Copilot;
