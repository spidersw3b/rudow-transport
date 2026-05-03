"use client";

import { useEffect, useState } from "react";

type HealthPayload = {
  issues?: string[];
  configured?: boolean;
};

export function AuthDeploymentBanner() {
  const [issues, setIssues] = useState<string[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/health/auth")
      .then((r) => r.json() as Promise<HealthPayload>)
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data.issues) && data.issues.length > 0) {
          setIssues(data.issues);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!issues?.length) return null;

  return (
    <div className="mb-4 rounded-sm border border-red-300 bg-red-50 px-3 py-2 text-left text-sm text-red-900">
      <p className="font-semibold">Deployment configuration required</p>
      <p className="mt-1 text-xs leading-relaxed opacity-95">
        Sign-in and account creation need the items below. In{" "}
        <strong>Vercel</strong>: Project → Settings → Environment Variables — add each variable for{" "}
        <strong>Production</strong> (and Preview if you use it), then trigger a new deployment.
      </p>
      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs leading-relaxed">
        {issues.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}
