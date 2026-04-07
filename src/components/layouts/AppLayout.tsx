import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Activity, BookOpen, Dumbbell, MessageSquare,
  LayoutDashboard, Users, UserCheck, LogOut, Leaf, ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type MenuItem = { title: string; icon: React.ElementType; url: string };

const PRIMARY = 'hsl(var(--primary))';
const PRIMARY_DIM = 'hsl(var(--primary) / 0.7)';
const BG = 'hsl(var(--sidebar-background))';
const CARD = 'hsl(var(--card))';
const BORDER = 'hsl(var(--sidebar-border))';
const TEXT = 'hsl(var(--foreground))';
const TEXT_MUTED = 'hsl(var(--muted-foreground))';

function NavItem({ item, active, onClick }: { item: MenuItem; active: boolean; onClick: () => void }) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
      style={{
        background: active ? 'hsl(var(--primary) / 0.15)' : 'transparent',
        border: active ? `1px solid hsl(var(--primary) / 0.3)` : '1px solid transparent',
        color: active ? PRIMARY : TEXT_MUTED,
        boxShadow: active ? `0 0 12px hsl(var(--primary) / 0.15)` : 'none',
      }}
      onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.background = 'hsl(var(--sidebar-accent))'; (e.currentTarget as HTMLButtonElement).style.color = TEXT; } }}
      onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = TEXT_MUTED; } }}
    >
      <span className="p-1.5 rounded-lg transition-all duration-200"
            style={{ background: active ? 'hsl(var(--primary) / 0.2)' : 'hsl(var(--card))', color: active ? PRIMARY : TEXT_MUTED }}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex-1 text-left">{item.title}</span>
      {active && <ChevronRight className="h-3 w-3" style={{ color: PRIMARY_DIM }} />}
    </button>
  );
}

export function AppLayout() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const userMenuItems: MenuItem[] = [
    { title: 'Dashboard',             icon: LayoutDashboard, url: '/dashboard' },
    { title: 'Health Assessment',     icon: Activity,        url: '/assessment' },
    { title: 'Diet Plan',             icon: BookOpen,        url: '/diet' },
    { title: 'Exercise & Dinacharya', icon: Dumbbell,        url: '/exercise' },
    { title: 'AI Assistant',          icon: MessageSquare,   url: '/chat' },
  ];

  const doctorMenuItems: MenuItem[] = [
    { title: 'Doctor Dashboard', icon: LayoutDashboard, url: '/doctor/dashboard' },
    { title: 'Patients',         icon: Users,           url: '/doctor/patients' },
    { title: 'Assessments',      icon: Activity,        url: '/doctor/assessments' },
    { title: 'Messages',         icon: MessageSquare,   url: '/doctor/messages' },
  ];

  const adminMenuItems: MenuItem[] = [
    { title: 'Admin Dashboard',  icon: LayoutDashboard, url: '/admin/dashboard' },
    { title: 'Doctor Approvals', icon: UserCheck,       url: '/admin/doctors' },
    { title: 'User Management',  icon: Users,           url: '/admin/users' },
  ];

  const menuItems = profile?.role === 'doctor'
    ? doctorMenuItems
    : profile?.role === 'admin'
    ? adminMenuItems
    : userMenuItems;

  const initials = (profile?.full_name || profile?.email || 'U')
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex min-h-screen w-full" style={{ background: 'hsl(var(--background))' }}>
      {/* ── Sidebar ── */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 left-0 z-20"
             style={{ background: `${BG}`, borderRight: `1px solid ${BORDER}` }}>
        {/* Gradient top accent */}
        <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${PRIMARY}, hsl(var(--accent)))` }} />

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div className="h-10 w-10 rounded-xl flex items-center justify-center lush-glow"
               style={{ background: 'hsl(var(--primary) / 0.1)', border: '1.5px solid hsl(var(--primary) / 0.3)' }}>
            <Leaf className="h-5 w-5" style={{ color: PRIMARY }} />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Ayur<span style={{ color: PRIMARY }}>veda</span>
            </p>
            <p className="text-[9px] uppercase tracking-widest" style={{ color: TEXT_MUTED }}>Health Advisor</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto relative z-10">
          <p className="px-3 mb-2 text-[9px] font-bold uppercase tracking-[0.12em]" style={{ color: TEXT_MUTED }}>Navigation</p>
          {menuItems.map(item => (
            <NavItem
              key={item.url}
              item={item}
              active={location.pathname === item.url || location.pathname.startsWith(item.url + '/')}
              onClick={() => navigate(item.url)}
            />
          ))}
        </nav>

        {/* User card */}
        <div className="p-3" style={{ borderTop: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-3 p-3 rounded-xl mb-2"
               style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
                 style={{ background: 'hsl(var(--primary) / 0.15)', border: `1px solid hsl(var(--primary) / 0.3)` }}>
              <span className="text-xs font-bold" style={{ color: PRIMARY }}>{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: TEXT }}>
                {profile?.full_name || profile?.email || 'User'}
              </p>
              <p className="text-[9px] capitalize" style={{ color: TEXT_MUTED }}>{profile?.role || 'patient'}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all duration-200"
            style={{ color: 'hsl(var(--heritage-red))', background: 'transparent', border: '1px solid transparent' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'hsl(var(--heritage-red) / 0.12)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'hsl(var(--heritage-red) / 0.3)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent'; }}
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Mobile bar ── */}
      <header className="md:hidden fixed top-0 inset-x-0 z-20 h-14 flex items-center px-4 gap-3"
              style={{ background: `hsl(var(--background) / 0.9)`, borderBottom: `1px solid ${BORDER}`, backdropFilter: 'blur(16px)' }}>
        <div className="h-0.5 absolute top-0 inset-x-0" style={{ background: `linear-gradient(90deg, ${PRIMARY}, hsl(var(--accent)))` }} />
        <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: 'hsl(var(--primary) / 0.1)', border: `1px solid hsl(var(--primary) / 0.3)` }}>
          <Leaf className="h-4 w-4" style={{ color: PRIMARY }} />
        </div>
        <span className="font-bold text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Ayur<span style={{ color: PRIMARY }}>veda</span>
        </span>
        <div className="flex-1" />
        <div className="flex items-center gap-0.5">
          {menuItems.slice(0, 5).map(item => {
            const Icon = item.icon;
            const active = location.pathname === item.url || location.pathname.startsWith(item.url + '/');
            return (
              <button key={item.url} onClick={() => navigate(item.url)}
                      className="p-2 rounded-lg transition-all duration-200"
                      style={{ background: active ? 'hsl(var(--primary) / 0.15)' : 'transparent', color: active ? PRIMARY : TEXT_MUTED }}>
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      </header>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col md:ml-64 relative z-10">
        <main className="flex-1 p-4 md:p-6 mt-14 md:mt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
