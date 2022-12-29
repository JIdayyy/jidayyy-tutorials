/* eslint-disable react/function-component-definition */
/* eslint-disable react/self-closing-comp */

import AdminNavbar from "../Navbar";
import Sidebar from "../Sidebar";

interface IProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: IProps) => {
  return (
    <div className="w-full min-h-screen flex">
      <Sidebar />
      <div className="ml-[100px] w-full flex flex-col">
        <AdminNavbar />
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
