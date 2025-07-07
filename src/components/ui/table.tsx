import React, { ReactNode } from 'react';

export const Table: React.FC<{ children: ReactNode }> = ({ children }) => <table>{children}</table>;
export const TableBody: React.FC<{ children: ReactNode }> = ({ children }) => <tbody>{children}</tbody>;
export const TableCell: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => <td className={className}>{children}</td>;
export const TableHead: React.FC<{ children: ReactNode }> = ({ children }) => <th>{children}</th>;
export const TableHeader: React.FC<{ children: ReactNode }> = ({ children }) => <thead>{children}</thead>;
export const TableRow: React.FC<{ children: ReactNode }> = ({ children }) => <tr>{children}</tr>;
