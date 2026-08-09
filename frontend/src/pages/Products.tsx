import { useEffect, useState } from "react";
import { api } from "../lib/api";
import {
  Package,
  AlertTriangle,
  Warehouse,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  unitPrice: number;
  currentStock: number;
  minStockAlert: number;
  warehouse: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    unitPrice: 0,
    currentStock: 0,
    minStockAlert: 0,
    warehouse: "",
  });

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products");
      setProducts(data.products);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      await api.post(
        "/products",
        formData
      );

      setFormData({
        name: "",
        sku: "",
        category: "",
        unitPrice: 0,
        currentStock: 0,
        minStockAlert: 0,
        warehouse: "",
      });

      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Failed to add product");
    }
  };

  const lowStockProducts =
    products.filter(
      (p) =>
        p.currentStock <=
        p.minStockAlert
    ).length;

  const warehouses =
    new Set(
      products.map(
        (p) => p.warehouse
      )
    ).size;

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold">
          Inventory Management
        </h1>

        <p className="text-slate-500 mt-1">
          Manage products, stock
          levels and warehouses.
        </p>
      </div>

      {/* Stats */}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500">
                Total Products
              </p>

              <h2 className="text-4xl font-bold mt-2">
                {products.length}
              </h2>
            </div>

            <Package
              size={40}
              className="text-indigo-600"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500">
                Low Stock
              </p>

              <h2 className="text-4xl font-bold text-red-500 mt-2">
                {
                  lowStockProducts
                }
              </h2>
            </div>

            <AlertTriangle
              size={40}
              className="text-red-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500">
                Warehouses
              </p>

              <h2 className="text-4xl font-bold mt-2">
                {warehouses}
              </h2>
            </div>

            <Warehouse
              size={40}
              className="text-green-600"
            />
          </div>
        </div>
      </div>

      {/* Add Product */}

      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h2 className="text-xl font-semibold mb-5">
          Add Product
        </h2>

        <form
  onSubmit={handleSubmit}
  className="grid md:grid-cols-2 gap-5"
>
  {/* Product Name */}

  <div>
    <label className="block text-sm font-medium text-slate-700 mb-2">
      Product Name
    </label>

    <input
      placeholder="e.g. Basmati Rice 25kg"
      value={formData.name}
      onChange={(e) =>
        setFormData({
          ...formData,
          name: e.target.value,
        })
      }
      className="w-full border rounded-xl p-3"
    />
  </div>

  {/* SKU */}

  <div>
    <label className="block text-sm font-medium text-slate-700 mb-2">
      SKU Code
    </label>

    <input
      placeholder="e.g. RICE-001"
      value={formData.sku}
      onChange={(e) =>
        setFormData({
          ...formData,
          sku: e.target.value,
        })
      }
      className="w-full border rounded-xl p-3"
    />
  </div>

  {/* Category */}

  <div>
    <label className="block text-sm font-medium text-slate-700 mb-2">
      Product Category
    </label>

    <select
      value={formData.category}
      onChange={(e) =>
        setFormData({
          ...formData,
          category: e.target.value,
        })
      }
      className="w-full border rounded-xl p-3"
    >
      <option value="">
        Select Category
      </option>

      <option value="Food Grains">
        Food Grains
      </option>

      <option value="Edible Oil">
        Edible Oil
      </option>

      <option value="Beverages">
        Beverages
      </option>

      <option value="Dairy">
        Dairy
      </option>

      <option value="Snacks">
        Snacks
      </option>

      <option value="Personal Care">
        Personal Care
      </option>

      <option value="Household">
        Household
      </option>

      <option value="Electronics">
        Electronics
      </option>

      <option value="Hardware">
        Hardware
      </option>

      <option value="Stationery">
        Stationery
      </option>
    </select>
  </div>

  {/* Price */}

  <div>
    <label className="block text-sm font-medium text-slate-700 mb-2">
      Unit Price (₹)
    </label>

    <input
      type="number"
      placeholder="e.g. 1500"
      value={formData.unitPrice || ""}
      onChange={(e) =>
        setFormData({
          ...formData,
          unitPrice: Number(e.target.value),
        })
      }
      className="w-full border rounded-xl p-3"
    />
  </div>

  {/* Stock */}

  <div>
    <label className="block text-sm font-medium text-slate-700 mb-2">
      Current Stock
    </label>

    <input
      type="number"
      placeholder="e.g. 120"
      value={formData.currentStock || ""}
      onChange={(e) =>
        setFormData({
          ...formData,
          currentStock: Number(e.target.value),
        })
      }
      className="w-full border rounded-xl p-3"
    />
  </div>

  {/* Min Alert */}

  <div>
    <label className="block text-sm font-medium text-slate-700 mb-2">
      Minimum Stock Alert
    </label>

    <input
      type="number"
      placeholder="e.g. 10"
      value={formData.minStockAlert || ""}
      onChange={(e) =>
        setFormData({
          ...formData,
          minStockAlert: Number(e.target.value),
        })
      }
      className="w-full border rounded-xl p-3"
    />

    <p className="text-xs text-slate-500 mt-1">
      Alert shown when stock falls below this value.
    </p>
  </div>

  {/* Warehouse */}

  <div className="md:col-span-2">
    <label className="block text-sm font-medium text-slate-700 mb-2">
      Warehouse Location
    </label>

    <input
      placeholder="e.g. Warehouse A"
      value={formData.warehouse}
      onChange={(e) =>
        setFormData({
          ...formData,
          warehouse: e.target.value,
        })
      }
      className="w-full border rounded-xl p-3"
    />
  </div>

  {/* Button */}

  <div className="md:col-span-2">
    <button
      type="submit"
      className="
        w-full
        bg-slate-900
        text-white
        rounded-xl
        p-3
        hover:bg-slate-800
        transition
        font-medium
      "
    >
      Add Product
    </button>
  </div>
</form>
      </div>

      {/* Product Table */}

      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h2 className="text-xl font-semibold mb-5">
          Product Inventory
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">
                  Product
                </th>

                <th className="text-left p-3">
                  SKU
                </th>

                <th className="text-left p-3">
                  Category
                </th>

                <th className="text-left p-3">
                  Warehouse
                </th>

                <th className="text-left p-3">
                  Stock
                </th>

                <th className="text-left p-3">
                  Price
                </th>
              </tr>
            </thead>

            <tbody>
              {products.map(
                (product) => (
                  <tr
                    key={
                      product.id
                    }
                    className="border-b hover:bg-slate-50"
                  >
                    <td className="p-3 font-medium">
                      {
                        product.name
                      }
                    </td>

                    <td className="p-3">
                      {
                        product.sku
                      }
                    </td>

                    <td className="p-3">
                      {
                        product.category
                      }
                    </td>

                    <td className="p-3">
                      {
                        product.warehouse
                      }
                    </td>

                    <td className="p-3">
                      {product.currentStock <=
                      product.minStockAlert ? (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                          LOW (
                          {
                            product.currentStock
                          }
                          )
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                          {
                            product.currentStock
                          }
                        </span>
                      )}
                    </td>

                    <td className="p-3 font-semibold">
                      ₹
                      {
                        product.unitPrice
                      }
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}