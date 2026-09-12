import React from "react";
import { StudentForm } from "@/src/components/StudentForm";
import { RiskAnalysis } from "@/src/components/RiskAnalysis";
import { StudentMetrics, PredictionResult, predictDropoutRisk } from "@/src/lib/gemini";
import { ShieldAlert, History, LayoutDashboard, Settings, LogOut, Search, Bell } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<PredictionResult | null>(null);
  const [history, setHistory] = React.useState<{ metrics: StudentMetrics; result: PredictionResult; date: string }[]>([]);

  const handlePredict = async (metrics: StudentMetrics) => {
    setIsLoading(true);
    try {
      const prediction = await predictDropoutRisk(metrics);
      setResult(prediction);
      setHistory(prev => [{ metrics, result: prediction, date: new Date().toLocaleTimeString() }, ...prev].slice(0, 5));
    } catch (error) {
      console.error("Prediction failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-primary/20">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-border hidden lg:flex flex-col z-50">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter">EduGuard</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Risk Predictor</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { icon: LayoutDashboard, label: "Dashboard", active: true },
            { icon: History, label: "History", active: false },
            { icon: Settings, label: "Settings", active: false },
          ].map((item, idx) => (
            <button
              key={idx}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                item.active ? "bg-primary text-white shadow-md shadow-primary/20" : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-colors">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="lg:pl-64 min-h-screen">
        {/* Top Bar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search student records..."
              className="w-full pl-10 pr-4 py-2 bg-muted/50 border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-accent transition-colors relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="text-right">
                <p className="text-sm font-bold">Seenivasan M.</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-accent border-2 border-white shadow-sm overflow-hidden">
                <img src="https://picsum.photos/seed/admin/100/100" alt="User" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-4xl font-black tracking-tighter text-primary">Dropout Analysis</h2>
              <p className="text-muted-foreground font-medium">Predict and prevent student attrition with AI insights.</p>
            </div>
            <div className="flex gap-2">
              <div className="bg-white px-4 py-2 rounded-xl border border-border shadow-sm">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Scans</p>
                <p className="text-xl font-black tabular-nums">{history.length}</p>
              </div>
              <div className="bg-white px-4 py-2 rounded-xl border border-border shadow-sm">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">High Risk Flagged</p>
                <p className="text-xl font-black tabular-nums text-rose-500">
                  {history.filter(h => h.result.riskLevel === "High").length}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            <div className="xl:col-span-5">
              <StudentForm onSubmit={handlePredict} isLoading={isLoading} />
              
              {/* History Preview */}
              <div className="mt-8 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground px-1">Recent Assessments</h3>
                <div className="space-y-2">
                  {history.length === 0 ? (
                    <div className="p-8 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center text-center">
                      <History className="w-8 h-8 text-muted-foreground/30 mb-2" />
                      <p className="text-sm text-muted-foreground">No history yet. Start by analyzing a student.</p>
                    </div>
                  ) : (
                    history.map((item, idx) => (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={idx}
                        className="bg-white p-4 rounded-xl border border-border shadow-sm flex items-center justify-between hover:border-primary/30 transition-colors cursor-pointer"
                        onClick={() => setResult(item.result)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            item.result.riskLevel === "High" ? "bg-rose-500" : 
                            item.result.riskLevel === "Moderate" ? "bg-amber-500" : "bg-emerald-500"
                          }`} />
                          <div>
                            <p className="text-sm font-bold">{item.result.riskLevel} Risk</p>
                            <p className="text-[10px] text-muted-foreground font-mono">{item.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold tabular-nums">{item.result.probability}% Prob.</p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="xl:col-span-7">
              <AnimatePresence mode="wait">
                {result ? (
                  <RiskAnalysis result={result} />
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full min-h-[500px] rounded-3xl border-2 border-dashed border-border bg-white/50 flex flex-col items-center justify-center p-12 text-center"
                  >
                    <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mb-6">
                      <LayoutDashboard className="w-10 h-10 text-muted-foreground/40" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight mb-2">Ready for Analysis</h3>
                    <p className="text-muted-foreground max-w-md">
                      Fill out the student metrics form on the left to generate a comprehensive AI-powered dropout risk assessment.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
