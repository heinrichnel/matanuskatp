import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const WorkshopPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Workshop Operations</h1>
          <p className="text-gray-600">Manage workshop activities, job cards, and maintenance</p>
        </div>
      </div>

      {/* Nested routes will be rendered here */}
      <Outlet />
    </div>
  );
};

export default WorkshopPage;