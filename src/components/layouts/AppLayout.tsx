import { Outlet } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Activity, BookOpen, Dumbbell, MessageSquare, LayoutDashboard, Users, UserCheck, LogOut, Leaf } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function AppLayout() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const userMenuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, url: '/dashboard' },
    { title: 'Health Assessment', icon: Activity, url: '/assessment' },
    { title: 'Diet Plan', icon: BookOpen, url: '/diet' },
    { title: 'Exercise & Dinacharya', icon: Dumbbell, url: '/exercise' },
    { title: 'AI Assistant', icon: MessageSquare, url: '/chat' },
  ];

  const doctorMenuItems = [
    { title: 'Doctor Dashboard', icon: LayoutDashboard, url: '/doctor/dashboard' },
    { title: 'Patients', icon: Users, url: '/doctor/patients' },
    { title: 'Assessments', icon: Activity, url: '/doctor/assessments' },
    { title: 'Messages', icon: MessageSquare, url: '/doctor/messages' },
  ];

  const adminMenuItems = [
    { title: 'Admin Dashboard', icon: LayoutDashboard, url: '/admin/dashboard' },
    { title: 'Doctor Approvals', icon: UserCheck, url: '/admin/doctors' },
    { title: 'User Management', icon: Users, url: '/admin/users' },
  ];

  const menuItems = profile?.role === 'doctor' 
    ? doctorMenuItems 
    : profile?.role === 'admin'
    ? adminMenuItems
    : userMenuItems;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="hidden lg:block">
          <SidebarContent>
            <div className="flex items-center gap-2 px-4 py-6">
              <Leaf className="h-8 w-8 text-primary" />
              <div>
                <h2 className="text-lg font-semibold text-foreground">Ayurvedic</h2>
                <p className="text-xs text-muted-foreground">Health Advisor</p>
              </div>
            </div>
            
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="mt-auto p-4">
              <div className="mb-3 rounded-lg bg-accent p-3">
                <p className="text-sm font-medium text-accent-foreground">
                  {profile?.full_name || profile?.email || 'User'}
                </p>
                <p className="text-xs text-muted-foreground capitalize">{profile?.role}</p>
              </div>
              <Button variant="outline" className="w-full" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
            <SidebarTrigger className="lg:hidden" />
            <div className="flex-1" />
          </header>

          <main className="flex-1 p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
