import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Printer,
} from "lucide-react";
import { api } from "../lib/api";

interface ChallanItem {
  id: string;
  productId: string;
  productNameSnapshot: string;
  skuSnapshot: string;
  priceSnapshot: number;
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
    mobile: string;
    email: string;
    businessName: string;
    gstNumber?: string;
    address: string;
  };

  items: ChallanItem[];

  createdBy: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export default function ChallanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [challan, setChallan] =
    useState<Challan | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [confirming, setConfirming] =
    useState(false);

  const [error, setError] =
    useState("");

  // =====================================
  // FETCH CHALLAN
  // =====================================

  const fetchChallan = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError("");

      const { data } =
        await api.get(`/challans/${id}`);

      setChallan(data.challan);
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Failed to fetch challan."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallan();
  }, [id]);

  // =====================================
  // CONFIRM CHALLAN
  // =====================================

  const confirmChallan = async () => {
    if (!id || !challan) return;

    const confirmed = window.confirm(
      "Are you sure you want to confirm this challan? Stock will be deducted."
    );

    if (!confirmed) return;

    try {
      setConfirming(true);
      setError("");

      const { data } =
        await api.post(
          `/challans/${id}/confirm`
        );

      setChallan(data.challan);

      alert(
        "Challan confirmed successfully."
      );
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Failed to confirm challan."
      );
    } finally {
      setConfirming(false);
    }
  };

  const cancelChallan = async () => {
  try {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this challan? If it is confirmed, the stock will be restored."
    );

    if (!confirmed) return;

    await api.post(
      `/challans/${challan?.id}/cancel`
    );

    alert("Challan cancelled successfully.");

    // Refresh challan
    const { data } = await api.get(
      `/challans/${challan?.id}`
    );

    setChallan(data.challan);
  } catch (error: any) {
    console.error(error);

    alert(
      error?.response?.data?.message ||
        "Failed to cancel challan"
    );
  }
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="p-8">
        <div className="bg-white border rounded-2xl p-10 text-center">
          <p className="text-slate-500">
            Loading challan...
          </p>
        </div>
      </div>
    );
  }

  // =====================================
  // NOT FOUND
  // =====================================

  if (!challan) {
    return (
      <div className="p-8">
        <div className="bg-white border rounded-2xl p-10 text-center">
          <FileText
            size={48}
            className="mx-auto mb-4 text-slate-300"
          />

          <h2 className="text-xl font-semibold">
            Challan not found
          </h2>

          {error && (
            <p className="text-red-600 mt-2">
              {error}
            </p>
          )}

          <button
            onClick={() =>
              navigate("/challans")
            }
            className="mt-5 bg-slate-900 text-white px-5 py-3 rounded-xl hover:bg-slate-800"
          >
            Back to Challans
          </button>
        </div>
      </div>
    );
  }

  // =====================================
  // TOTALS
  // =====================================

  const totalQuantity =
    challan.items.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  const totalValue =
    challan.items.reduce(
      (total, item) =>
        total +
        item.priceSnapshot *
          item.quantity,
      0
    );

  // =====================================
  // STATUS BADGE
  // =====================================

  const statusBadge =
    challan.status === "CONFIRMED" ? (
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700">
        <CheckCircle size={16} />
        Confirmed
      </span>
    ) : challan.status === "DRAFT" ? (
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
        <Clock size={16} />
        Draft
      </span>
    ) : (
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700">
        <XCircle size={16} />
        Cancelled
      </span>
    );

  return (
    <div className="space-y-6">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="flex flex-col md:flex-row md:items-center gap-4">

        <button
          onClick={() =>
            navigate("/challans")
          }
          className="p-3 rounded-xl border hover:bg-slate-100 transition w-fit"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Challan Details
          </h1>

          <p className="text-slate-500 mt-1">
            View sales challan information.
          </p>
        </div>

        <div className="md:ml-auto flex items-center gap-3">

          {/* EDIT DRAFT */}

          {challan.status === "DRAFT" && (
            <button
              onClick={() =>
                navigate(
                  `/challans/${challan.id}/edit`
                )
              }
              className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-100"
            >
              Edit Draft
            </button>
          )}

          {/* CONFIRM */}

          {challan.status === "DRAFT" && (
            <button
              onClick={confirmChallan}
              disabled={confirming}
              className="px-5 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2"
            >
              <CheckCircle size={18} />

              {confirming
                ? "Confirming..."
                : "Confirm Challan"}
            </button>
          )}

          {/*cancel */ }  
          {challan.status !== "CANCELLED" && (
            <button
              onClick={cancelChallan}
              className="px-5 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
            >
              <XCircle size={18} />
              Cancel Challan
            </button>
          )}

          {/* PRINT */}

          <button
            onClick={() =>
              window.print()
            }
            className="p-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
            title="Print Challan"
          >
            <Printer size={20} />
          </button>

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
          CHALLAN HEADER
      ===================================== */}

      <div className="bg-slate-900 text-white rounded-3xl p-8">

        <div className="flex flex-col md:flex-row md:items-center gap-5">

          <div className="p-4 bg-white/10 rounded-2xl w-fit">
            <FileText size={32} />
          </div>

          <div>
            <p className="text-slate-400 text-sm">
              Challan Number
            </p>

            <h2 className="text-3xl font-bold">
              {challan.challanNumber}
            </h2>
          </div>

          <div className="md:ml-auto">
            {statusBadge}
          </div>

        </div>

      </div>

      {/* =====================================
          CUSTOMER + CHALLAN INFORMATION
      ===================================== */}

      <div className="grid lg:grid-cols-2 gap-6">

        {/* CUSTOMER */}

        <div className="bg-white border rounded-2xl p-6 shadow-sm">

          <h2 className="text-lg font-semibold mb-5">
            Customer Information
          </h2>

          <div className="space-y-5">

            <div className="flex gap-4">
              <User
                size={20}
                className="text-slate-500 mt-1"
              />

              <div>
                <p className="text-sm text-slate-500">
                  Customer
                </p>

                <p className="font-medium">
                  {challan.customer.name}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Building2
                size={20}
                className="text-slate-500 mt-1"
              />

              <div>
                <p className="text-sm text-slate-500">
                  Business
                </p>

                <p className="font-medium">
                  {challan.customer
                    .businessName ||
                    "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Phone
                size={20}
                className="text-slate-500 mt-1"
              />

              <div>
                <p className="text-sm text-slate-500">
                  Mobile
                </p>

                <p className="font-medium">
                  {challan.customer.mobile ||
                    "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Mail
                size={20}
                className="text-slate-500 mt-1"
              />

              <div>
                <p className="text-sm text-slate-500">
                  Email
                </p>

                <p className="font-medium">
                  {challan.customer.email ||
                    "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <MapPin
                size={20}
                className="text-slate-500 mt-1"
              />

              <div>
                <p className="text-sm text-slate-500">
                  Address
                </p>

                <p className="font-medium">
                  {challan.customer.address ||
                    "Not provided"}
                </p>
              </div>
            </div>

            {challan.customer
              .gstNumber && (
              <div className="flex gap-4">
                <FileText
                  size={20}
                  className="text-slate-500 mt-1"
                />

                <div>
                  <p className="text-sm text-slate-500">
                    GSTIN
                  </p>

                  <p className="font-medium">
                    {
                      challan.customer
                        .gstNumber
                    }
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* CHALLAN INFORMATION */}

        <div className="bg-white border rounded-2xl p-6 shadow-sm">

          <h2 className="text-lg font-semibold mb-5">
            Challan Information
          </h2>

          <div className="space-y-5">

            <div className="flex gap-4">
              <Calendar
                size={20}
                className="text-slate-500 mt-1"
              />

              <div>
                <p className="text-sm text-slate-500">
                  Created On
                </p>

                <p className="font-medium">
                  {new Date(
                    challan.createdAt
                  ).toLocaleDateString(
                    "en-IN"
                  )}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <User
                size={20}
                className="text-slate-500 mt-1"
              />

              <div>
                <p className="text-sm text-slate-500">
                  Created By
                </p>

                <p className="font-medium">
                  {challan.createdBy.name}
                </p>

                <p className="text-sm text-slate-500">
                  {challan.createdBy.role}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Status
              </p>

              <div className="mt-2">
                {statusBadge}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* =====================================
          PRODUCTS
      ===================================== */}

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">

        <div className="p-6 border-b">

          <h2 className="text-xl font-semibold">
            Products
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Products included in this challan.
          </p>

        </div>

        {challan.items.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No products in this challan.
          </div>
        ) : (
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

                </tr>

              </thead>

              <tbody>

                {challan.items.map(
                  (item) => {

                    const amount =
                      item.priceSnapshot *
                      item.quantity;

                    return (
                      <tr
                        key={item.id}
                        className="border-b last:border-b-0"
                      >

                        <td className="p-4">
                          <p className="font-medium">
                            {
                              item.productNameSnapshot
                            }
                          </p>
                        </td>

                        <td className="p-4 text-slate-500">
                          {
                            item.skuSnapshot
                          }
                        </td>

                        <td className="p-4">
                          ₹
                          {item.priceSnapshot.toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        <td className="p-4">
                          {item.quantity}
                        </td>

                        <td className="p-4 font-semibold">
                          ₹
                          {amount.toLocaleString(
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

      {/* =====================================
          SUMMARY
      ===================================== */}

      <div className="bg-slate-900 text-white rounded-2xl p-6">

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <p className="text-slate-400 text-sm">
              Total Quantity
            </p>

            <p className="text-3xl font-bold mt-1">
              {totalQuantity}
            </p>
          </div>

          <div>
            <p className="text-slate-400 text-sm">
              Total Value
            </p>

            <p className="text-3xl font-bold mt-1">
              ₹
              {totalValue.toLocaleString(
                "en-IN"
              )}
            </p>
          </div>

        </div>

      </div>

      {/* =====================================
          PRINTABLE CHALLAN
      ===================================== */}

      <div className="print-only">

        <div className="print-header">

          <div>
            <h1>FUNDSROOM</h1>
            <p>Sales Challan</p>
          </div>

          <div className="print-meta">

            <p>
              <strong>
                Challan No:
              </strong>{" "}
              {challan.challanNumber}
            </p>

            <p>
              <strong>
                Date:
              </strong>{" "}
              {new Date(
                challan.createdAt
              ).toLocaleDateString(
                "en-IN"
              )}
            </p>

            <p>
              <strong>
                Status:
              </strong>{" "}
              {challan.status}
            </p>

          </div>

        </div>

        {/* CUSTOMER */}

        <div className="print-section">

          <h3>
            Customer Details
          </h3>

          <p>
            <strong>Name:</strong>{" "}
            {challan.customer.name}
          </p>

          <p>
            <strong>
              Business:
            </strong>{" "}
            {challan.customer
              .businessName || "N/A"}
          </p>

          <p>
            <strong>
              Mobile:
            </strong>{" "}
            {challan.customer.mobile ||
              "N/A"}
          </p>

          <p>
            <strong>
              Email:
            </strong>{" "}
            {challan.customer.email ||
              "N/A"}
          </p>

          <p>
            <strong>
              Address:
            </strong>{" "}
            {challan.customer.address ||
              "N/A"}
          </p>

          {challan.customer
            .gstNumber && (
            <p>
              <strong>
                GSTIN:
              </strong>{" "}
              {challan.customer
                .gstNumber}
            </p>
          )}

        </div>

        {/* PRODUCTS */}

        <table className="print-table">

          <thead>

            <tr>
              <th>#</th>
              <th>Product</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Amount</th>
            </tr>

          </thead>

          <tbody>

            {challan.items.map(
              (item, index) => {

                const amount =
                  item.priceSnapshot *
                  item.quantity;

                return (
                  <tr key={item.id}>

                    <td>
                      {index + 1}
                    </td>

                    <td>
                      {
                        item.productNameSnapshot
                      }
                    </td>

                    <td>
                      {
                        item.skuSnapshot
                      }
                    </td>

                    <td>
                      ₹
                      {item.priceSnapshot.toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td>
                      {item.quantity}
                    </td>

                    <td>
                      ₹
                      {amount.toLocaleString(
                        "en-IN"
                      )}
                    </td>

                  </tr>
                );
              }
            )}

          </tbody>

        </table>

        {/* TOTALS */}

        <div className="print-total">

          <div>
            <strong>
              Total Quantity:
            </strong>{" "}
            {totalQuantity}
          </div>

          <div>
            <strong>
              Total Value:
            </strong>{" "}
            ₹
            {totalValue.toLocaleString(
              "en-IN"
            )}
          </div>

        </div>

        {/* SIGNATURES */}

        <div className="print-signatures">

          <div>
            Prepared By:
            <br />
            <strong>
              {challan.createdBy.name}
            </strong>
          </div>

          <div className="signature">
            Customer Signature
          </div>

          <div className="signature">
            Authorized Signature
          </div>

        </div>

      </div>

    </div>
  );
}