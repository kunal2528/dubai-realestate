import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import "./advisor-interactions.css";

const display = Cormorant_Garamond({ variable: "--font-display", subsets: ["latin"], weight: ["400", "500", "600"] });
const sans = DM_Sans({ variable: "--font-sans", subsets: ["latin"] });

export const metadata = {
  title: "HOD AI Property Advisor | Dubai Real Estate",
  description: "Discover Dubai properties that fit your budget, lifestyle, and investment goals with the HOD AI Property Advisor concept demo.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
