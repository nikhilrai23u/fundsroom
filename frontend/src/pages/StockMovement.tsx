import { useEffect, useState } from "react";
import { api } from "../lib/api";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Package,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string;
}

interface StockMovement {
  id: string;
  quantity: number;
  movementType: "IN" | "OUT";
  reason: string;
  createdBy: string;
  createdAt: string;
  product: Product;
}

export default function StockMovements() {
  const [movements, setMovements] = useState<
    StockMovement[]
  >([]);

  const [loading, setLoading] = useState(true);

  const fetchMovements = async () => {
    try {
      const { data } = await api.get(
        "/stock-movements"
      );

      setMovements(data.movements);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, []);

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Stock Movements
        </h1>

        <p className="text-slate-500 mt-1">
          Track all inventory stock changes.
        </p>
      </div>

      {/* Summary */}

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">

            <div className="bg-blue-100 p-3 rounded-xl">
              <Package
                className="text-blue-600"
                size={24}
              />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Total Movements
              </p>

              <p className="text-3xl font-bold">
                {movements.length}
              </p>
            </div>

          </div>
        </div>

        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">

            <div className="bg-green-100 p-3 rounded-xl">
              <ArrowUpCircle
                className="text-green-600"
                size={24}
              />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Stock In
              </p>

              <p className="text-3xl font-bold text-green-600">
                {
                  movements.filter(
                    (m) =>
                      m.movementType === "IN"
                  ).length
                }
              </p>
            </div>

          </div>
        </div>

        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">

            <div className="bg-red-100 p-3 rounded-xl">
              <ArrowDownCircle
                className="text-red-600"
                size={24}
              />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Stock Out
              </p>

              <p className="text-3xl font-bold text-red-600">
                {
                  movements.filter(
                    (m) =>
                      m.movementType === "OUT"
                  ).length
                }
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Table */}

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">

        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">
            Movement History
          </h2>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Loading movements...
          </div>
        ) : movements.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No stock movements found.
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50">
                <tr>

                  <th className="text-left p-4">
                    Product
                  </th>

                  <th className="text-left p-4">
                    SKU
                  </th>

                  <th className="text-left p-4">
                    Movement
                  </th>

                  <th className="text-left p-4">
                    Quantity
                  </th>

                  <th className="text-left p-4">
                    Reason
                  </th>

                  <th className="text-left p-4">
                    Created By
                  </th>

                  <th className="text-left p-4">
                    Date
                  </th>

                </tr>
              </thead>

              <tbody>

                {movements.map((movement) => (

                  <tr
                    key={movement.id}
                    className="border-t hover:bg-slate-50"
                  >

                    <td className="p-4 font-medium">
                      {movement.product.name}
                    </td>

                    <td className="p-4 text-slate-500">
                      {movement.product.sku}
                    </td>

                    <td className="p-4">

                      {movement.movementType ===
                      "IN" ? (

                        <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">

                          <ArrowUpCircle size={16} />

                          Stock In

                        </span>

                      ) : (

                        <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">

                          <ArrowDownCircle size={16} />

                          Stock Out

                        </span>

                      )}

                    </td>

                    <td className="p-4 font-semibold">
                      {movement.quantity}
                    </td>

                    <td className="p-4">
                      {movement.reason}
                    </td>

                    <td className="p-4 text-slate-600">
                      {movement.createdBy}
                    </td>

                    <td className="p-4 text-slate-500">
                      {new Date(
                        movement.createdAt
                      ).toLocaleString()}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}