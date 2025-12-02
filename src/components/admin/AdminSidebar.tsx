import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  FolderKanban, 
  GraduationCap,
  ShoppingCart, 
  Users, 
  Ticket, 
  MessageSquare, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  currentPath: string;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: FileText, label: 'Notes', path: '/admin/content/notes' },
  { icon: FolderKanban, label: 'Microprojects', path: '/admin/content/microprojects' },
  { icon: GraduationCap, label: 'Capstone', path: '/admin/content/capstone' },
  { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: Ticket, label: 'Coupons', path: '/admin/coupons' },
  { icon: MessageSquare, label: 'Support', path: '/admin/support' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export function AdminSidebar({ collapsed, onToggle, currentPath }: AdminSidebarProps) {
  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-slate-900 text-white flex flex-col transition-all duration-300 z-50",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700">
        {!collapsed && (
          <span className="font-bold text-lg">DiploMate</span>
        )}
        <button 
          onClick={onToggle}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const isActive = currentPath === item.path || 
              (item.path !== '/admin' && currentPath.startsWith(item.path));
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    isActive 
                      ? "bg-blue-600 text-white" 
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <item.icon size={20} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Version */}
      {!collapsed && (
        <div className="p-4 text-xs text-slate-500 border-t border-slate-700">
          Admin Panel v1.0
        </div>
      )}
    </aside>
  );
}
