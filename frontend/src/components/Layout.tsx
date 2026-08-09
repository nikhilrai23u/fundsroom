import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  Warehouse
} from "lucide-react";

export default function Layout() {
  const location = useLocation();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Customers",
      path: "/customers",
      icon: Users,
    },
    {
      name: "Products",
      path: "/products",
      icon: Package,
    },
    {
      name: "Challans",
      path: "/challans",
      icon: FileText,
    },
    {
      name: "Stock Movements",
      path: "/stock-movements",
      icon: Warehouse,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="w-72 bg-slate-900 text-white flex flex-col">
        <div className="p-8 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-white">
            FundsRoom ERP
          </h1>

          <p className="text-slate-400 text-sm">
            Operations Portal
          </p>
        </div>

        <div className="px-6 py-5 border-b border-slate-800">
          <p className="font-semibold">
            {user?.name || "Admin"}
          </p>

          <p className="text-sm text-slate-400">
            {user?.role || "ADMIN"}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  location.pathname === item.path
                    ? "bg-slate-800"
                    : "hover:bg-slate-800"
                }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-xl"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}