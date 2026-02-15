import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Database, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import type { SystemMetrics } from '@shared/types';
import { formatDistanceToNow } from 'date-fns';
export function HomePage() {
  const { data: metrics, isLoading } = useQuery<SystemMetrics>({
    queryKey: ['metrics'],
    queryFn: () => api<SystemMetrics>('/api/metrics'),
    refetchInterval: 5000,
  });
  const chartData = metrics?.latency.map((l, i) => ({ time: i, ms: l })) || [];
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Command Dashboard</h1>
        <p className="text-muted-foreground">Forensic semantic platform intelligence and health.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">OPERATIONAL</div>
            <p className="text-xs text-muted-foreground">Uptime: {metrics?.uptime}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Memories</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.memoryCount ?? 0}</div>
            <p className="text-xs text-muted-foreground">Distributed Vector Store</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(metrics?.cacheHitRate ?? 0) * 100}%</div>
            <div className="mt-2 h-1 w-full bg-secondary overflow-hidden rounded-full">
               <div className="h-full bg-primary" style={{ width: `${(metrics?.cacheHitRate ?? 0) * 100}%` }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Last Checkpoint</CardTitle>
            <ShieldCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xs font-mono truncate">{metrics?.lastCheckpoint?.hash.slice(0, 16)}...</div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics?.lastCheckpoint ? formatDistanceToNow(metrics.lastCheckpoint.timestamp) + ' ago' : 'Never'}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Inference Latency</CardTitle>
            <CardDescription>Real-time semantic retrieval performance (ms)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="time" hide />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                  labelStyle={{ display: 'none' }}
                />
                <Line type="monotone" dataKey="ms" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>System Log</CardTitle>
            <CardDescription>Recent forensic audit trail</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                  <div className="flex-1 space-y-1">
                    <p className="text-xs font-medium leading-none">
                      {i % 2 === 0 ? "Memory Ingested" : "Snapshot Verified"}
                    </p>
                    <p className="text-2xs text-muted-foreground">
                      Node edge-alpha reported success for block {400 + i}
                    </p>
                  </div>
                  <div className="text-2xs text-muted-foreground tabular-nums">1{i}m ago</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}