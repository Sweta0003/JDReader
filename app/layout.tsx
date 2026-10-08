import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Job Description Reader & Resume Coach",
  description:
    "Analyze LinkedIn job descriptions, get prep topics, and tailor your resume suggestion by suggestion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
