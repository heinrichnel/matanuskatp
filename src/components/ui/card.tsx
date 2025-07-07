import React from 'react';

export const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => <div>{children}</div>;
export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => <div className={className}>{children}</div>;
export const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => <div>{children}</div>;
export const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => <h3>{children}</h3>;
