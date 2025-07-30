import React from "react";

interface ApplicantInfoCardProps {
  name: string;
  email: string;
  phone?: string;
  // Voeg meer fields by soos jy nodig het
}

const ApplicantInfoCard: React.FC<ApplicantInfoCardProps> = ({ name, email, phone }) => (
  <div className="bg-white rounded-xl border shadow p-6">
    <h3 className="text-lg font-semibold">{name}</h3>
    <div className="text-sm text-gray-500">{email}</div>
    {phone && <div className="text-sm text-gray-500">{phone}</div>}
  </div>
);

export default ApplicantInfoCard;
