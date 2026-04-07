import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CartProvider } from "../context/CartContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="m-0 p-0">
      <body className="text-white m-0 p-0 overflow-x-hidden bg-[#020617]">
        <CartProvider>
          <div className="min-h-screen">
            <Header />
            <div>
              {children}
            </div>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}