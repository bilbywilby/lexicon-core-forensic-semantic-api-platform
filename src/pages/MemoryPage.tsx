import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Memory } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Search, Database } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
export function MemoryPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [source, setSource] = useState('');
  const { data: memories, isLoading } = useQuery<Memory[]>({
    queryKey: ['memories'],
    queryFn: () => api<Memory[]>('/api/memories'),
  });
  const createMutation = useMutation({
    mutationFn: (data: any) => api('/api/memories', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] });
      toast.success('Memory indexed successfully');
      setOpen(false);
      setContent('');
      setSource('');
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api(`/api/memories/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] });
      toast.info('Memory purged from bank');
    },
  });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Memory Bank</h1>
          <p className="text-muted-foreground">Manage semantic forensic records and vectors.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient gap-2">
              <Plus className="h-4 w-4" /> Ingest Memory
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Forensic Memory</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="content">Context Content</Label>
                <Textarea 
                  id="content" 
                  placeholder="Enter forensic data or system log..." 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Source Metadata</Label>
                <Input 
                  id="source" 
                  placeholder="e.g. syslog-alpha-01" 
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => createMutation.mutate({ content, metadata: { source, category: 'general', integrityHash: 'sha256-pending' } })}>
                Generate Vector & Index
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Content Fragment</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Vector Sig</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {memories?.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="max-w-md">
                  <p className="truncate text-sm font-medium">{m.content}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{m.metadata.source}</Badge>
                </TableCell>
                <TableCell>
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                    [{m.vector.slice(0, 3).map(v => v.toFixed(2)).join(', ')}...]
                  </code>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(m.timestamp).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => deleteMutation.mutate(m.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!memories?.length && !isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No forensic memories found. Start by ingesting data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}