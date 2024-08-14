"use client";
import React from "react";
import { useSession } from "next-auth/react";
import Balance from "@/components/Balance";
import Deposit from "@/components/Deposit";
import styles from "@/styles/Profile.module.css";

const ProfilePage = () => {
  const { data: session } = useSession();

  if (!session) {
    return <div>Please sign in to view your profile.</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <h1>Your Profile</h1>
      <p>Email: {session.user.email}</p>
      <Balance />
      <Deposit />
    </div>
  );
};

export default ProfilePage;
