import "./globals.css";

export const metadata = {
  title: "SkillSpace — Work · Learn · Earn",
  description: "A beginner-friendly platform to work, learn and earn online."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
