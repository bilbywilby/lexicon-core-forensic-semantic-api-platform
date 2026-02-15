import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Database, ShieldCheck, Zap, History, Cpu, Globe, Clock } from 'lucide-react';
import type { SystemMetrics } from '@shared/types';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
export function HomePage() {
  const queryClient = useQueryClient();
  const [cpVersion, setCpVersion] = useState<string>('');
  const { data: metrics } = useQuery<SystemMetrics>({
    queryKey: ['metrics'],
    queryFn: () => api<SystemMetrics>('/api/metrics'),
    refetchInterval: 3000,
  });
  const ingestMutation = useMutation({
    mutationFn: () => api('/api/v1/ingest', {
      method: 'POST',
      body: JSON.stringify({ content: "Automated probe memory", source: "dashboard-sim" })
    }),
    onSuccess: () => {
      toast.success("Simulation memory ingested");
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    }
  });
  const checkpointMutation = useMutation({
    mutationFn: (v: number) => api('/api/v1/checkpoint', {
      method: 'POST',
      body: JSON.stringify({ version: v })
    }),
    onSuccess: () => {
      toast.success("Manual checkpoint established");
      setCpVersion('');
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
  const chartData = metrics?.latency.map((l, i) => ({ time: i, ms: l })) || [];
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Intelligence Hub</h1>
          <div className="flex items-center gap-3">
            <p className="text-muted-foreground flex items-center gap-2 text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Node Operational — {metrics?.systemMetadata?.nodeId || 'ALPHA-1'}
            </p>
            {metrics?.do_sim && (
              <Badge variant="outline" className="text-[10px] font-mono bg-blue-500/10 text-blue-400 border-blue-500/20">
                SIMULATION MODE
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
           <Badge variant="outline" className="glass py-1 px-3 border-emerald-500/30 text-emerald-500 font-bold">
             SYSTEM ONLINE
           </Badge>
           <Button variant="outline" size="sm" className="glass h-8" onClick={() => queryClient.invalidateQueries()}>
             Refresh Pulse
           </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Memory Units", val: metrics?.memoryCount, icon: Database, color: "text-blue-500" },
          { label: "System Uptime", val: metrics?.uptime, icon: Clock, color: "text-purple-500" },
          { label: "Cache Hit", val: `${((metrics?.cacheHitRate || 0) * 100).toFixed(0)}%`, icon: Cpu, color: "text-orange-500" },
          { label: "Regional Node", val: metrics?.systemMetadata?.region || "GLOBAL", icon: Globe, color: "text-emerald-500" },
        ].map((item, idx) => (
          <Card key={idx} className="glass border-border/50 shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {item.label}
              </CardTitle>
              <item.icon className={cn("h-3.5 w-3.5", item.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums tracking-tight">{item.val ?? "---"}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-8 glass border-border/50 overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Inference Performance</CardTitle>
                <CardDescription>Real-time semantic retrieval latency (ms)</CardDescription>
              </div>
              <Badge variant="secondary" className="font-mono tabular-nums">avg: 48ms</Badge>
            </div>
          </CardHeader>
          <CardContent className="h-[350px] pl-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground) / 0.1)" />
                <XAxis dataKey="time" hide />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--primary))' }}
                  labelStyle={{ display: 'none' }}
                />
                <Line type="monotone" dataKey="ms" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <div className="lg:col-span-4 space-y-6">
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="text-sm">Control Operations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Versioned Checkpoint</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="V.Next"
                    className="h-8 glass font-mono text-xs"
                    value={cpVersion}
                    onChange={(e) => setCpVersion(e.target.value)}
                  />
                  <Button size="sm" className="h-8 gap-2 bg-primary/90" onClick={() => checkpointMutation.mutate(Number(cpVersion))}>
                    <ShieldCheck className="h-3.5 w-3.5" /> Commit
                  </Button>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full h-9 glass gap-2 border-primary/20 hover:border-primary/50"
                onClick={() => ingestMutation.mutate()}
                disabled={ingestMutation.isPending}
              >
                <Zap className="h-4 w-4 text-orange-400" />
                {ingestMutation.isPending ? "Injecting..." : "Ingest Probe Memory"}
              </Button>
            </CardContent>
          </Card>
          <Card className="glass border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 uppercase tracking-widest">
                <History className="h-4 w-4" /> System Audit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[220px] overflow-auto pr-2 custom-scrollbar">
                {metrics?.recentLogs.map((log) => (
                  <div key={log.id} className="flex gap-3 items-start border-l-2 border-border/30 pl-3 py-1 hover:bg-muted/5 transition-colors">
                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-medium leading-tight">{log.message}</p>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-[9px] px-1 rounded uppercase font-bold tracking-tighter",
                          log.type === 'ingest' ? "bg-blue-500/10 text-blue-400" : "bg-emerald-500/10 text-emerald-400"
                        )}>
                          {log.type}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {!metrics?.recentLogs.length && (
                  <p className="text-xs text-center py-10 text-muted-foreground">Monitoring data stream...</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}