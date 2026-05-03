import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? (
        <p className="mb-2 font-body text-xs font-bold uppercase tracking-[0.2em] text-rt-navy">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-3xl font-bold text-rt-navy md:text-4xl">{title}</h2>
    </div>
  );
}
