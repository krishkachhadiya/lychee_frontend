"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

    // ======================
    // LOGIN
    // ======================

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            // ======================
            // SUCCESS
            // ======================

            if (data.success) {

                // Store JWT token
                localStorage.setItem("adminToken", data.token);

                // Store admin info in sessionStorage (same as before)
                sessionStorage.setItem("adminLoggedIn", "true");
                sessionStorage.setItem("admin", JSON.stringify(data.admin));

                router.push("/admin");

            } else {
                alert(data.message);
            }
        } catch (error) {
            console.log(error);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    // ======================
    // UI
    // ======================

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-section)] p-5">
            <div className="w-full max-w-md bg-[var(--color-card)] shadow-2xl rounded-[var(--radius-xl)] p-10">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-bold text-[var(--color-text)]">Admin Login</h1>
                    <p className="text-[var(--color-text-muted)] mt-3">Login to access dashboard</p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-6">

                    {/* Email */}
                    <div>
                        <label className="block text-[var(--color-text)] font-semibold mb-2">Email</label>
                        <input
                            type="email"
                            placeholder="Enter email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-[var(--color-text)] font-semibold mb-2">Password</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full border border-[var(--color-border-strong)] bg-[var(--color-card)] text-[var(--color-text)] p-4 rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                        />
                    </div>

                    {/* Button */}
                    <button
                        disabled={loading}
                        className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-dark-2)] text-[var(--color-white)] py-4 rounded-[var(--radius-md)] text-lg font-semibold transition disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>
            </div>
        </div>
    );
}
