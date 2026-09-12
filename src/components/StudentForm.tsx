import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { StudentMetrics } from "@/src/lib/gemini";
import { GraduationCap, Users, BookOpen, Activity, AlertCircle } from "lucide-react";

interface StudentFormProps {
  onSubmit: (metrics: StudentMetrics) => void;
  isLoading: boolean;
}

export function StudentForm({ onSubmit, isLoading }: StudentFormProps) {
  const [metrics, setMetrics] = React.useState<StudentMetrics>({
    attendance: 85,
    marks: 75,
    participation: 7,
    extracurriculars: 5,
    behaviorScore: 8,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(metrics);
  };

  return (
    <Card className="w-full border-2 border-primary/10 shadow-xl bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <GraduationCap className="w-6 h-6 text-primary" />
          <CardTitle className="text-2xl font-bold tracking-tight">Student Metrics</CardTitle>
        </div>
        <CardDescription>
          Enter the student's current academic and behavioral data for risk assessment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="attendance" className="text-sm font-medium flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  Attendance (%)
                </Label>
                <Input
                  id="attendance"
                  type="number"
                  min="0"
                  max="100"
                  value={metrics.attendance}
                  onChange={(e) => setMetrics({ ...metrics, attendance: Number(e.target.value) })}
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="marks" className="text-sm font-medium flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  Average Marks (%)
                </Label>
                <Input
                  id="marks"
                  type="number"
                  min="0"
                  max="100"
                  value={metrics.marks}
                  onChange={(e) => setMetrics({ ...metrics, marks: Number(e.target.value) })}
                  className="font-mono"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Activity className="w-4 h-4 text-muted-foreground" />
                    Participation (1-10)
                  </Label>
                  <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{metrics.participation}</span>
                </div>
                <Slider
                  value={[metrics.participation]}
                  onValueChange={(val) => setMetrics({ ...metrics, participation: val[0] })}
                  max={10}
                  step={1}
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Activity className="w-4 h-4 text-muted-foreground" />
                    Extracurriculars (1-10)
                  </Label>
                  <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{metrics.extracurriculars}</span>
                </div>
                <Slider
                  value={[metrics.extracurriculars]}
                  onValueChange={(val) => setMetrics({ ...metrics, extracurriculars: val[0] })}
                  max={10}
                  step={1}
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-muted-foreground" />
                    Behavior Score (1-10)
                  </Label>
                  <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{metrics.behaviorScore}</span>
                </div>
                <Slider
                  value={[metrics.behaviorScore]}
                  onValueChange={(val) => setMetrics({ ...metrics, behaviorScore: val[0] })}
                  max={10}
                  step={1}
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/20" disabled={isLoading}>
            {isLoading ? "Analyzing Data..." : "Generate Risk Assessment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
