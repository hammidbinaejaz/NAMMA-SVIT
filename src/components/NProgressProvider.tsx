"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// Configure NProgress
if (typeof window !== "undefined") {
  NProgress.configure({ showSpinner: false, trickleSpeed: 100 });
}

function NProgressInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      NProgress.start();
      const timer = setTimeout(() => NProgress.done(), 200);
      return () => {
        clearTimeout(timer);
        NProgress.done();
      };
    }
  }, [pathname, mounted]);

  return <>{children}</>;
}

export default function NProgressProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={children}>
      <NProgressInner>{children}</NProgressInner>
    </Suspense>
  );
}

