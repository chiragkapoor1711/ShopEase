"use client";

import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
} from "lucide-react";

export default function ProfilePage() {

  const [user, setUser] = useState(null);

  useEffect(() => {

    async function fetchUser() {

      const res = await fetch("/api/auth/me");

      const data = await res.json();

      if (data.success) {
        setUser(data.user);
      }

    }

    fetchUser();

  }, []);

  if (!user) {

    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  }

  return (

    <section className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12">

      <div className="max-w-3xl mx-auto">

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">

          <div className="flex flex-col items-center">

            <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">

              <User
                size={50}
                className="text-blue-600"
              />

            </div>

            <h1 className="mt-4 text-3xl font-bold dark:text-white">
              My Profile
            </h1>

            <p className="text-gray-500">
              Welcome back, {user.full_name}
            </p>

          </div>

          <div className="mt-10 space-y-6">

            <div className="flex items-center gap-4">

              <User className="text-blue-600" />

              <div>

                <p className="text-sm text-gray-500">
                  Full Name
                </p>

                <h3 className="font-semibold dark:text-white">
                  {user.full_name}
                </h3>

              </div>

            </div>

            <div className="flex items-center gap-4">

              <Mail className="text-blue-600" />

              <div>

                <p className="text-sm text-gray-500">
                  Email
                </p>

                <h3 className="font-semibold dark:text-white">
                  {user.email}
                </h3>

              </div>

            </div>

            <div className="flex items-center gap-4">

              <Phone className="text-blue-600" />

              <div>

                <p className="text-sm text-gray-500">
                  Mobile
                </p>

                <h3 className="font-semibold dark:text-white">
                  {user.mobile}
                </h3>

              </div>

            </div>

            <div className="flex items-center gap-4">

              <Shield className="text-blue-600" />

              <div>

                <p className="text-sm text-gray-500">
                  Role
                </p>

                <h3 className="font-semibold capitalize dark:text-white">
                  {user.role}
                </h3>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>

  );

}