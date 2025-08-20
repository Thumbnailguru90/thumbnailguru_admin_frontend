import React from "react";
import { Outlet } from "react-router-dom"; // ✅ import this

import Sidebar from "./Sidebar";
import Footer from "../../common/inner/Footer";
import Header from "../../common/inner/Header";
import StaffSidebar from "./StaffSidebar"; // ✅ import staff sidebar
import SubAdminSidebar from "./SubAdminSidebar";

const Layout = () => {
    const role = localStorage.getItem("role");

  const renderSidebar = () => {
    if (role === "admin") return <Sidebar />;
    if (role === "staff") return <StaffSidebar />;
    if (role === "subadmin") return <SubAdminSidebar />;
    return null; // no sidebar for unknown role
  };
  return (
    <div className="flex h-screen">
      <div className="hidden md:block md:w-[25%] lg:w-[20%]">
               <div className="md:w-[25%] lg:w-[20%] fixed">
          {renderSidebar()} {/* ✅ Conditional sidebar */}
        </div>

      </div>

      <div className="md:w-[75%] lg:w-[80%] w-full flex flex-col justify-between">
        <div>
          <div className="sticky top-0 z-10">
            <Header />
          </div>
          <div className="p-6">
            <main>
              <Outlet /> {/* ✅ Renders child route components here */}
            </main>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;



// import React from "react";
// import { Outlet } from "react-router-dom"; // ✅ import this

// import Sidebar from "./Sidebar";
// import Footer from "../../common/inner/Footer";
// import Header from "../../common/inner/Header";

// const Layout = () => {
//   return (
//     <div className="flex h-screen">
//       <div className="hidden md:block md:w-[25%] lg:w-[20%]">
//         <div className="md:w-[25%] lg:w-[20%] fixed">
//           <Sidebar />
//         </div>
//       </div>

//       <div className="md:w-[75%] lg:w-[80%] w-full flex flex-col justify-between">
//         <div>
//           <div className="sticky top-0 z-10">
//             <Header />
//           </div>
//           <div className="p-6">
//             <main>
//               <Outlet /> {/* ✅ Renders child route components here */}
//             </main>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default Layout;
