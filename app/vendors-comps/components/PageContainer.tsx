import React from 'react';
import Header from './Header';
interface PageContainerProps {
  children: React.ReactNode;
}
const PageContainer = ({
  children
}: PageContainerProps) => {
  return <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6">{children}</div>
    </div>;
};
export default PageContainer;