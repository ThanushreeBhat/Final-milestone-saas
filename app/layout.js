import Sidebar from "./components/sidebar";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 bg-gray-50 min-h-screen p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
