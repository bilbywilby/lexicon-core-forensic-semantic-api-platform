import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { RetrievalRequest, RetrievalResponse, RetrievalResult } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Zap, Info, Cpu, Fingerprint, Timer, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
export function QueryPage() {
  const [query, setQuery] = useState('');
  const [topK, setTopK] = useState([5]);
  const [threshold, setThreshold] = useState([0.35]);
  const queryMutation = useMutation({
    mutationFn: (req: RetrievalRequest) => api<RetrievalResponse>('/api/retrieve', { 
      method: 'POST', 
      body: JSON.stringify(req) 
    }),
  });
  const handleSearch = () => {
    if (!query.trim()) return;
    queryMutation.mutate({
      query,
      topK: topK[0],
      threshold: threshold[0]
    });
  };
  const mockVector = Array.from({ length: 8 }, (_, i) => Math.sin(query.length + i).toFixed(2));
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Semantic Playground</h1>
        <p className="text-muted-foreground">Forensic vector matching and relevance scoring simulation.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-4 h-fit glass border-border/50">
          <CardHeader>
            <CardTitle>Search Parameters</CardTitle>
            <CardDescription>Configure neural retrieval sensitivity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Context Query</Label>
                <div className="relative">
                  <Input
                    placeholder="Describe a forensic event..."
                    className="pr-10 glass"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30 border border-border/40 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                  <Fingerprint className="h-3 w-3" /> Simulated Vector Fingerprint
                </p>
                <div className="flex flex-wrap gap-1">
                  {mockVector.map((v, i) => (
                    <span key={i} className="text-[10px] font-mono bg-background/50 px-1 rounded border border-border/20">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Results Limit (K)</Label>
                  <span className="text-xs font-mono">{topK[0]}</span>
                </div>
                <Slider value={topK} onValueChange={setTopK} min={1} max={10} step={1} />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Similarity Floor</Label>
                  <span className="text-xs font-mono">{(threshold[0] * 100).toFixed(0)}%</span>
                </div>
                <Slider value={threshold} onValueChange={setThreshold} min={0} max={1} step={0.05} />
              </div>
            </div>
            <Button className="w-full gap-2 btn-gradient" onClick={handleSearch} disabled={queryMutation.isPending}>
              {queryMutation.isPending ? 'Neural Processing...' : <><Zap className="h-4 w-4" /> Execute Retrieval</>}
            </Button>
          </CardContent>
        </Card>
        <div className="lg:col-span-8 space-y-4">
          {queryMutation.data ? (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
               <div className="flex items-center justify-between px-2">
                 <div className="flex items-center gap-3">
                    <p className="text-sm text-muted-foreground">
                      Ranked {queryMutation.data.matches.length} matches
                    </p>
                    <Badge variant="outline" className="gap-1 glass text-primary-foreground/70 bg-primary/10">
                      <Timer className="h-3 w-3" /> {queryMutation.data.latencyMs}ms
                    </Badge>
                 </div>
                 <Badge variant="outline" className="gap-1 glass border-primary/30"><Cpu className="h-3 w-3" /> Edge Inference</Badge>
               </div>
               {queryMutation.data.matches.map((match) => (
                 <Card key={match.id} className="glass border-l-4 border-primary shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5 space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium leading-relaxed">{match.content}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-[10px] py-0 glass">{match.metadata.source}</Badge>
                            <Badge variant="secondary" className="text-[10px] py-0 glass">{match.metadata.category}</Badge>
                            <span className="text-[10px] font-mono text-muted-foreground">{match.metadata.integrityHash}</span>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-1 min-w-[60px]">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">Relevance</span>
                          <span className="font-mono text-base font-bold text-primary">{(match.score * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] text-muted-foreground uppercase">
                           <span>Signal Strength</span>
                           <span>Vector Match</span>
                        </div>
                        <Progress value={match.score * 100} className="h-2 bg-secondary" />
                      </div>
                    </CardContent>
                 </Card>
               ))}
               {queryMutation.data.matches.length === 0 && (
                 <div className="py-20 flex flex-col items-center justify-center glass rounded-xl border-dashed">
                    <AlertCircle className="h-8 w-8 text-muted-foreground opacity-30 mb-2" />
                    <p className="text-sm text-muted-foreground">No matches found above threshold.</p>
                 </div>
               )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center text-muted-foreground space-y-4 border rounded-xl glass bg-muted/10">
              <div className="p-4 rounded-full bg-secondary/50">
                <Info className="h-10 w-10 opacity-40" />
              </div>
              <div className="max-w-xs mx-auto">
                <p className="font-semibold text-foreground">Operational Interface Ready</p>
                <p className="text-xs mt-2 text-muted-foreground">
                  Adjust vector parameters and input natural language context to perform forensic retrieval across the distributed bank.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}