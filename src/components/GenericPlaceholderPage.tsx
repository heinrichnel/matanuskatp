import React from "react";
import Card, { CardContent, CardHeader } from "./ui/Card";
import { Construction, ArrowLeft } from "lucide-react";
import Button from "./ui/Button";
import { useNavigate } from "react-router-dom";

interface GenericPlaceholderPageProps {
  title: string;
  description?: string;
}

const GenericPlaceholderPage: React.FC<GenericPlaceholderPageProps> = ({
  title,
  description = "This feature is currently in development.",
}) => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-2">{description}</p>
        </div>
        <Button variant="outline" onClick={onClick || (() => {})} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Coming Soon</h2>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <Construction className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-2">{title}</p>
            <p className="text-sm max-w-md mx-auto leading-relaxed">
              {description} Please check back later or contact your administrator for more
              information about when this feature will be available.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Construction className="w-5 h-5 text-blue-600 mt-0.5" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Development Status</h3>
            <p className="text-sm text-blue-700 mt-1">
              This page is a placeholder and will be replaced with the actual {title.toLowerCase()}
              functionality in a future update.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenericPlaceholderPage;
