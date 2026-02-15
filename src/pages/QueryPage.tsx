import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { RetrievalRequest, RetrievalResponse, RetrievalResult } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Search, Zap, Info, Cpu } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
export function QueryPage() {
  const [query, setQuery] = useState('');
  const [topK, setTopK] = useState([3]);
  const [threshold, setThreshold] = useState([0.3]);
  const queryMutation = useMutation({
    mutationFn: (req: RetrievalRequest) => api<RetrievalResponse>('/api/retrieve', { method: 'POST', body: JSON.stringify(req) }),
  });
  const handleSearch = () => {
    if (!query.trim()) return;
    queryMutation.mutate({
      query,
      topK: topK[0],
      threshold: threshold[0]
    });
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Semantic Playground</h1>
        <p className="text-muted-foreground">Test retrieval logic and relevance scoring against the memory bank.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Search Parameters</CardTitle>
            <CardDescription>Adjust retrieval sensitivity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Natural Language Query</Label>
                <div className="relative">
                  <Input 
                    placeholder="Describe a forensic event..." 
                    className="pr-10"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Top Results (K)</Label>
                  <span className="text-xs font-mono">{topK[0]}</span>
                </div>
                <Slider value={topK} onValueChange={setTopK} min={1} max={10} step={1} />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Similarity Threshold</Label>
                  <span className="text-xs font-mono">{(threshold[0] * 100).toFixed(0)}%</span>
                </div>
                <Slider value={threshold} onValueChange={setThreshold} min={0} max={1} step={0.05} />
              </div>
            </div>
            <Button className="w-full gap-2" onClick={handleSearch} disabled={queryMutation.isPending}>
              {queryMutation.isPending ? 'Processing...' : <><Zap className="h-4 w-4" /> Run Retrieval</>}
            </Button>
          </CardContent>
        </Card>
        <div className="lg:col-span-2 space-y-4">
          {queryMutation.data ? (
            <div className="space-y-4 animate-in fade-in duration-500">
               <div className="flex items-center justify-between px-2">
                 <p className="text-sm text-muted-foreground">
                   Found {queryMutation.data.matches.length} matches in {queryMutation.data.latencyMs}ms
                 </p>
                 <Badge variant="outline" className="gap-1"><Cpu className="h-3 w-3" /> Edge Inference</Badge>
               </div>
               {queryMutation.data.matches.map((match) => (
                 <Card key={match.id} className="border-l-4 border-primary/50">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <p className="text-sm font-medium leading-relaxed">{match.content}</p>
                        <div className="text-right flex flex-col items-end gap-1">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">Score</span>
                          <span className="font-mono text-sm">{(match.score * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Progress value={match.score * 100} className="h-1.5" />
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <Badge variant="secondary" className="text-[10px] py-0">{match.metadata.source}</Badge>
                        <Badge variant="secondary" className="text-[10px] py-0">{match.metadata.category}</Badge>
                      </div>
                    </CardContent>
                 </Card>
               ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center text-muted-foreground space-y-4 border rounded-xl bg-muted/20">
              <Info className="h-10 w-10 opacity-20" />
              <div className="max-w-xs mx-auto">
                <p className="font-medium text-foreground">Awaiting Query Input</p>
                <p className="text-xs mt-1">Configure parameters on the left and execute retrieval to view semantic forensic matches.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}