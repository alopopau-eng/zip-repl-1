"use client";
import { addData } from "../lib/firebase";
import { setupOnlineStatus } from "../lib/utils";
import { useCallback, useEffect, useState, useRef } from "react";
import { FullPageLoader } from "./Loader";

function generateVisitorId(): string {
  return `dddz-app-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
}

function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "";

  let storedId = localStorage.getItem("visitor");
  if (storedId && storedId.startsWith("dddz-app-")) {
    return storedId;
  }

  const newId = generateVisitorId();
  localStorage.setItem("visitor", newId);
  return newId;
}

export function Init() {
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  const initializeVisitor = useCallback(async () => {
    if (initialized.current) return;
    initialized.current = true;

    const visitorId = getOrCreateVisitorId();
    if (!visitorId) {
      setLoading(false);
      return;
    }
    try {
      localStorage.setItem("country", country);

      await addData({
        createdDate: new Date().toISOString(),
        id: visitorId,
        country: "زائر ",
        isHidden: false,
        action: "page_load",
        currentPage: "الرئيسية",
      });

      setupOnlineStatus(visitorId);
    } catch (error) {
      console.error("Error during initialization:", error);
      setupOnlineStatus(visitorId);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeVisitor();
  }, [initializeVisitor]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const visitorId = localStorage.getItem("visitor");
      if (visitorId) {
        navigator.sendBeacon &&
          navigator.sendBeacon(
            "/api/offline",
            JSON.stringify({ id: visitorId }),
          );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return <>{loading && <FullPageLoader />}</>;
}
