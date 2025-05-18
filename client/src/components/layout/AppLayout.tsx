
import React from 'react';
import { Outlet } from 'react-router-dom';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Users, Package, List, Menu } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarTrigger, useSidebar, SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from '@/hooks/use-mobile';

const AppLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isMobile = useIsMobile();
  
  // Always start collapsed on mobile
  const [collapsed, setCollapsed] = React.useState(isMobile);

  React.useEffect(() => {
    // Update collapsed state when screen size changes
    setCollapsed(isMobile);
  }, [isMobile]);

  const navigationItems = [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "Partners", url: "/partners", icon: Users },
    { title: "Orders", url: "/orders", icon: Package },
    { title: "Assignments", url: "/assignments", icon: List },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  const isExpanded = navigationItems.some((i) => isActive(i.url));
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-muted text-primary font-medium w-full flex items-center p-2 rounded-md" : 
              "hover:bg-muted/50 w-full flex items-center p-2 rounded-md";

  return (
    <div className="flex min-h-screen w-full bg-background">
      <SidebarProvider 
        collapsedWidth={isMobile ? 0 : 56} 
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      >
        <Sidebar 
          className={isMobile && collapsed ? "w-0 transition-all duration-200" : 
                   !isMobile && collapsed ? "w-14 transition-all duration-200" : 
                   "w-60 transition-all duration-200"}
          collapsible
        >
          <div className="flex justify-between items-center pr-2">
            <div className="px-3 py-4">
              <h2 className="font-bold text-primary text-xl">
                {!collapsed && "Delivery System"}
                {collapsed && !isMobile && <Package className="h-5 w-5" />}
              </h2>
            </div>
            {!isMobile && <SidebarTrigger className="self-end" />}
          </div>

          <SidebarContent>
            <SidebarGroup open={isExpanded}>
              <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <NavLink to={item.url} end={item.url === '/'} className={getNavCls}>
                        <item.icon className="mr-2 h-4 w-4" />
                        {!collapsed && (
                          <span className="transition-opacity duration-200">
                            {item.title}
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {isMobile && (
            <div className="border-b bg-background sticky top-0 z-10">
              <div className="flex items-center p-2">
                <SidebarTrigger className="mr-2">
                  <Menu className="h-5 w-5" />
                </SidebarTrigger>
                <h2 className="text-lg font-semibold">Delivery System</h2>
              </div>
            </div>
          )}
          <div className="container mx-auto px-2 sm:px-4 py-4 md:py-6 max-w-full">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
};

export default AppLayout;
