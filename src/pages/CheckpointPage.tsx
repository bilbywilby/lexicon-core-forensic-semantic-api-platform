import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Checkpoint } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, RefreshCw, AlertCircle, History } from 'lucide-react';
import { toast } from 'sonner';
export function CheckpointPage() {
  const queryClient = useQueryClient();
  const { data: checkpoints, isLoading } = useQuery<Checkpoint[]>({
    queryKey: ['checkpoints'],
    queryFn: () => api<Checkpoint[]>('/api/checkpoints'),
  });
  const checkpointMutation = useMutation({
    mutationFn: () => api('/api/checkpoints', { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checkpoints'] });
      toast.success('Manual checkpoint established');
    },
  });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Checkpoint Registry</h1>
          <p className="text-muted-foreground">Immutable audit logs and system state snapshots.</p>
        </div>
        <Button onClick={() => checkpointMutation.mutate()} disabled={checkpointMutation.isPending} className="gap-2">
          <ShieldCheck className="h-4 w-4" /> Create Snapshot
        </Button>
      </div>
      <div className="grid gap-6">
        {checkpoints?.sort((a, b) => b.timestamp - a.timestamp).map((cp) => (
          <Card key={cp.id} className="relative overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${cp.status === 'verified' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <CardContent className="flex items-center gap-6 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <History className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-mono text-sm font-bold tracking-tight uppercase">
                    BLOCK {cp.id.split('-')[0]}
                  </h3>
                  <Badge variant={cp.status === 'verified' ? 'default' : 'secondary'} className={cp.status === 'verified' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                    {cp.status.toUpperCase()}
                  </Badge>
                </div>
                <p className="font-mono text-xs text-muted-foreground">{cp.hash}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1"><RefreshCw className="h-3 w-3" /> {cp.trigger}</span>
                  <span>{new Date(cp.timestamp).toLocaleString()}</span>
                </div>
              </div>
              <Button variant="outline" size="sm">Audit Details</Button>
            </CardContent>
          </Card>
        ))}
        {!checkpoints?.length && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border-2 border-dashed rounded-xl">
             <AlertCircle className="h-10 w-10 text-muted-foreground/50" />
             <div className="space-y-1">
               <h3 className="font-medium">No checkpoints exist</h3>
               <p className="text-sm text-muted-foreground">Establish your first forensic checkpoint to begin auditing.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}