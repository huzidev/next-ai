import React from "react";
import Header from "../layout/Header";

type FormLayoutProps = {
  children: React.ReactNode;
};

const FormLayout: React.FC<FormLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <Header />
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default FormLayout;
