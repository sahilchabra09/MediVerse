'use client';

import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, InfoWindow, Circle, Marker } from '@react-google-maps/api';
import LoadingScreen from '@/components/LoadingScreen';

interface Hospital {
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  distance: string;
}

export default function HospitalsNearMe() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [userAddress, setUserAddress] = useState<string>('');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const mapContainerStyle = {
    width: '100%',
    height: '500px'
  };

  const mapOptions = {
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      },
      {
        featureType: "poi.medical",
        elementType: "labels",
        stylers: [{ visibility: "on" }]
      }
    ]
  };

  // Function to get address from coordinates
  const getAddressFromCoords = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.results && data.results[0]) {
        setUserAddress(data.results[0].formatted_address);
      }
    } catch (error) {
      console.error('Error getting address:', error);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
          getAddressFromCoords(userPos.lat, userPos.lng);
          fetchNearbyHospitals(userPos.lat, userPos.lng);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoading(false);
        },
        // Adding high accuracy options
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }
  }, []);

  const fetchNearbyHospitals = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `/api/nearby-hospitals?lat=${latitude}&lng=${longitude}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Raw API response:', data); // Debug log
      
      if (!data.hospitals || !Array.isArray(data.hospitals)) {
        console.error('Invalid hospitals data format:', data);
        setHospitals([]);
        return;
      }
      
      setHospitals(data.hospitals);
      console.log('Set hospitals state to:', data.hospitals); // Debug log
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      setHospitals([]); // Ensure we set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  // Add onLoad handler
  const handleMapLoad = (map: google.maps.Map) => {
    setIsMapLoaded(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingScreen />
      </div>
    );
  }

  if (!userLocation) {
    return (
      <div className="flex justify-center items-center h-screen">
        Please enable location services to use this feature.
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-950 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-white">Hospitals Near Me</h1>
      
      <div className="rounded-lg overflow-hidden shadow-lg">
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
          libraries={['marker']}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={userLocation}
            zoom={15}
            options={mapOptions}
            onLoad={handleMapLoad}
          >
            {/* User's location marker */}
            {userLocation && isMapLoaded && (
              <>
                <Marker
                  position={userLocation}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: '#4285F4',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 2,
                  }}
                  onClick={() => setShowUserInfo(true)}
                />
                {showUserInfo && (
                  <InfoWindow
                    position={userLocation}
                    onCloseClick={() => setShowUserInfo(false)}
                  >
                    <div className="bg-white p-2 rounded">
                      <h3 className="font-semibold text-gray-900">Your Location</h3>
                      <p className="text-sm text-gray-700">{userAddress}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Lat: {userLocation.lat.toFixed(6)}<br />
                        Lng: {userLocation.lng.toFixed(6)}
                      </p>
                    </div>
                  </InfoWindow>
                )}
              </>
            )}

            {/* Hospital markers */}
            {hospitals.map((hospital, index) => (
              <Marker
                key={index}
                position={hospital.location}
                icon={{
                  url: 'https://maps.google.com/mapfiles/ms/icons/hospital.png'
                }}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>

      {/* Nearest Hospitals List - Updated styling */}
      <div className="mt-6 bg-black rounded-lg shadow">
        <h2 className="text-xl font-semibold p-4 border-b border-gray-700 text-white">5 Nearest Hospitals</h2>
        {hospitals.length > 0 ? (
          <div className="divide-y divide-gray-700">
            {hospitals.slice(0, 5).map((hospital, index) => (
              <div 
                key={index}
                className="p-4 hover:bg-gray-800 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-lg text-white">{hospital.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Distance: <span className="font-medium">{hospital.distance}</span>
                    </p>
                  </div>
                  <button 
                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${hospital.location.lat},${hospital.location.lng}`, '_blank')}
                    className="px-4 py-2 text-sm text-blue-400 hover:bg-gray-700 rounded-md transition-colors"
                  >
                    Get Directions
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-400">
            No hospitals found nearby
          </div>
        )}
      </div>
    </div>
  );
}
