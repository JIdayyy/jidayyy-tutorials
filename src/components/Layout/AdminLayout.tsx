/* eslint-disable react/function-component-definition */
/* eslint-disable react/self-closing-comp */

interface IProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: IProps) => {
  return <div className="w-full flex flex-col">{children}</div>;
};

export default AdminLayout;
