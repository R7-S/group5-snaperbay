
export default function Layout({ children }) {
  return (
    <div
      className="min-h-screen w-full
                 bg-white text-gray-900
                 dark:bg-black dark:text-white
                 transition-colors duration-300
                 pt-6"    
    >
      {children}
    </div>
  );
}
