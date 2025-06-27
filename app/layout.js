import { Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500"] });

export const metadata = {
  title: "ECOMM WEB",
  description: "E-Commerce with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}> 
      <body className={`${outfit.className} antialiased text-gray-700`}>
        <ClerkProvider>
          <AppContextProvider>
            <Toaster />
            {children}
          </AppContextProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
