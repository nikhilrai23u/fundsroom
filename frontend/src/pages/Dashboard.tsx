import { useEffect, useState } from "react";
import { api } from "../lib/api";
import {
  Users,
  Package,
  FileText,
  AlertTriangle,
} from "lucide-react";

interface Stats {
  customers: number;
  products: number;
  challans: number;
  lowStockProducts: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    customers: 0,
    products: 0,
    challans: 0,
    lowStockProducts: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data } =
        await api.get("/dashboard");

      setStats(data.stats);
    } catch (err) {
      console.log(err);
    }
  };

  const cards = [
    {
      title: "Customers",
      value: stats.customers,
      icon: Users,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Products",
      value: stats.products,
      icon: Package,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Challans",
      value: stats.challans,
      icon: FileText,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Low Stock",
      value: stats.lowStockProducts,
      icon: AlertTriangle,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="text-slate-500 mt-2">
          Overview of your business operations.
        </p>
      </div>

      {/* Welcome Banner */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white mb-8">
        <h2 className="text-3xl font-bold bg-gray-100">
          Welcome Back 👋
        </h2>

        <p className="text-slate-300 mt-2">
          Manage customers, inventory,
          products and sales operations
          from a single dashboard.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="
                bg-white
                border
                border-slate-200
                rounded-2xl
                p-6
                shadow-sm
                hover:shadow-md
                transition
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm">
                    {card.title}
                  </p>

                  <h2 className="text-4xl font-bold mt-3 text-slate-900">
                    {card.value}
                  </h2>
                </div>

                <div
                  className={`${card.iconBg} p-4 rounded-2xl`}
                >
                  <Icon
                    size={28}
                    className={card.iconColor}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4">
            Recent Activity
          </h3>

          <div className="space-y-4">
            <div className="border-b pb-3">
              Customer records updated
            </div>

            <div className="border-b pb-3">
              Product inventory synced
            </div>

            <div className="border-b pb-3">
              New challan generated
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4">
            System Status
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Customers</span>
              <span className="font-semibold">
                {stats.customers}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Products</span>
              <span className="font-semibold">
                {stats.products}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Challans</span>
              <span className="font-semibold">
                {stats.challans}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}