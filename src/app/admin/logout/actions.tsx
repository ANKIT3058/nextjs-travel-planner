"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useAppStore } from "@/store";

const Actions = ({ deleteCookie }: { deleteCookie: () => Promise<void> }) => {
  const { logOut } = useAppStore();

  useEffect(() => {
    const handleLogout = async () => {
      await deleteCookie();
      logOut(); // Clear the Zustand store
      redirect("/");
    };
    
    handleLogout();
  }, [deleteCookie, logOut]);

  return null;
};

export default Actions;