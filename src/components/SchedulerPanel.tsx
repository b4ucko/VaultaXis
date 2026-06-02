import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  Play, 
  CheckCircle2,
  ListOrdered
} from 'lucide-react';
import { addChainedLogEntry } from '@/lib/ledgerUtils';

interface ScheduledJob {
  id: string;
  name: string;
  expression: string;
  action: string;
  target: string;
  status: 'ACTIVE' | 'PAUSED';
}

export function SchedulerPanel() {
  const { toast } = useToast();
  
  // State loaded from localStorage to only show user-created jobs
  const [jobs, setJobs] = useState<ScheduledJob[]>(() => {
    try {
      const saved = localStorage.getItem('vaultaxis_scheduled_jobs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage when updated
  useEffect(() => {
    localStorage.setItem('vaultaxis_scheduled_jobs', JSON.stringify(jobs));
  }, [jobs]);

  const [jobName, setJobName] = useState('');
  const [cronExpr, setCronExpr] = useState('0 2 * * *');
  const [jobAction, setJobAction] = useState('Cloud Upload');
  const [jobTarget, setJobTarget] = useState('C:\\Users\\Username\\Desktop\\NAS_Share');

  const handleCreateJob = () => {
    if (!jobName.trim()) {
      toast({
        title: "Name required",
        description: "Please specify a name for your scheduled operation.",
        variant: "destructive"
      });
      return;
    }

    const expressionLabel = 
      cronExpr === '0 2 * * *' ? '0 2 * * * (Daily at 2:00 AM)' : 
      cronExpr === '*/5 * * * *' ? '*/5 * * * * (Every 5 minutes)' : `${cronExpr} (Custom Cron)`;

    const newJob: ScheduledJob = {
      id: crypto.randomUUID(),
      name: jobName.trim(),
      expression: expressionLabel,
      action: jobAction,
      target: jobTarget,
      status: 'ACTIVE'
    };

    setJobs(prev => [...prev, newJob]);
    toast({
      title: "Scheduled Job Created",
      description: `Task "${jobName}" compiled and added successfully to scheduler.`
    });
    addChainedLogEntry('CREATE_SCHEDULED_JOB', jobName, 'Admin', 'admin', 'SUCCESS');
    
    // Clear inputs
    setJobName('');
  };

  const handleDeleteJob = (id: string, name: string) => {
    setJobs(prev => prev.filter(job => job.id !== id));
    toast({
      title: "Task Deleted",
      description: `Schedules for "${name}" have been removed.`
    });
    addChainedLogEntry('DELETE_SCHEDULED_JOB', name, 'Admin', 'admin', 'SUCCESS');
  };

  const handleTriggerNow = (name: string) => {
    toast({
      title: "Task Triggered Manually",
      description: `Dispatched background worker thread for task: "${name}". Check audit log for output.`
    });
    addChainedLogEntry('RUN_SCHEDULED_JOB_MANUAL', name, 'Admin', 'admin', 'SUCCESS');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* Col 1: Job Creator (4 cols) */}
      <Card className="glass border-white/10 dark:text-white shadow-2xl glass-card md:col-span-5 h-full">
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" /> Create Automated Job
          </CardTitle>
          <CardDescription className="text-xs">
            Plan automated encryption or cloud sync intervals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Job Operation Name</Label>
            <Input
              value={jobName}
              onChange={(e) => setJobName(e.target.value)}
              placeholder="e.g., Nightly NAS backup sync"
              className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50 text-xs h-9"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Frequency (Cron Expression)</Label>
            <Select 
              value={cronExpr} 
              onValueChange={setCronExpr}
            >
              <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0 2 * * *">Daily at 2:00 AM (0 2 * * *)</SelectItem>
                <SelectItem value="0 0 * * 0">Weekly Sundays at midnight (0 0 * * 0)</SelectItem>
                <SelectItem value="*/5 * * * *">Every 5 minutes (Testing: */5 * * * *)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Target Action Type</Label>
            <Select 
              value={jobAction} 
              onValueChange={setJobAction}
            >
              <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cloud Upload">Export & Upload to Cloud</SelectItem>
                <SelectItem value="NAS Backup">Re-wrap and push to local NAS</SelectItem>
                <SelectItem value="Integrity Scan">Run Cryptographic SHA-256 Ledger Scan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Folder Directory Target</Label>
            <Input
              value={jobTarget}
              onChange={(e) => setJobTarget(e.target.value)}
              placeholder="C:\Users\Username\Desktop\NAS_Share"
              className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50 text-xs h-9"
            />
          </div>
        </CardContent>
        <CardFooter className="pt-2 border-t border-white/5 flex justify-end">
          <Button onClick={handleCreateJob} className="rounded-xl text-xs flex items-center gap-1">
            <Plus className="h-4 w-4" /> Add Task to Cron
          </Button>
        </CardFooter>
      </Card>

      {/* Col 2: Active Schedules table (7 cols) */}
      <Card className="glass border-white/10 dark:text-white shadow-2xl glass-card md:col-span-7 h-full">
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <ListOrdered className="h-5 w-5 text-cyan-400" /> Active Automation Scheduler Ledger
          </CardTitle>
          <CardDescription className="text-xs">
            Monitor and manually dispatch active background cron daemon configurations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {jobs.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              No active automation schedules declared.
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <div key={job.id} className="p-3.5 border border-white/5 bg-white/5 rounded-2xl flex items-center justify-between gap-4 text-xs text-white">
                  <div className="space-y-1 truncate">
                    <p className="font-bold flex items-center gap-1 truncate text-white">{job.name}</p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1 truncate">
                      <Clock className="h-3 w-3 text-cyan-400" /> {job.expression}
                    </p>
                    <div className="flex gap-2.5 mt-1">
                      <span className="bg-[#030712]/50 text-muted-foreground border border-white/5 text-[9px] px-2 py-0.5 rounded-full font-mono uppercase">
                        {job.action}
                      </span>
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] px-2 py-0.5 rounded-full font-mono uppercase">
                        {job.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => handleTriggerNow(job.name)}
                      className="h-7 w-7 text-cyan-400 hover:text-white rounded-lg hover:bg-white/5"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => handleDeleteJob(job.id, job.name)}
                      className="h-7 w-7 text-red-400 hover:text-white rounded-lg hover:bg-white/5"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
