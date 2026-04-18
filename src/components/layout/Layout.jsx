import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Factory,
  ArrowRightLeft,
  History,
  BellRing,
  Users,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  Tags,
  Layers
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

const navItems = [
  { title: "Tableau de bord", path: "/", icon: LayoutDashboard },
  { title: "Produits", path: "/produits", icon: Package },
  { title: "Catégories", path: "/categories", icon: Tags },
  { title: "Entrepôts", path: "/entrepot", icon: Factory },
  { title: "Stocks", path: "/stocks", icon: Layers },
  { title: "Mouvements", path: "/mouvements", icon: ArrowRightLeft },
  { title: "Traçabilité", path: "/tracabilite", icon: History },
  { title: "Alertes", path: "/alertes", icon: BellRing },
  { title: "Agents", path: "/agents", icon: Users },
  { title: "Paramètres", path: "/parametres", icon: Settings },
];

export function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-64 transform bg-card border-r transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:block",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b">
          <div className="flex items-center gap-2 font-bold text-xl text-primary tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              <Package size={20} />
            </div>
            StockMaster
          </div>
          <button className="lg:hidden text-foreground/50 hover:text-foreground" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="px-4 py-6 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="mb-4 px-2 text-xs font-semibold text-foreground/50 uppercase tracking-wider">
            Menu Principal
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-surface hover:text-foreground/90"
                )}
              >
                <Icon size={18} className={cn(isActive ? "text-primary" : "text-foreground/70")} />
                {item.title}
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}

export function Topbar({ onMenuClick }) {
  const location = useLocation();
  const currentTitle = navItems.find((item) => item.path === location.pathname)?.title || "Page";

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: "Alerte: Niveau Élevé", message: "Rupture de stock imminente : Imprimante Laser", date: "Il y a 5 min", read: false, path: "/alertes" },
    { id: 2, type: "Alerte: Capacité", message: "Capacité entrepôt atteinte : Entrepôt Rabat", date: "Il y a 1h", read: false, path: "/alertes" }
  ]);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
    // Marquer comme lu automatiquement lors du clic
    if(unreadCount > 0 && !showNotifications) {
       setNotifications(notifications.map(n => ({ ...n, read: true })));
    }
  };

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-4 lg:px-8 z-30 sticky top-0">
      <div className="flex items-center gap-4">
        <button className="lg:hidden text-foreground/70 hover:text-foreground" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-semibold hidden md:block">{currentTitle}</h1>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        <div className="relative">
          <button 
            className="relative p-2 rounded-full hover:bg-surface transition-colors"
            onClick={handleBellClick}
          >
            <Bell size={20} className="text-foreground/70" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                {unreadCount}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border bg-card shadow-lg z-50 overflow-hidden">
              <div className="px-4 py-3 border-b flex items-center justify-between bg-surface/50">
                <h3 className="font-semibold text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" className="h-auto text-xs px-2 py-1 text-primary"
                    onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))}>
                    Tout marquer lu
                  </Button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm text-foreground/50 p-4 text-center">Aucune notification</p>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={cn("p-4 border-b last:border-0 hover:bg-muted/30 transition-colors", !n.read && "bg-primary/5")}>
                      <div className="flex justify-between items-start mb-1">
                        <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", n.type === "Alerte" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary")}>
                          {n.type}
                        </span>
                        <span className="text-[10px] text-foreground/50">{n.date}</span>
                      </div>
                      <p className="text-sm font-medium mt-2">{n.message}</p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                        <Link 
                           to={n.path || "/"} 
                           className="text-xs text-primary hover:underline"
                           onClick={() => setShowNotifications(false)}
                        >
                          Voir détails
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <Link to="/parametres" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium leading-none">Ahmed Radi</p>
            <p className="text-xs text-foreground/50 mt-1">Admin</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
            AR
          </div>
        </Link>
      </div>
    </header>
  );
}

export function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="mx-auto max-w-7xl animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
