import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import {
  FileText,
  Plus,
  Trash2,
  User,
  Package,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Customer {
  id: string;
  name: string;
  businessName: string;
  mobile: string;
  status: string;
}

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

interface ChallanItem {
  productId: string;
  quantity: number;
}

interface Challan {
  id: string;
  challanNumber: string;
  status: "DRAFT" | "CONFIRMED" | "CANCELLED";
  createdAt: string;
  customer: {
    id: string;
    name: string;
    businessName: string;
  };
  items: {
    id: string;
    productNameSnapshot: string;
    skuSnapshot: string;
    priceSnapshot: number;
    quantity: number;
  }[];
  createdBy: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export default function Challans() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [challans, setChallans] = useState<Challan[]>([]);

  const navigate = useNavigate();

  const [customerId, setCustomerId] = useState("");

  const [items, setItems] = useState<ChallanItem[]>([]);

  const [selectedProductId, setSelectedProductId] =
    useState("");

  const [selectedQuantity, setSelectedQuantity] =
    useState(1);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // =====================================
  // FETCH DATA
  // =====================================

  const fetchCustomers = async () => {
    try {
      const { data } = await api.get("/customers");

      setCustomers(data.customers || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products");

      setProducts(data.products || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchChallans = async () => {
    try {
      const { data } = await api.get("/challans");

      setChallans(data.challans || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
    fetchChallans();
  }, []);

  // =====================================
  // SELECTED PRODUCT
  // =====================================

  const selectedProduct = products.find(
    (product) =>
      product.id === selectedProductId
  );

  // =====================================
  // ADD PRODUCT
  // =====================================

  const addProduct = () => {
    setError("");

    if (!selectedProductId) {
      setError("Please select a product.");
      return;
    }

    if (selectedQuantity <= 0) {
      setError(
        "Quantity must be greater than zero."
      );
      return;
    }

    const existingItem = items.find(
      (item) =>
        item.productId === selectedProductId
    );

    if (existingItem) {
      const newQuantity =
        existingItem.quantity +
        selectedQuantity;

      if (
        selectedProduct &&
        newQuantity >
          selectedProduct.currentStock
      ) {
        setError(
          `Only ${selectedProduct.currentStock} units of ${selectedProduct.name} are available.`
        );
        return;
      }

      setItems(
        items.map((item) =>
          item.productId ===
          selectedProductId
            ? {
                ...item,
                quantity: newQuantity,
              }
            : item
        )
      );
    } else {
      if (
        selectedProduct &&
        selectedQuantity >
          selectedProduct.currentStock
      ) {
        setError(
          `Only ${selectedProduct.currentStock} units of ${selectedProduct.name} are available.`
        );
        return;
      }

      setItems([
        ...items,
        {
          productId: selectedProductId,
          quantity: selectedQuantity,
        },
      ]);
    }

    setSelectedProductId("");
    setSelectedQuantity(1);
  };

  // =====================================
  // REMOVE PRODUCT
  // =====================================

  const removeItem = (
    productId: string
  ) => {
    setItems(
      items.filter(
        (item) =>
          item.productId !== productId
      )
    );
  };

  // =====================================
  // UPDATE QUANTITY
  // =====================================

  const updateQuantity = (
    productId: string,
    quantity: number
  ) => {
    const product = products.find(
      (p) => p.id === productId
    );

    if (!product) return;

    if (quantity < 1) {
      return;
    }

    if (quantity > product.currentStock) {
      setError(
        `Only ${product.currentStock} units of ${product.name} are available.`
      );

      return;
    }

    setError("");

    setItems(
      items.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  };

  // =====================================
  // TOTAL QUANTITY
  // =====================================

  const totalQuantity = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );
  }, [items]);

  // =====================================
  // TOTAL VALUE
  // =====================================

  const totalValue = useMemo(() => {
    return items.reduce(
      (total, item) => {
        const product = products.find(
          (p) =>
            p.id === item.productId
        );

        if (!product) return total;

        return (
          total +
          product.unitPrice *
            item.quantity
        );
      },
      0
    );
  }, [items, products]);

  // =====================================
  // CREATE CHALLAN
  // =====================================

  const createChallan = async (
    status: "DRAFT" | "CONFIRMED"
  ) => {
    setError("");

    if (!customerId) {
      setError(
        "Please select a customer."
      );

      return;
    }

    if (items.length === 0) {
      setError(
        "Please add at least one product."
      );

      return;
    }

    setLoading(true);

    try {
      await api.post("/challans", {
        customerId,
        items,
        status,
      });

      alert(
        status === "DRAFT"
          ? "Challan saved as draft."
          : "Challan confirmed successfully."
      );

      // Reset form
      setCustomerId("");
      setItems([]);
      setSelectedProductId("");
      setSelectedQuantity(1);

      // Refresh data
      await fetchChallans();
      await fetchProducts();
    } catch (error: any) {
      console.error(error);

      const message =
        error?.response?.data?.message ||
        "Failed to create challan.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // STATUS BADGE
  // =====================================

  const getStatusBadge = (
    status: string
  ) => {
    if (status === "CONFIRMED") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
          <CheckCircle size={14} />
          Confirmed
        </span>
      );
    }

    if (status === "DRAFT") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700">
          <Clock size={14} />
          Draft
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-red-100 text-red-700">
        <XCircle size={14} />
        Cancelled
      </span>
    );
  };

  return (
    <div className="space-y-8">

      {/* =====================================
          HEADER
      ===================================== */}

      <div>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-900 text-white rounded-xl">
            <FileText size={24} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Sales Challans
            </h1>

            <p className="text-slate-500 mt-1">
              Create and manage sales challans.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================
          ERROR
      ===================================== */}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
          {error}
        </div>
      )}

      {/* =====================================
          CHALLAN BUILDER
      ===================================== */}

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">

        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">
            Create Sales Challan
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Select a customer and add products
            to create a challan.
          </p>
        </div>

        <div className="p-6 space-y-6">

          {/* CUSTOMER */}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Customer
            </label>

            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-3.5 text-slate-400"
              />

              <select
                value={customerId}
                onChange={(e) =>
                  setCustomerId(
                    e.target.value
                  )
                }
                className="w-full border rounded-xl p-3 pl-10 bg-white"
              >
                <option value="">
                  Select customer
                </option>

                {customers.map(
                  (customer) => (
                    <option
                      key={customer.id}
                      value={customer.id}
                    >
                      {customer.name}
                      {customer.businessName
                        ? ` — ${customer.businessName}`
                        : ""}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {/* PRODUCT ADDER */}

          <div className="border rounded-2xl p-5 bg-slate-50">

            <div className="flex items-center gap-2 mb-4">
              <Package size={20} />

              <h3 className="font-semibold">
                Add Products
              </h3>
            </div>

            <div className="grid md:grid-cols-[1fr_180px_auto] gap-3">

              <select
                value={selectedProductId}
                onChange={(e) =>
                  setSelectedProductId(
                    e.target.value
                  )
                }
                className="border rounded-xl p-3 bg-white"
              >
                <option value="">
                  Select product
                </option>

                {products.map(
                  (product) => (
                    <option
                      key={product.id}
                      value={product.id}
                      disabled={
                        product.currentStock ===
                        0
                      }
                    >
                      {product.name} —{" "}
                      {product.sku} — Stock:{" "}
                      {product.currentStock}
                    </option>
                  )
                )}
              </select>

              <input
                type="number"
                min="1"
                value={selectedQuantity}
                onChange={(e) =>
                  setSelectedQuantity(
                    Number(e.target.value)
                  )
                }
                className="border rounded-xl p-3 bg-white"
                placeholder="Quantity"
              />

              <button
                type="button"
                onClick={addProduct}
                className="bg-slate-900 text-white px-5 py-3 rounded-xl hover:bg-slate-800 flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Add
              </button>

            </div>

            {selectedProduct && (
              <div className="mt-4 bg-white border rounded-xl p-4">

                <div className="flex justify-between">

                  <div>
                    <p className="font-medium">
                      {selectedProduct.name}
                    </p>

                    <p className="text-sm text-slate-500">
                      SKU:{" "}
                      {selectedProduct.sku}
                    </p>
                  </div>

                  <div className="text-right">

                    <p className="font-semibold">
                      ₹
                      {selectedProduct.unitPrice.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    <p
                      className={`text-sm ${
                        selectedProduct.currentStock <=
                        selectedProduct.minStockAlert
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      Stock:{" "}
                      {
                        selectedProduct.currentStock
                      }
                    </p>

                  </div>

                </div>

              </div>
            )}

          </div>

          {/* ITEMS */}

          <div>

            <div className="flex items-center justify-between mb-4">

              <h3 className="font-semibold">
                Challan Items
              </h3>

              <span className="text-sm text-slate-500">
                {items.length} item
                {items.length !== 1
                  ? "s"
                  : ""}
              </span>

            </div>

            {items.length === 0 ? (
              <div className="border-2 border-dashed rounded-2xl p-10 text-center text-slate-500">
                <Package
                  size={40}
                  className="mx-auto mb-3 text-slate-300"
                />

                <p>
                  No products added yet.
                </p>

                <p className="text-sm mt-1">
                  Select a product above to
                  add it to the challan.
                </p>
              </div>
            ) : (
              <div className="border rounded-2xl overflow-hidden">

                <div className="overflow-x-auto">

                  <table className="w-full">

                    <thead className="bg-slate-50">

                      <tr className="border-b">

                        <th className="text-left p-4">
                          Product
                        </th>

                        <th className="text-left p-4">
                          SKU
                        </th>

                        <th className="text-left p-4">
                          Price
                        </th>

                        <th className="text-left p-4">
                          Quantity
                        </th>

                        <th className="text-left p-4">
                          Amount
                        </th>

                        <th className="p-4"></th>

                      </tr>

                    </thead>

                    <tbody>

                      {items.map(
                        (item) => {
                          const product =
                            products.find(
                              (p) =>
                                p.id ===
                                item.productId
                            );

                          if (!product)
                            return null;

                          return (
                            <tr
                              key={
                                item.productId
                              }
                              className="border-b last:border-b-0"
                            >

                              <td className="p-4">
                                <div className="font-medium">
                                  {
                                    product.name
                                  }
                                </div>

                                <div className="text-xs text-slate-500">
                                  {
                                    product.category
                                  }
                                </div>
                              </td>

                              <td className="p-4 text-slate-600">
                                {
                                  product.sku
                                }
                              </td>

                              <td className="p-4">
                                ₹
                                {product.unitPrice.toLocaleString(
                                  "en-IN"
                                )}
                              </td>

                              <td className="p-4">

                                <input
                                  type="number"
                                  min="1"
                                  max={
                                    product.currentStock
                                  }
                                  value={
                                    item.quantity
                                  }
                                  onChange={(
                                    e
                                  ) =>
                                    updateQuantity(
                                      item.productId,
                                      Number(
                                        e.target
                                          .value
                                      )
                                    )
                                  }
                                  className="border rounded-lg p-2 w-24"
                                />

                                <p className="text-xs text-slate-400 mt-1">
                                  Max:{" "}
                                  {
                                    product.currentStock
                                  }
                                </p>

                              </td>

                              <td className="p-4 font-semibold">
                                ₹
                                {(
                                  product.unitPrice *
                                  item.quantity
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </td>

                              <td className="p-4 text-right">

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeItem(
                                      item.productId
                                    )
                                  }
                                  className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                                >
                                  <Trash2
                                    size={18}
                                  />
                                </button>

                              </td>

                            </tr>
                          );
                        }
                      )}

                    </tbody>

                  </table>

                </div>

              </div>
            )}

          </div>

          {/* SUMMARY */}

          <div className="bg-slate-900 text-white rounded-2xl p-6">

            <div className="grid md:grid-cols-3 gap-6">

              <div>
                <p className="text-slate-400 text-sm">
                  Total Items
                </p>

                <p className="text-2xl font-bold mt-1">
                  {items.length}
                </p>
              </div>

              <div>
                <p className="text-slate-400 text-sm">
                  Total Quantity
                </p>

                <p className="text-2xl font-bold mt-1">
                  {totalQuantity}
                </p>
              </div>

              <div>
                <p className="text-slate-400 text-sm">
                  Estimated Value
                </p>

                <p className="text-2xl font-bold mt-1">
                  ₹
                  {totalValue.toLocaleString(
                    "en-IN"
                  )}
                </p>
              </div>

            </div>

          </div>

          {/* ACTIONS */}

          <div className="flex flex-col md:flex-row justify-end gap-3">

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                createChallan("DRAFT")
              }
              className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : "Save Draft"}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                createChallan("CONFIRMED")
              }
              className="px-6 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {loading
                ? "Processing..."
                : "Confirm Challan"}
            </button>

          </div>

        </div>

      </div>

      {/* =====================================
          RECENT CHALLANS
      ===================================== */}

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">

        <div className="p-6 border-b">

          <h2 className="text-xl font-semibold">
            Recent Challans
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            View previously created sales challans.
          </p>

        </div>

        {challans.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No challans created yet.
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50">

                <tr className="border-b">

                  <th className="text-left p-4">
                    Challan
                  </th>

                  <th className="text-left p-4">
                    Customer
                  </th>

                  <th className="text-left p-4">
                    Items
                  </th>

                  <th className="text-left p-4">
                    Quantity
                  </th>

                  <th className="text-left p-4">
                    Status
                  </th>

                  <th className="text-left p-4">
                    Created
                  </th>

                </tr>

              </thead>

              <tbody>

                {challans.map(
                  (challan) => {

                    const quantity =
                      challan.items.reduce(
                        (
                          total,
                          item
                        ) =>
                          total +
                          item.quantity,
                        0
                      );

                    return (
                      <tr
                        key={challan.id}
                        onClick={() =>
                          navigate(`/challans/${challan.id}`)
                        }
                        className="border-b last:border-b-0 hover:bg-slate-50 cursor-pointer transition"
                      >

                        <td className="p-4">

                          <div className="font-semibold">
                            {
                              challan.challanNumber
                            }
                          </div>

                          <div className="text-xs text-slate-500">
                            {
                              challan.createdBy
                                ?.name
                            }
                          </div>

                        </td>

                        <td className="p-4">

                          <div className="font-medium">
                            {
                              challan.customer
                                ?.name
                            }
                          </div>

                          <div className="text-xs text-slate-500">
                            {
                              challan.customer
                                ?.businessName
                            }
                          </div>

                        </td>

                        <td className="p-4">
                          {
                            challan.items
                              .length
                          }
                        </td>

                        <td className="p-4">
                          {quantity}
                        </td>

                        <td className="p-4">
                          {getStatusBadge(
                            challan.status
                          )}
                        </td>

                        <td className="p-4 text-slate-500">
                          {new Date(
                            challan.createdAt
                          ).toLocaleDateString(
                            "en-IN"
                          )}
                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}