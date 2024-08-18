"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Lock, Trash2, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Changed from 'next/router'

const SettingsPage = () => {
  const { data: session, update } = useSession();
  const router = useRouter(); // This is now from 'next/navigation'
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">Please log in to view your settings.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const showNotification = (message: any, type: any) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  const handleUpdateEmail = async () => {
    try {
      const response = await fetch("/api/account/accountSettings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          password: currentPassword,
          newEmail: newEmail,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        showNotification("Email updated successfully", "success");
        update(); // Update the session
      } else {
        showNotification(data.error || "Failed to update email", "error");
      }
    } catch (error) {
      showNotification("An unexpected error occurred", "error");
    }
  };

  const handleUpdatePassword = async () => {
    try {
      const response = await fetch("/api/account/accountSettings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          password: currentPassword,
          newPassword: newPassword,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        showNotification("Password updated successfully", "success");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        showNotification(data.error || "Failed to update password", "error");
      }
    } catch (error) {
      showNotification("An unexpected error occurred", "error");
    }
  };
  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        const response = await fetch("/api/account/delete", {
          method: "DELETE",
          credentials: "include", // This ensures cookies are sent with the request
        });

        if (response.ok) {
          console.log("Account marked for deletion successfully");
          showNotification(
            "Your account has been marked for deletion. It will be removed from our system soon.",
            "success"
          );
          router.push("/"); // Redirect to home page
        } else {
          const data = await response.json();
          console.error("Delete account error:", data.error);
          showNotification(
            data.error || "Failed to process deletion request",
            "error"
          );
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        showNotification("An unexpected error occurred", "error");
      }
    }
  };

  return (
    <div className="flex flex-col container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-16">Settings</h1>
      {notification.message && (
        <div
          className={`mb-4 p-2 rounded ${
            notification.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {notification.message}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mt-2">
              <Mail className="mr-2" />
              <span>{session.user.email}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2" />
              Change Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="email"
              placeholder="New Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="mb-2"
            />
            <Input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mb-2"
            />
            <Button onClick={handleUpdateEmail}>Update Email</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="mr-2" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mb-2"
            />
            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mb-2"
            />
            <Button onClick={handleUpdatePassword}>Update Password</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trash2 className="mr-2" />
              Delete Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Warning: This action cannot be undone.</p>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>

      <Button asChild variant="outline" className="mt-8">
        <Link href="/">
          <Home className="mr-2" /> Back to Home
        </Link>
      </Button>
    </div>
  );
};

export default SettingsPage;
