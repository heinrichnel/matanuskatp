import React from 'react';

interface PageWrapperProps {
  title: string;
  children: React.ReactNode;
}

/**
 * PageWrapper
 *
 * A PageWrapper component
 *
 * @example
 * ```tsx
 * <PageWrapper title="example">
 *   Content
 * </PageWrapper>
 * ```
 *
 * @param props - Component props
 * @param props.title - title of the component
 * @param props.children - children of the component
 * @returns React component
 */
const PageWrapper: React.FC<PageWrapperProps> = ({ title, children }) => {
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
      <div className="bg-white shadow rounded-lg p-6">{children}</div>
    </div>
  );
};

export default PageWrapper;
