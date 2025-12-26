import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-light-100)] text-[color:var(--color-dark-900)]">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

