import React from 'react';
import ApplicantInfoCard from '@/components/ui/ApplicantInfoCard';

export default function ApplicantInfoDemo() {
  const sampleApplicant = {
    fullName: "Jordan Wilson",
    applicationFor: "Frontend Developer",
    email: "jordan.wilson@example.com",
    salaryExpectation: "$95,000",
    about: "Experienced frontend developer with 5+ years of experience in React, TypeScript, and modern web frameworks. Passionate about creating intuitive user interfaces and optimizing web performance.",
    attachments: [
      { file: "jordan_wilson_resume.pdf", size: "1.8mb" },
      { file: "portfolio_2023.pdf", size: "3.2mb" },
      { file: "reference_letters.zip", size: "4.7mb" }
    ]
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Applicant Information Card Demo</h1>
      <div className="mb-8">
        <ApplicantInfoCard {...sampleApplicant} />
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Default Values Demo</h2>
      <ApplicantInfoCard 
        fullName="Margot Foster"
        applicationFor="Backend Developer"
        email="margotfoster@example.com"
        salaryExpectation="$120,000"
        about="Fugiat ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur qui ipsum aliquip consequat sint."
        attachments={[
          { file: "resume_back_end_developer.pdf", size: "2.4mb" },
          { file: "coverletter_back_end_developer.pdf", size: "4.5mb" }
        ]}
      />
    </div>
  );
}
