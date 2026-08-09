import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Building2,
  MapPin,
  FileText,
  Calendar,
  MessageSquare,
  Plus,
  Loader2,
} from "lucide-react";

import { api } from "../lib/api";

interface Customer {
  id: string;
  name: string;
  mobile: string;
  email: string;
  businessName: string;
  gstNumber?: string;
  customerType: string;
  address: string;
  status: string;
  followUpDate?: string;
  notes?: string;
}

interface FollowUp {
  id: string;
  customerId: string;
  note: string;
  createdAt: string;
}

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] =
    useState<Customer | null>(null);

  const [followUps, setFollowUps] =
    useState<FollowUp[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [followUpNote, setFollowUpNote] =
    useState("");

  const [addingFollowUp, setAddingFollowUp] =
    useState(false);

  useEffect(() => {
    if (!id) return;

    fetchCustomer();
    fetchFollowUps();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      const { data } =
        await api.get(
          `/customers/${id}`
        );

      setCustomer(data.customer);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowUps = async () => {
    try {
      const { data } =
        await api.get(
          `/customers/${id}/followups`
        );

      setFollowUps(
        data.followUps || []
      );
    } catch (error) {
      console.error(
        "Failed to fetch follow-ups",
        error
      );
    }
  };

  const addFollowUp = async () => {
    if (!followUpNote.trim()) {
      alert(
        "Please enter a follow-up note"
      );

      return;
    }

    try {
      setAddingFollowUp(true);

      await api.post(
        `/customers/${id}/followups`,
        {
          note: followUpNote,
        }
      );

      setFollowUpNote("");

      await fetchFollowUps();
    } catch (error) {
      console.error(error);

      alert(
        "Failed to add follow-up"
      );
    } finally {
      setAddingFollowUp(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2
            className="animate-spin"
            size={22}
          />

          Loading customer...
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="bg-white rounded-2xl border p-8 text-center">
        <h2 className="text-xl font-semibold">
          Customer not found
        </h2>

        <button
          onClick={() =>
            navigate("/customers")
          }
          className="mt-4 bg-slate-900 text-white px-5 py-3 rounded-xl"
        >
          Back to Customers
        </button>
      </div>
    );
  }

  const statusClass =
    customer.status === "ACTIVE"
      ? "bg-green-100 text-green-700"
      : customer.status === "LEAD"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex items-center gap-4">

        <button
          onClick={() =>
            navigate("/customers")
          }
          className="
            p-3
            rounded-xl
            border
            border-slate-200
            hover:bg-slate-100
            transition
          "
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Customer Details
          </h1>

          <p className="text-slate-500 mt-1">
            View customer information and CRM activity.
          </p>
        </div>

      </div>


      {/* Profile */}

      <div className="bg-slate-900 text-white rounded-3xl p-8">

        <div className="flex items-center gap-5">

          <div className="
            w-16
            h-16
            rounded-2xl
            bg-white/10
            flex
            items-center
            justify-center
          ">
            <User size={32} />
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              {customer.name}
            </h2>

            <p className="text-slate-300 mt-1">
              {customer.businessName ||
                "No business name"}
            </p>
          </div>

          <div className="ml-auto">

            <span
              className={`
                px-4
                py-2
                rounded-full
                text-sm
                font-medium
                ${statusClass}
              `}
            >
              {customer.status}
            </span>

          </div>

        </div>

      </div>


      {/* Information */}

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Contact */}

        <div className="
          bg-white
          border
          border-slate-200
          rounded-2xl
          p-6
          shadow-sm
        ">

          <h3 className="text-lg font-semibold mb-5">
            Contact Information
          </h3>

          <div className="space-y-5">

            <div className="flex gap-4">

              <Phone
                size={20}
                className="text-slate-500 mt-1"
              />

              <div>
                <p className="text-sm text-slate-500">
                  Mobile Number
                </p>

                <p className="font-medium mt-1">
                  {customer.mobile ||
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

                <p className="font-medium mt-1">
                  {customer.email ||
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

                <p className="font-medium mt-1">
                  {customer.address ||
                    "Not provided"}
                </p>
              </div>

            </div>

          </div>

        </div>


        {/* Business */}

        <div className="
          bg-white
          border
          border-slate-200
          rounded-2xl
          p-6
          shadow-sm
        ">

          <h3 className="text-lg font-semibold mb-5">
            Business Information
          </h3>

          <div className="space-y-5">

            <div className="flex gap-4">

              <Building2
                size={20}
                className="text-slate-500 mt-1"
              />

              <div>
                <p className="text-sm text-slate-500">
                  Business Name
                </p>

                <p className="font-medium mt-1">
                  {customer.businessName ||
                    "Not provided"}
                </p>
              </div>

            </div>


            <div className="flex gap-4">

              <FileText
                size={20}
                className="text-slate-500 mt-1"
              />

              <div>
                <p className="text-sm text-slate-500">
                  GST Number
                </p>

                <p className="font-medium mt-1">
                  {customer.gstNumber ||
                    "Not provided"}
                </p>
              </div>

            </div>


            <div>

              <p className="text-sm text-slate-500">
                Customer Type
              </p>

              <p className="font-medium mt-1">
                {customer.customerType}
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* Follow Up Date */}

      <div className="
        bg-white
        border
        border-slate-200
        rounded-2xl
        p-6
        shadow-sm
      ">

        <div className="flex items-center gap-3 mb-5">

          <Calendar
            size={22}
            className="text-slate-600"
          />

          <h3 className="text-lg font-semibold">
            Scheduled Follow-up
          </h3>

        </div>

        <p className="text-sm text-slate-500">
          Follow-up Date
        </p>

        <p className="font-medium mt-1">

          {customer.followUpDate
            ? new Date(
                customer.followUpDate
              ).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )
            : "No follow-up scheduled"}

        </p>

      </div>


      {/* Follow-up History */}

      <div className="
        bg-white
        border
        border-slate-200
        rounded-2xl
        p-6
        shadow-sm
      ">

        <div className="
          flex
          items-center
          justify-between
          mb-6
        ">

          <div className="flex items-center gap-3">

            <div className="
              p-3
              bg-blue-100
              text-blue-600
              rounded-xl
            ">
              <MessageSquare size={22} />
            </div>

            <div>

              <h3 className="text-lg font-semibold">
                Follow-up History
              </h3>

              <p className="text-sm text-slate-500">
                Keep track of customer interactions.
              </p>

            </div>

          </div>

          <span className="
            bg-slate-100
            text-slate-700
            px-3
            py-1
            rounded-full
            text-sm
            font-medium
          ">
            {followUps.length} notes
          </span>

        </div>


        {/* Add Note */}

        <div className="
          bg-slate-50
          rounded-2xl
          p-5
          mb-6
        ">

          <label className="
            block
            text-sm
            font-medium
            text-slate-700
            mb-2
          ">
            Add Follow-up Note
          </label>

          <textarea
            value={followUpNote}
            onChange={(e) =>
              setFollowUpNote(
                e.target.value
              )
            }
            placeholder="e.g. Called customer regarding pending order..."
            rows={4}
            className="
              w-full
              border
              border-slate-200
              rounded-xl
              p-3
              resize-none
              focus:outline-none
              focus:ring-2
              focus:ring-slate-900
            "
          />

          <button
            onClick={addFollowUp}
            disabled={addingFollowUp}
            className="
              mt-3
              bg-slate-900
              hover:bg-slate-800
              disabled:opacity-50
              text-white
              px-5
              py-3
              rounded-xl
              flex
              items-center
              gap-2
              transition
            "
          >

            {addingFollowUp ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Adding...
              </>
            ) : (
              <>
                <Plus size={18} />

                Add Note
              </>
            )}

          </button>

        </div>


        {/* History */}

        {followUps.length === 0 ? (

          <div className="
            text-center
            py-10
            text-slate-500
          ">

            <MessageSquare
              size={40}
              className="mx-auto mb-3 text-slate-300"
            />

            <p className="font-medium">
              No follow-up notes yet
            </p>

            <p className="text-sm mt-1">
              Add your first customer interaction above.
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {followUps.map(
              (followUp) => (

                <div
                  key={followUp.id}
                  className="
                    border
                    border-slate-200
                    rounded-xl
                    p-5
                    hover:border-slate-300
                    transition
                  "
                >

                  <div className="
                    flex
                    items-start
                    justify-between
                    gap-4
                  ">

                    <div className="flex gap-3">

                      <div className="
                        w-9
                        h-9
                        rounded-full
                        bg-slate-100
                        flex
                        items-center
                        justify-center
                        shrink-0
                      ">
                        <MessageSquare
                          size={17}
                          className="text-slate-600"
                        />
                      </div>

                      <p className="
                        text-slate-700
                        leading-relaxed
                      ">
                        {followUp.note}
                      </p>

                    </div>

                    <span className="
                      text-xs
                      text-slate-400
                      whitespace-nowrap
                    ">
                      {new Date(
                        followUp.createdAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>


      {/* Existing Notes */}

      <div className="
        bg-white
        border
        border-slate-200
        rounded-2xl
        p-6
        shadow-sm
      ">

        <h3 className="text-lg font-semibold mb-4">
          Customer Notes
        </h3>

        <div className="
          bg-slate-50
          rounded-xl
          p-4
          text-slate-700
        ">
          {customer.notes ||
            "No general notes added for this customer."}
        </div>

      </div>

    </div>
  );
}