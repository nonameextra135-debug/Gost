import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Settings, 
  Lock, 
  Shield, 
  LayoutDashboard, 
  History, 
  Video, 
  Bell, 
  Eye, 
  EyeOff, 
  Search, 
  Plus, 
  User, 
  Clock, 
  MoreVertical,
  Star,
  Download,
  Share2,
  Trash2,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// --- Types ---
type AppMode = 'sheets' | 'dashboard';

// --- Components ---

const SheetsDecoy = ({ onSecretCode }: { onSecretCode: () => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val === '9876') { // THE SECRET CODE entered in search
      setTimeout(() => {
        onSecretCode();
      }, 500);
    }
  };

  const recentFiles = [
    { title: 'Budget 2026', edited: 'Edited 2h ago', owner: 'Me', starred: true },
    { title: 'Project Timeline', edited: 'Edited Yesterday', owner: 'Work Group', starred: false },
    { title: 'Weekly Expenses', edited: 'Edited 3d ago', owner: 'Me', starred: false },
    { title: 'Contact List', edited: 'Edited Feb 12', owner: 'Me', starred: true },
    { title: 'Event Planning', edited: 'Edited Jan 04', owner: 'Collaborator', starred: false },
  ];

  return (
    <div className="flex flex-col h-full bg-white text-slate-800 font-sans select-none">
      {/* Search Bar Decoration */}
      <div className="p-4 pt-12 pb-2">
        <div className="bg-slate-100 rounded-full py-3 px-4 flex items-center gap-3 shadow-sm border border-slate-200/50">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search in Sheets" 
            value={searchQuery}
            onChange={handleSearch}
            className="bg-transparent border-none outline-none flex-1 text-slate-600 placeholder:text-slate-400"
          />
          <User className="w-8 h-8 p-1.5 bg-green-600 text-white rounded-full shadow-inner" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-slate-500 mb-4 px-1 uppercase tracking-wider">Earlier this week</h2>
          <div className="space-y-4">
            {recentFiles.map((file, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 group active:bg-slate-50 p-1 rounded-xl transition-colors"
                onClick={() => {
                  if (file.title === 'Weekly Expenses') {
                    // Alternative secret trigger: Clicking specific file 3 times? 
                    // Let's stick to the search code for reliability.
                  }
                }}
              >
                <div className="p-3 bg-green-50 text-green-600 rounded-lg shadow-sm">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-900">{file.title}</p>
                    {file.starred && <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />}
                  </div>
                  <p className="text-xs text-slate-400">{file.edited} • {file.owner}</p>
                </div>
                <button className="p-2 text-slate-300 hover:text-slate-500">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Suggestion Section */}
        <div className="bg-green-50/30 rounded-3xl p-6 border border-green-100/50">
           <div className="flex items-center gap-2 mb-2">
             <FileSpreadsheet className="w-5 h-5 text-green-600" />
             <span className="text-xs font-bold text-green-700 uppercase tracking-widest">New template</span>
           </div>
           <h3 className="text-lg font-bold text-slate-800 mb-2">Build your 2026 Roadmap</h3>
           <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">Organize projects, milestones, and deadlines in a professional timeline view.</p>
           <button className="px-6 py-2 bg-green-600 text-white rounded-full text-sm font-bold shadow-lg shadow-green-900/10">Try Roadmap</button>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-6">
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-slate-100 group"
        >
          <div className="absolute inset-0 bg-green-50 opacity-0 group-active:opacity-100 rounded-2xl transition-opacity" />
          <Plus className="w-8 h-8 text-green-600 relative z-10" strokeWidth={3} />
        </motion.button>
      </div>

      <div className="p-4 border-t border-slate-100 flex items-center justify-around text-slate-400 bg-white">
        <div className="flex flex-col items-center gap-1 text-green-600">
          <FileText className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Recent</span>
        </div>
        <div className="flex flex-col items-center gap-1 opacity-50">
          <Star className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Starred</span>
        </div>
        <div className="flex flex-col items-center gap-1 opacity-50">
          <Share2 className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Shared</span>
        </div>
        <div className="flex flex-col items-center gap-1 opacity-50">
          <Download className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Offline</span>
        </div>
      </div>
    </div>
  );
};

const ParentDashboard = ({ onClose }: { onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'recordings' | 'settings'>('overview');
  const [activities, setActivities] = useState<any[]>([]);
  const [recordings, setRecordings] = useState<any[]>([]);
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    fetch('/api/activity').then(res => res.json()).then(setActivities);
    fetch('/api/recordings').then(res => res.json()).then(setRecordings);
    fetch('/api/status').then(res => res.json()).then(setStatus);
  }, []);

  const chartData = [
    { time: '08:00', usage: 10 },
    { time: '09:00', usage: 45 },
    { time: '10:00', usage: 30 },
    { time: '11:00', usage: 80 },
    { time: '12:00', usage: 60 },
    { time: '13:00', usage: 20 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col lg:flex-row">
      {/* Sidebar */}
      <nav className="w-full lg:w-64 bg-slate-900 text-white p-6 flex flex-col border-r border-slate-800">
        <div className="flex items-center gap-3 mb-12">
          <div className="p-2 bg-indigo-500 rounded-xl">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">GuardianPanel</h1>
        </div>

        <div className="space-y-2 flex-1">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('recordings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'recordings' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <Video className="w-5 h-5" />
            <span>Recordings</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>

        <button 
          onClick={onClose}
          className="mt-auto flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors border-t border-slate-800 pt-6"
        >
          <EyeOff className="w-5 h-5" />
          <span>Hide Dashboard</span>
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <header className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900">Activity Overview</h2>
                  <p className="text-slate-500">Real-time device monitoring for Device ID: SM-G991B</p>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    LIVE Recording
                  </div>
                </div>
              </header>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <History className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Screen Time</p>
                    <p className="text-2xl font-bold">4h 12m</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                    <Video className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Sync Logs</p>
                    <p className="text-2xl font-bold">48 Received</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                    <Bell className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Alerts</p>
                    <p className="text-2xl font-bold">0 Active</p>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold mb-6">Device Activity Intensity</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                      />
                      <Area type="monotone" dataKey="usage" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorUsage)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Events */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-bottom border-slate-50 flex justify-between items-center">
                  <h3 className="text-lg font-bold">Recent Activities</h3>
                  <button className="text-indigo-600 text-sm font-semibold">View All Logs</button>
                </div>
                <div className="divide-y divide-slate-50">
                  {activities.map((act) => (
                    <div key={act.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-xl ${act.type === 'app_launch' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                          {act.type === 'app_launch' ? <LayoutDashboard className="w-5 h-5" /> : <History className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-semibold">{act.detail}</p>
                          <p className="text-xs text-slate-400 capitalize">{act.type.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500 font-mono">{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        <p className="text-[10px] text-slate-300 font-mono uppercase">Sync Verified</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'recordings' && (
            <motion.div 
              key="recordings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <header>
                <h2 className="text-3xl font-bold tracking-tight">Screen Archive</h2>
                <p className="text-slate-500">30-minute screen recording deliveries from remote device.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {recordings.map((rec) => (
                  <div key={rec.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm group overflow-hidden">
                    <div className="aspect-video bg-slate-900 flex items-center justify-center relative">
                       <Video className="w-12 h-12 text-slate-700 group-hover:scale-110 transition-transform" />
                       <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-2">
                         <a 
                           href={`/api/recordings/files/${rec.name}`} 
                           target="_blank" 
                           rel="noreferrer"
                           className="px-4 py-2 bg-white text-indigo-600 rounded-full font-bold shadow-xl text-sm"
                         >
                           View
                         </a>
                         <a 
                           href={`/api/recordings/files/${rec.name}`} 
                           download
                           className="px-4 py-2 bg-indigo-600 text-white rounded-full font-bold shadow-xl text-sm"
                         >
                           Download
                         </a>
                       </div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold">{rec.name}</h4>
                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-mono">{rec.size}</span>
                      </div>
                      <p className="text-sm text-slate-500 font-mono">{rec.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl space-y-10"
            >
              <header>
                <h2 className="text-3xl font-bold tracking-tight">Stealth Configuration</h2>
                <p className="text-slate-500">Customize how the app disguises itself on the child's phone.</p>
              </header>

              <div className="space-y-6">
                <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-indigo-500" />
                    App Appearance
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Display Name</label>
                      <input 
                        type="text" 
                        defaultValue="Sheets" 
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Icon Theme</label>
                      <div className="grid grid-cols-4 gap-4">
                        {['Sheets', 'Drive', 'Docs', 'Calculator'].map((icon) => (
                           <button key={icon} className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 ${icon === 'Sheets' ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200'}`}>
                             <div className={`w-10 h-10 rounded-xl ${icon === 'Sheets' ? 'bg-green-500' : 'bg-slate-200'}`} />
                             <span className="text-[10px] font-bold uppercase">{icon}</span>
                           </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-indigo-500" />
                    Security Key
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">The code required in the Sheets search bar to open this dashboard.</p>
                  <input 
                    type="password" 
                    defaultValue="9876" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono"
                  />
                </section>

                <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <LayoutDashboard className="w-5 h-5 text-indigo-500" />
                    Internal Actions
                  </h3>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={() => {
                          fetch('/api/upload', { method: 'POST' });
                          alert('Simulation: 30-minute screen recording delivered to server.');
                        }}
                        className="w-full py-4 bg-indigo-500 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Video className="w-5 h-5" />
                        Test: Trigger 30m Delivery
                      </button>
                      <button 
                         className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                      >
                        <Shield className="w-5 h-5" />
                        Export Android Source Code
                      </button>
                      <p className="text-[10px] text-slate-400 italic text-center">
                        Requires Android Studio to build the final APK from provided source.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default function GuardianApp() {
  const [mode, setMode] = useState<AppMode>('sheets');
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="h-screen w-screen bg-white flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-20 h-20 bg-green-500 rounded-3xl flex items-center justify-center shadow-xl shadow-green-100">
            <FileSpreadsheet className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-slate-800 text-2xl font-bold tracking-tight">Sheets</h1>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-slate-50 overflow-hidden relative">
      <AnimatePresence mode="wait">
        {mode === 'sheets' ? (
          <motion.div 
            key="sheets"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ scale: 1.05, opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.4 }}
            className="h-full w-full max-w-md mx-auto relative shadow-2xl"
          >
            <SheetsDecoy onSecretCode={() => setMode('dashboard')} />
          </motion.div>
        ) : (
          <motion.div 
            key="dashboard"
            initial={{ scale: 0.9, opacity: 0, filter: 'blur(20px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="h-full w-full"
          >
            <ParentDashboard onClose={() => setMode('sheets')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
