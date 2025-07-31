import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import PlaceSearch from "../../components/PlaceSearch";
import { Location } from "../../types/mapTypes";
import { MapPin, Search } from "lucide-react";

const PlacesApiDemo: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const handlePlaceSelect = (location: Location) => {
    setSelectedLocation(location);
  };

  const openInGoogleMaps = () => {
    if (selectedLocation) {
      const { lat, lng } = selectedLocation;
      window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, "_blank");
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Google Places API Demo</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Place Search</h2>
              </div>
            </CardHeader>
            <CardContent>
              <PlaceSearch onPlaceSelect={handlePlaceSelect} />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Selected Location</h2>
              </div>
            </CardHeader>
            <CardContent>
              {selectedLocation ? (
                <div>
                  <h3 className="font-medium text-lg">{selectedLocation.title}</h3>
                  <p className="text-gray-600 mb-2">{selectedLocation.address}</p>
                  <div className="text-sm text-gray-500 mb-4">
                    <p>Latitude: {selectedLocation.lat.toFixed(6)}</p>
                    <p>Longitude: {selectedLocation.lng.toFixed(6)}</p>
                    {selectedLocation.info && <p>Type: {selectedLocation.info}</p>}
                  </div>
                  <Button onClick={openInGoogleMaps} variant="primary" className="w-full">
                    Open in Google Maps
                  </Button>
                </div>
              ) : (
                <div className="text-gray-500 text-center py-6">
                  <MapPin className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>Search for and select a location to see its details here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">How to Use the Places API</h2>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p>
                This demo showcases the Google Places API integration in the application. You can:
              </p>
              <ul>
                <li>Search for locations, businesses, and points of interest</li>
                <li>Select from search results to get detailed location information</li>
                <li>Use the selected location in your application logic</li>
              </ul>

              <h3>Developer Notes</h3>
              <p>To use this functionality in your own components:</p>
              <pre className="bg-gray-100 p-4 rounded">
                {`import { useGooglePlaces } from '../hooks/useGooglePlaces';

const YourComponent = () => {
  const {
    findPlaceFromText,
    places,
    loading,
    error
  } = useGooglePlaces();

  // Search for places
  await findPlaceFromText({
    input: "Airport",
    fields: ["name", "formatted_address", "geometry"]
  });

  // Access the results
  console.log(places);
};`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlacesApiDemo;
