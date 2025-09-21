import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Tags, 
  Code, 
  Store, 
  RotateCcw,
  LogOut,
  Settings 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminLayoutProps {
  children: React.ReactNode;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  onLogout?: () => void;
}

const menuItems = [
  {
    title: "Produtos",
    id: "products",
    icon: Package,
  },
  {
    title: "Categorias", 
    id: "categories",
    icon: Tags,
  },
  {
    title: "Loja",
    id: "store",
    icon: Store,
  },
  {
    title: "Código do Site",
    id: "code",
    icon: Code,
  },
  {
    title: "Configurações",
    id: "settings",
    icon: Settings,
  }
];

export default function AdminLayout({ 
  children, 
  activeSection = "products",
  onSectionChange,
  onLogout 
}: AdminLayoutProps) {
  const { toast } = useToast();

  const handleRestart = () => {
    toast({
      title: "Reiniciando site...",
      description: "O site será reiniciado em alguns segundos.",
    });
    // In a real app, this would trigger a server restart
    console.log("Site restart triggered");
  };

  const handleLogout = () => {
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
    onLogout?.();
  };

  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-lg font-bold text-primary">
                Corsinha Store
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        asChild
                        data-testid={`link-${item.id}`}
                        isActive={activeSection === item.id}
                      >
                        <button
                          onClick={() => onSectionChange?.(item.id)}
                          className="flex items-center gap-2 w-full"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Ações do Sistema</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <button
                        onClick={handleRestart}
                        data-testid="button-restart"
                        className="flex items-center gap-2 w-full text-orange-600 hover:text-orange-700"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span>Reiniciar Site</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <button
                        onClick={handleLogout}
                        data-testid="button-logout"
                        className="flex items-center gap-2 w-full text-destructive hover:text-destructive/80"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sair</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="text-sm text-muted-foreground">
              Bem-vindo, Administrador
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}