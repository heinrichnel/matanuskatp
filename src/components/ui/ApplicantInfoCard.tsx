import React from 'react';
import {
  User,
  Briefcase,
  Mail,
  DollarSign,
  AlignLeft,
  Paperclip,
  Download,
} from "lucide-react";

interface ApplicantInfoCardProps {
  fullName: string;
  applicationFor: string;
  email: string;
  salaryExpectation: string;
  about: string;
  attachments: Array<{file: string, size: string}>;
}

export const ApplicantInfoCard: React.FC<ApplicantInfoCardProps> = ({
  fullName = "Margot Foster",
  applicationFor = "Backend Developer",
  email = "margotfoster@example.com",
  salaryExpectation = "$120,000",
  about = "Fugiat ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur qui ipsum aliquip consequat sint.",
  attachments = [
    { file: "resume_back_end_developer.pdf", size: "2.4mb" },
    { file: "coverletter_back_end_developer.pdf", size: "4.5mb" },
  ],
}) => {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow rounded p-6">
      <h2 className="text-lg font-semibold">Applicant Information</h2>
      <p className="text-sm text-gray-500 mb-6">
        Personal details and application.
      </p>

      <div className="divide-y divide-gray-200">
        {/* Row: Full Name */}
        <div className="py-3 flex justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <User className="w-4 h-4" />
            <span>Full name</span>
          </div>
          <div className="text-gray-800 font-medium">{fullName}</div>
        </div>

        {/* Row: Application for */}
        <div className="py-3 flex justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <Briefcase className="w-4 h-4" />
            <span>Application for</span>
          </div>
          <div className="text-gray-800 font-medium">{applicationFor}</div>
        </div>

        {/* Row: Email */}
        <div className="py-3 flex justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <Mail className="w-4 h-4" />
            <span>Email address</span>
          </div>
          <div className="text-gray-800 font-medium">{email}</div>
        </div>

        {/* Row: Salary */}
        <div className="py-3 flex justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <DollarSign className="w-4 h-4" />
            <span>Salary expectation</span>
          </div>
          <div className="text-gray-800 font-medium">{salaryExpectation}</div>
        </div>

        {/* Row: About */}
        <div className="py-3">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <AlignLeft className="w-4 h-4" />
            <span>About</span>
          </div>
          <p className="text-gray-700 text-sm leading-snug">{about}</p>
        </div>

        {/* Row: Attachments */}
        <div className="py-3">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Paperclip className="w-4 h-4" />
            <span>Attachments</span>
          </div>

          <div className="space-y-2">
            {attachments.map(({ file, size }) => (
              <div
                key={file}
                className="flex justify-between items-center bg-gray-100 p-2 rounded"
              >
                <div className="text-sm text-gray-700 flex items-center gap-2">
                  <Paperclip className="w-4 h-4" />
                  {file}
                  <span className="text-gray-400 text-xs">({size})</span>
                </div>
                <button className="text-blue-600 text-sm font-medium flex items-center gap-1" onClick={onClick}}>
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantInfoCard;
