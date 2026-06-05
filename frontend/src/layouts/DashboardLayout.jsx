// import Sidebar from "../components/common/Sidebar";
// import Navbar from "../components/common/Navbar";

// const DashboardLayout = ({ children }) => {
//   return (
//     <div className="flex min-h-screen bg-black text-white">
//       <Sidebar />

//       <div className="flex-1">
//         <Navbar />

//         <main className="p-6">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;

import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;