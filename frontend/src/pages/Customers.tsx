import { useEffect, useState } from "react";
import { api } from "../lib/api";
import {
  Users,
  UserCheck,
  UserX,
  Search,
  Plus,
  Calendar,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Customer {
  id: string;
  name: string;
  mobile: string;
  email: string;
  businessName: string;
  customerType: string;
  address: string;
  status: string;
  gstNumber?: string;
  followUpDate?: string;
  notes?: string;
}

export default function Customers() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    businessName: "",
    gstNumber: "",
    customerType: "RETAIL",
    address: "",
    status: "ACTIVE",
    followUpDate: "",
    notes: "",
  });

  // -----------------------------
  // Fetch Customers
  // -----------------------------

  const fetchCustomers = async () => {
    try {
      const { data } = await api.get("/customers");
      setCustomers(data.customers || []);
    } catch (error) {
      console.error("Failed to fetch customers", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // -----------------------------
  // Search
  // -----------------------------

  const filteredCustomers = customers.filter((customer) => {
    const query = search.toLowerCase();

    return (
      customer.name?.toLowerCase().includes(query) ||
      customer.businessName?.toLowerCase().includes(query) ||
      customer.mobile?.toLowerCase().includes(query) ||
      customer.email?.toLowerCase().includes(query)
    );
  });

  // -----------------------------
  // Stats
  // -----------------------------

  const activeCustomers = customers.filter(
    (customer) => customer.status === "ACTIVE"
  ).length;

  const inactiveCustomers = customers.filter(
    (customer) => customer.status === "INACTIVE"
  ).length;

  const leads = customers.filter(
    (customer) => customer.status === "LEAD"
  ).length;

  // -----------------------------
  // Form Change
  // -----------------------------

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // -----------------------------
  // Add Customer
  // -----------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.mobile) {
      alert("Customer name and mobile are required.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/customers", formData);

      alert("Customer added successfully.");

      setFormData({
        name: "",
        mobile: "",
        email: "",
        businessName: "",
        gstNumber: "",
        customerType: "RETAIL",
        address: "",
        status: "ACTIVE",
        followUpDate: "",
        notes: "",
      });

      await fetchCustomers();
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Failed to add customer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* ================= HEADER ================= */}

      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Customer CRM
        </h1>

        <p className="text-slate-500 mt-1">
          Manage customers, leads and follow-ups.
        </p>
      </div>

      {/* ================= STATS ================= */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

        {/* Total */}

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Total Customers
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-2">
                {customers.length}
              </p>
            </div>

            <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
              <Users size={24} />
            </div>

          </div>
        </div>

        {/* Active */}

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Active
              </p>

              <p className="text-3xl font-bold text-green-600 mt-2">
                {activeCustomers}
              </p>
            </div>

            <div className="bg-green-100 text-green-600 p-3 rounded-xl">
              <UserCheck size={24} />
            </div>

          </div>
        </div>

        {/* Leads */}

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Leads
              </p>

              <p className="text-3xl font-bold text-amber-600 mt-2">
                {leads}
              </p>
            </div>

            <div className="bg-amber-100 text-amber-600 p-3 rounded-xl">
              <Users size={24} />
            </div>

          </div>
        </div>

        {/* Inactive */}

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Inactive
              </p>

              <p className="text-3xl font-bold text-red-600 mt-2">
                {inactiveCustomers}
              </p>
            </div>

            <div className="bg-red-100 text-red-600 p-3 rounded-xl">
              <UserX size={24} />
            </div>

          </div>
        </div>

      </div>

      {/* ================= ADD CUSTOMER ================= */}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">

        <div className="p-6 border-b border-slate-200">

          <div className="flex items-center gap-3">

            <div className="bg-slate-900 text-white p-2.5 rounded-xl">
              <Plus size={20} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Add Customer
              </h2>

              <p className="text-sm text-slate-500">
                Create a new customer record.
              </p>
            </div>

          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5"
        >

          {/* Customer Name */}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Customer Name *
            </label>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Rajesh Kumar"
              className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Mobile */}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Mobile Number *
            </label>

            <input
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="e.g. 9876543210"
              className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Email */}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>

            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="customer@email.com"
              className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Business */}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Business Name
            </label>

            <input
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="e.g. ABC Traders"
              className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* GST */}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              GST Number
              <span className="text-slate-400 font-normal">
                {" "}
                (Optional)
              </span>
            </label>

            <input
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              placeholder="e.g. 22AAAAA0000A1Z5"
              className="w-full border border-slate-300 rounded-xl p-3 uppercase outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Customer Type */}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Customer Type
            </label>

            <select
              name="customerType"
              value={formData.customerType}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl p-3 bg-white outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="RETAIL">
                Retail
              </option>

              <option value="WHOLESALE">
                Wholesale
              </option>

              <option value="DISTRIBUTOR">
                Distributor
              </option>
            </select>
          </div>

          {/* Status */}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Customer Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl p-3 bg-white outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="LEAD">
                Lead
              </option>

              <option value="ACTIVE">
                Active
              </option>

              <option value="INACTIVE">
                Inactive
              </option>
            </select>
          </div>

          {/* Follow Up */}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Follow-up Date
            </label>

            <div className="relative">

              <Calendar
                size={18}
                className="absolute left-3 top-3.5 text-slate-400"
              />

              <input
                name="followUpDate"
                type="date"
                value={formData.followUpDate}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl p-3 pl-10 outline-none focus:ring-2 focus:ring-slate-900"
              />

            </div>
          </div>

          {/* Address */}

          <div className="md:col-span-2">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Address
            </label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Full customer address..."
              rows={3}
              className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-slate-900"
            />

          </div>

          {/* Notes */}

          <div className="md:col-span-2">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Notes
            </label>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Customer requirements, follow-up notes, remarks..."
              rows={3}
              className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-slate-900"
            />

          </div>

          {/* Submit */}

          <div className="md:col-span-2 flex justify-end">

            <button
              type="submit"
              disabled={loading}
              className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium transition"
            >
              {loading
                ? "Adding..."
                : "Add Customer"}
            </button>

          </div>

        </form>

      </div>

      {/* ================= CUSTOMER LIST ================= */}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">

        <div className="p-6 border-b border-slate-200">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Customers
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Click a customer to view details.
              </p>
            </div>

            <div className="relative md:w-80">

              <Search
                size={18}
                className="absolute left-3 top-3.5 text-slate-400"
              />

              <input
                placeholder="Search customers..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full border border-slate-300 rounded-xl p-3 pl-10 outline-none focus:ring-2 focus:ring-slate-900"
              />

            </div>

          </div>

        </div>

        {/* Table */}

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200">

                <th className="p-4 text-left text-sm font-semibold text-slate-600">
                  Customer
                </th>

                <th className="p-4 text-left text-sm font-semibold text-slate-600">
                  Business
                </th>

                <th className="p-4 text-left text-sm font-semibold text-slate-600">
                  Mobile
                </th>

                <th className="p-4 text-left text-sm font-semibold text-slate-600">
                  Type
                </th>

                <th className="p-4 text-left text-sm font-semibold text-slate-600">
                  Status
                </th>

                <th className="p-4 text-right text-sm font-semibold text-slate-600">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredCustomers.length === 0 ? (

                <tr>

                  <td
                    colSpan={6}
                    className="p-10 text-center text-slate-500"
                  >
                    No customers found.
                  </td>

                </tr>

              ) : (

                filteredCustomers.map((customer) => (

                  <tr
                    key={customer.id}
                    onClick={() =>
                      navigate(
                        `/customers/${customer.id}`
                      )
                    }
                    className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition"
                  >

                    <td className="p-4">

                      <div className="font-medium text-slate-900">
                        {customer.name}
                      </div>

                      <div className="text-sm text-slate-500">
                        {customer.email || "No email"}
                      </div>

                    </td>

                    <td className="p-4 text-slate-700">
                      {customer.businessName || "—"}
                    </td>

                    <td className="p-4 text-slate-700">
                      {customer.mobile}
                    </td>

                    <td className="p-4">

                      <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium">
                        {customer.customerType}
                      </span>

                    </td>

                    <td className="p-4">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          customer.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : customer.status === "LEAD"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {customer.status}
                      </span>

                    </td>

                    <td className="p-4 text-right">

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();

                          navigate(
                            `/customers/${customer.id}`
                          );
                        }}
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
                      >
                        <Eye size={17} />
                        View
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

