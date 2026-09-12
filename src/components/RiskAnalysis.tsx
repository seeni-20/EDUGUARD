import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PredictionResult } from "@/src/lib/gemini";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { AlertTriangle, CheckCircle2, Info, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { motion } from "motion/react";

interface RiskAnalysisProps {
  result: PredictionResult;
}

export function RiskAnalysis({ result }: RiskAnalysisProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case "Low": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "Moderate": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "High": return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      default: return "text-slate-500 bg-slate-500/10 border-slate-500/20";
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "Positive": return <ArrowUpRight className="w-4 h-4 text-emerald-500" />;
      case "Negative": return <ArrowDownRight className="w-4 h-4 text-rose-500" />;
      default: return <Minus className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden border-2 border-primary/5 shadow-2xl">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl font-bold tracking-tighter">Risk Assessment</CardTitle>
                <CardDescription>AI-driven prediction based on student performance data.</CardDescription>
              </div>
              <Badge variant="outline" className={`text-lg px-4 py-1 font-bold ${getRiskColor(result.riskLevel)}`}>
                {result.riskLevel} Risk
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Dropout Probability</span>
                    <span className="text-4xl font-black tabular-nums">{result.probability}%</span>
                  </div>
                  <Progress value={result.probability} className="h-3" />
                </div>

                <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    AI Reasoning
                  </h4>
                  <p className="text-lg leading-relaxed text-foreground/90 font-medium italic">
                    "{result.reasoning}"
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.factors.map((factor, idx) => (
                    <div key={idx} className="p-4 rounded-xl border bg-card hover:bg-accent/5 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm">{factor.name}</span>
                        {getImpactIcon(factor.impact)}
                      </div>
                      <p className="text-xs text-muted-foreground leading-snug">{factor.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 h-full">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Recommended Actions
                  </h4>
                  <ul className="space-y-4">
                    {result.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex gap-3 items-start">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </span>
                        <span className="text-sm font-medium leading-tight">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
