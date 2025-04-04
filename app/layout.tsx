import { Analytics } from "@vercel/analytics/react"

export const metadata = {
  title: "MCGogo Enemy Predictor",
  description: "Prediksi musuh berikutnya di Magic Chess",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Analytics />
    </html>
  );
}
