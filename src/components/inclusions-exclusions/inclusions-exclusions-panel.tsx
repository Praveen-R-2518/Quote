"use client";

import { useEffect, useState } from "react";
import { useQuotationStore } from "@/store/quotation-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function InclusionsExclusionsPanel() {
  const { draft, config, setInclusions, setExclusions, applyDefaultInclusionsExclusions } = useQuotationStore();
  const [newInclusion, setNewInclusion] = useState("");
  const [newExclusion, setNewExclusion] = useState("");

  useEffect(() => {
    if (draft.inclusions.length === 0 && draft.exclusions.length === 0 && config) {
      applyDefaultInclusionsExclusions();
    }
  }, [config]);

  const toggleInclusion = (text: string) => {
    setInclusions(
      draft.inclusions.includes(text)
        ? draft.inclusions.filter((i) => i !== text)
        : [...draft.inclusions, text]
    );
  };

  const toggleExclusion = (text: string) => {
    setExclusions(
      draft.exclusions.includes(text)
        ? draft.exclusions.filter((e) => e !== text)
        : [...draft.exclusions, text]
    );
  };

  const addCustomInclusion = () => {
    if (newInclusion.trim()) {
      setInclusions([...draft.inclusions, newInclusion.trim()]);
      setNewInclusion("");
    }
  };

  const addCustomExclusion = () => {
    if (newExclusion.trim()) {
      setExclusions([...draft.exclusions, newExclusion.trim()]);
      setNewExclusion("");
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Inclusions</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={applyDefaultInclusionsExclusions}>Reset Defaults</Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {config?.inclusionTemplates.map((t) => (
            <label key={t.id} className="flex items-start gap-2">
              <Checkbox checked={draft.inclusions.includes(t.text)} onChange={() => toggleInclusion(t.text)} />
              <span className="text-sm">{t.text}</span>
            </label>
          ))}
          <div className="flex gap-2 pt-2">
            <Input value={newInclusion} onChange={(e) => setNewInclusion(e.target.value)} placeholder="Custom inclusion" />
            <Button type="button" onClick={addCustomInclusion}>Add</Button>
          </div>
          {draft.inclusions.filter((i) => !config?.inclusionTemplates.some((t) => t.text === i)).map((item, i) => (
            <div key={i} className="text-sm text-emerald-700">+ {item}</div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Exclusions</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {config?.exclusionTemplates.map((t) => (
            <label key={t.id} className="flex items-start gap-2">
              <Checkbox checked={draft.exclusions.includes(t.text)} onChange={() => toggleExclusion(t.text)} />
              <span className="text-sm">{t.text}</span>
            </label>
          ))}
          <div className="flex gap-2 pt-2">
            <Input value={newExclusion} onChange={(e) => setNewExclusion(e.target.value)} placeholder="Custom exclusion" />
            <Button type="button" onClick={addCustomExclusion}>Add</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
