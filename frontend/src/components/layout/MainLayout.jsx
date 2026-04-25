import Navbar from './Navbar';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
