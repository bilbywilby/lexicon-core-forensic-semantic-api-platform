import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, MessageSquare, Trash2, Send } from "lucide-react";
import type { User, Chat, ChatMessage, ApiResponse } from "@shared/types";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
export function TemplateDemo() {
  const [users, setUsers] = useState<User[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newMsg, setNewMsg] = useState("");
  const fetchData = async () => {
    setLoading(true);
    try {
      const u = await api<User[]>("/api/users");
      const c = await api<Chat[]>("/api/chats");
      setUsers(u);
      setChats(c);
    } catch (err) {
      toast.error("Failed to load demo data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const createUser = async () => {
    if (!newUserName.trim()) return;
    try {
      await api("/api/users", { method: "POST", body: JSON.stringify({ name: newUserName }) });
      setNewUserName("");
      fetchData();
      toast.success("User created");
    } catch (err) {
      toast.error("Create failed");
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            System Compatibility Demo
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users">
            <TabsList>
              <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
              <TabsTrigger value="chats">Chats ({chats.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="users" className="space-y-4 pt-4">
              <div className="flex gap-2">
                <Input value={newUserName} onChange={e => setNewUserName(e.target.value)} placeholder="User name..." />
                <Button onClick={createUser}>Add User</Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {users.map(u => (
                  <div key={u.id} className="p-2 border rounded bg-muted/50 text-sm">
                    {u.name} <span className="text-[10px] text-muted-foreground">({u.id.slice(0, 8)})</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="chats" className="pt-4">
               <p className="text-sm text-muted-foreground">Chat types synchronized. Logic integrated with core system.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}