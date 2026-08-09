import { useState } from "react";
import axios from "axios";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const { data } = await axios.post(
          "http://localhost:3000/api/auth/login",
          {
            email,
            password,
          }
        );

        localStorage.setItem(
          "token",
          data.token
        );

        window.location.href =
          "/dashboard";
      } else {
        await axios.post(
          "http://localhost:3000/api/auth/register",
          {
            name,
            email,
            password,
            role: "ADMIN",
          }
        );

        alert("Account created");
        setIsLogin(true);
      }
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">

        {/* Left Panel */}

        <div className="bg-slate-900 text-white p-12 hidden lg:flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gray-100 tracking-tight">
              FundsRoom ERP
            </h1>

            <p className="mt-4 text-slate-300 leading-relaxed">
              Manage customers,
              inventory, sales challans
              and warehouse operations
              from one centralized platform.
            </p>
          </div>

          <div className="space-y-4 text-slate-300">
            <div>
              Customer Relationship Management
            </div>

            <div>
              Product & Inventory Tracking
            </div>

            <div>
              Sales Challan Generation
            </div>

            <div>
              Warehouse Operations
            </div>
          </div>
        </div>

        {/* Right Panel */}

        <div className="p-10 lg:p-14">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              {isLogin
                ? "Sign In"
                : "Create Account"}
            </h2>

            <p className="text-slate-500 mt-2">
              Welcome to FundsRoom ERP
            </p>
          </div>

          <div className="flex bg-slate-100 rounded-xl p-1 mb-8">
            <button
              onClick={() =>
                setIsLogin(true)
              }
              className={`flex-1 py-3 rounded-lg font-medium transition ${
                isLogin
                  ? "bg-white shadow-sm"
                  : ""
              }`}
            >
              Login
            </button>

            <button
              onClick={() =>
                setIsLogin(false)
              }
              className={`flex-1 py-3 rounded-lg font-medium transition ${
                !isLogin
                  ? "bg-white shadow-sm"
                  : ""
              }`}
            >
              Signup
            </button>
          </div>

          <form
            onSubmit={submitHandler}
            className="space-y-5"
          >
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="admin@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-medium transition"
            >
              {isLogin
                ? "Login"
                : "Create Account"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            FundsRoom ERP • Internal Operations Platform
          </div>
        </div>
      </div>
    </div>
  );
}