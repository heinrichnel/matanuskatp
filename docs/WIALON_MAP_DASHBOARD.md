# Wialon Map Dashboard

This document provides a comprehensive implementation of a standalone Wialon Map Dashboard using React, Leaflet, and the Wialon SDK.

## Overview

The Wialon Map Dashboard is a self-contained HTML application that provides real-time tracking and management of fleet units through the Wialon telematics platform. This implementation includes:

- Real-time unit tracking on an interactive map
- Unit selection and filtering
- Sensor data monitoring
- Proximity search functionality (find nearest units)
- Detailed logging of events and actions

## Features

- **Interactive Map**: Displays unit locations on a Leaflet-based map
- **Unit Selection**: Choose from available units to track
- **Sensor Information**: View sensor data for selected units
- **Proximity Search**: Find units nearest to a selected unit or map position
- **Distance Calculation**: Calculate distances using either geometric or routing methods
- **Filtering Options**: Filter units by last message time
- **Detailed Logging**: Track events and actions in the log panel

## Implementation

The implementation is a self-contained HTML file that includes all necessary dependencies and code. It uses:

- React and ReactDOM for the UI
- Leaflet for mapping
- Wialon SDK for telematics data
- Tailwind CSS for styling

## Complete Code

Below is the complete HTML implementation that can be used as a standalone application:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wialon Map Dashboard</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Inter Font -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
        }
        /* Leaflet CSS */
        @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');

        #map-container {
            height: 100%;
            width: 100%;
            border-radius: 0.5rem;
        }
        .leaflet-container {
            border-radius: 0.5rem;
        }
    </style>
</head>
<body class="flex flex-col h-screen font-sans bg-gray-100 antialiased">
    <div id="root" class="flex flex-col h-full"></div>

    <!-- React and ReactDOM CDNs -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <!-- Babel for JSX transformation -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <!-- Leaflet JS CDN -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <!-- Wialon SDK -->
    <script src="//hst-api.wialon.com/wsdk/script/wialon.js"></script>

    <script type="text/babel">
        // Self-contained React component code

        const { useState, useEffect, useRef } = React;
        const root = ReactDOM.createRoot(document.getElementById('root'));

        // IMPORTANT: Replace 'YOUR_TOKEN_HERE' with your actual Wialon token
        const WIALON_TOKEN = 'c1099bc37c906fd0832d8e783b60ae0dD9D1A721B294486AC08F8AA3ACAC2D2FD45FF053';

        // The main React component for the Wialon Map Dashboard
        const MapComponent = () => {
            // Refs to hold mutable objects without triggering re-renders
            const mapRef = useRef(null);
            const markerRef = useRef(null);
            const polylineRef = useRef(null);
            const unitEventRef = useRef(null);
            const selectedSensorRef = useRef(null);
            const searchMarkerRef = useRef(null);
            const unitMarkersRef = useRef({});

            // State for UI and data management
            const [units, setUnits] = useState([]);
            const [selectedUnitId, setSelectedUnitId] = useState(null);
            const [logMessages, setLogMessages] = useState([]);
            const [isLoading, setIsLoading] = useState(true);
            const [sensors, setSensors] = useState([]);
            const [isSearching, setIsSearching] = useState(false);
            const [searchPosition, setSearchPosition] = useState(null);
            const [searchResults, setSearchResults] = useState([]);
            const [lastMessageTimeFilter, setLastMessageTimeFilter] = useState(0);
            const [maxUnits, setMaxUnits] = useState(10);
            const [useRouting, setUseRouting] = useState(false);

            const log = (msg) => {
                setLogMessages(prev => [msg, ...prev].slice(0, 50));
            };

            const prettyPrintDistance = (distance) => {
                if (distance < 1000) return Math.ceil(distance) + ' m';
                else return (Math.round(distance / 10) / 100) + ' km';
            };

            const loadUnits = () => {
                if (!window.wialon) {
                    log('Wialon SDK not found. Please make sure the script is included in the HTML.');
                    setIsLoading(false);
                    return;
                }

                log('Initializing Wialon session...');
                const session = wialon.core.Session.getInstance();
                session.initSession('https://hst-api.wialon.com');

                session.loginToken(WIALON_TOKEN, '', (code) => {
                    if (code) {
                        log(`Login error: ${window.wialon.core.Errors.getErrorText(code)}`);
                        setIsLoading(false);
                        return;
                    }
                    log('Logged in successfully. Loading unit data...');

                    const flags = wialon.item.Item.dataFlag.base | wialon.item.Unit.dataFlag.sensors | wialon.item.Unit.dataFlag.lastMessage;

                    session.loadLibrary('unitSensors', function() {
                         session.updateDataFlags([{ type: 'type', data: 'avl_unit', flags: flags, mode: 0 }], (error) => {
                            if (error) {
                                log(`Error loading units: ${wialon.core.Errors.getErrorText(error)}`);
                                setIsLoading(false);
                                return;
                            }
                            const unitsData = session.getItems('avl_unit');
                            setUnits(unitsData);
                            log(`Found ${unitsData.length} units.`);
                            setIsLoading(false);
                            unitsData.forEach(unit => addOrUpdateUnitMarker(unit));
                        });
                    });
                });
            };

            const getSensors = (unitId) => {
                if (!unitId) {
                    setSensors([]);
                    return;
                }
                const session = wialon.core.Session.getInstance();
                const unit = session.getItem(unitId);
                if (unit) {
                    const sens = unit.getSensors();
                    setSensors(Object.values(sens));
                }
            };

            const getSensorInfo = () => {
                const unitId = selectedUnitId;
                const sensorId = selectedSensorRef.current.value;

                if (!unitId || !sensorId) return;

                const session = wialon.core.Session.getInstance();
                const unit = session.getItem(unitId);
                const sens = unit.getSensor(sensorId);
                const result = unit.calculateSensorValue(sens, unit.getLastMessage());

                const sensorValue = result == -348201.3876 ? "N/A" : result;

                log(`Value of ${unit.getName()}'s <b>'${sens.n}'</b> sensor (${sens.t}): ${sensorValue} (${sens.m})`);
            };

            const showUnit = (unitId) => {
                if (!mapRef.current) return;

                const session = wialon.core.Session.getInstance();

                // Clear previous unit's event listener and flags
                if (selectedUnitId) {
                    const prevUnit = session.getItem(selectedUnitId);
                    if (prevUnit && unitEventRef.current) {
                        prevUnit.removeListenerById(unitEventRef.current);
                        session.updateDataFlags([{type: "id", data: selectedUnitId, flags: wialon.item.Unit.dataFlag.lastMessage, mode: 2}]);
                    }
                }

                setSelectedUnitId(unitId);
                getSensors(unitId);

                if (!unitId) return;

                const flags = wialon.item.Unit.dataFlag.lastMessage;

                session.updateDataFlags([{type: "id", data: unitId, flags: flags, mode: 1}], (code) => {
                    if (code) {
                        log(`Error loading unit data: ${wialon.core.Errors.getErrorText(code)}`);
                        return;
                    }

                    const unit = session.getItem(unitId);
                    if (!unit) return;

                    const position = unit.getPosition();
                    if (!position) {
                        log('Selected unit has no position data.');
                        return;
                    }

                    log(`You chose unit: ${unit.getName()}`);

                    // Clean up previous marker and polyline
                    if (markerRef.current) mapRef.current.removeLayer(markerRef.current);
                    if (polylineRef.current) mapRef.current.removeLayer(polylineRef.current);

                    // Create new icon, marker and polyline
                    const icon = L.icon({
                        iconUrl: unit.getIconUrl(32),
                        iconAnchor: [16, 16]
                    });
                    markerRef.current = L.marker({lat: position.y, lng: position.x}, {icon: icon}).addTo(mapRef.current);
                    polylineRef.current = L.polyline([{lat: position.y, lng: position.x}], {color: 'blue'}).addTo(mapRef.current);
                    mapRef.current.setView({lat: position.y, lng: position.x});

                    unitEventRef.current = unit.addListener("messageRegistered", (event) => {
                        const data = event.getData();
                        if (!data.pos) return;

                        const newPosition = {x: data.pos.x, y: data.pos.y};
                        const appended = `Position (x: ${newPosition.x.toFixed(5)}; y: ${newPosition.y.toFixed(5)})`;
                        log(appended);

                        markerRef.current.setLatLng({lat: newPosition.y, lng: newPosition.x});
                        polylineRef.current.addLatLng({lat: newPosition.y, lng: newPosition.x});
                        mapRef.current.setView({lat: newPosition.y, lng: newPosition.x});
                    });
                });
            };

            const addOrUpdateUnitMarker = (unit) => {
                const pos = unit.getPosition();
                if (!pos || !mapRef.current) return;

                const unitId = unit.getId();
                const icon = L.icon({
                    iconUrl: unit.getIconUrl(32),
                    iconAnchor: [16, 16]
                });

                if (unitMarkersRef.current[unitId]) {
                    unitMarkersRef.current[unitId].setLatLng([pos.y, pos.x]);
                } else {
                    const marker = L.marker([pos.y, pos.x], { icon }).addTo(mapRef.current);
                    marker.bindPopup(unit.getName());
                    unitMarkersRef.current[unitId] = marker;
                    marker.on('click', () => {
                        setSelectedUnitId(unitId);
                        searchNearestUnits(unitId);
                    });
                }
            };

            const handleSearchByPosition = () => {
                if (!searchPosition || isSearching) return;
                searchNearestUnits(null, { lat: searchPosition.lat, lon: searchPosition.lng });
            };

            const handleSearchByUnit = () => {
                if (!selectedUnitId || isSearching) return;
                searchNearestUnits(selectedUnitId);
            };

            const searchNearestUnits = (unitId = null, pos = null) => {
                setIsSearching(true);
                setSearchResults([]);

                const session = wialon.core.Session.getInstance();
                let searchPos = pos;
                let excludeUnitId = null;

                if (unitId) {
                    const unit = session.getItem(unitId);
                    if (!unit || !unit.getPosition()) {
                        log('Selected unit has no valid position.');
                        setIsSearching(false);
                        return;
                    }
                    searchPos = { lat: unit.getPosition().y, lon: unit.getPosition().x };
                    excludeUnitId = unitId;
                }

                if (!searchPos) {
                    log('Please select a unit or double-click the map to set a search position.');
                    setIsSearching(false);
                    return;
                }

                mapRef.current.setView([searchPos.lat, searchPos.lon], mapRef.current.getZoom());

                if (searchMarkerRef.current) {
                    searchMarkerRef.current.setLatLng([searchPos.lat, searchPos.lon]);
                } else {
                    searchMarkerRef.current = L.marker([searchPos.lat, searchPos.lon], { zIndexOffset: 1000 }).addTo(mapRef.current);
                }

                const filteredUnits = units.filter(unit => {
                    const unitPos = unit.getPosition();
                    if (!unitPos || unit.getId() === excludeUnitId) return false;
                    const serverTime = session.getServerTime();
                    return (lastMessageTimeFilter === 0) || (serverTime - unitPos.t) < (lastMessageTimeFilter * 60);
                });

                if (filteredUnits.length === 0) {
                    setSearchResults([]);
                    setIsSearching(false);
                    return;
                }

                if (useRouting) {
                    const points = filteredUnits.map(unit => {
                        const unitPos = unit.getPosition();
                        return { lon: unitPos.x, lat: unitPos.y };
                    });

                    log('Calculating routes...');
                    wialon.util.Gis.getOneToManyRoute(searchPos.lat, searchPos.lon, points, (error, data) => {
                        if (error) {
                            log(`Routing error: ${wialon.core.Errors.getErrorText(error)}`);
                            handleGeometricDistance(searchPos, filteredUnits);
                            return;
                        }
                        processResults(searchPos, filteredUnits, data);
                    });
                } else {
                    handleGeometricDistance(searchPos, filteredUnits);
                }
            };

            const handleGeometricDistance = (searchPos, filteredUnits) => {
                const results = filteredUnits.map(unit => {
                    const unitPos = unit.getPosition();
                    const distance = wialon.util.Geometry.getDistance(searchPos.lat, searchPos.lon, unitPos.y, unitPos.x);
                    return { unit, distance };
                });
                processResults(searchPos, results);
            };

            const processResults = (searchPos, unitsWithDistances, routingData = null) => {
                let finalResults;
                if (routingData) {
                    finalResults = unitsWithDistances.map((unit, i) => {
                        const distance = routingData[i].distance ? routingData[i].distance.value : wialon.util.Geometry.getDistance(searchPos.lat, searchPos.lon, unit.getPosition().y, unit.getPosition().x);
                        return { unit, distance };
                    });
                } else {
                    finalResults = unitsWithDistances;
                }

                finalResults.sort((a, b) => a.distance - b.distance);
                const limitedResults = finalResults.slice(0, maxUnits > 0 ? maxUnits : finalResults.length);

                setSearchResults(limitedResults);
                setIsSearching(false);
                log('Search complete.');
            };

            useEffect(() => {
                const map = L.map('map-container').setView([54.68, 25.27], 10);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | © <a href="http://gurtam.com">Gurtam</a>'
                }).addTo(map);

                mapRef.current = map;

                // load units on initial load
                loadUnits();

                // Add a double-click event listener for searching near a position
                map.on('dblclick', (e) => {
                    setSearchPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
                    log(`Position set by double-click: ${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`);
                    searchNearestUnits(null, { lat: e.latlng.lat, lon: e.latlng.lng });
                });

                return () => {
                    if (map) map.remove();
                    if (unitEventRef.current) {
                        const sess = wialon.core.Session.getInstance();
                        const unit = sess.getItem(selectedUnitId);
                        if (unit) unit.removeListenerById(unitEventRef.current);
                    }
                };
            }, []);

            return (
                <div className="flex flex-col h-full bg-gray-50">
                    {/* Control Panel */}
                    <header className="p-4 bg-white shadow-md flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4 rounded-b-lg">
                        <div className="flex items-center space-x-2 w-full md:w-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            <span className="text-xl font-bold text-gray-800">Wialon Units Dashboard</span>
                        </div>
                        <div className="flex flex-col md:flex-row items-center w-full md:w-auto space-y-2 md:space-y-0 md:space-x-2">
                            <select
                                className="w-full md:w-64 p-2 pl-4 text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                                value={selectedUnitId || ''}
                                onChange={(e) => showUnit(parseInt(e.target.value))}
                                disabled={units.length === 0 || isLoading}
                            >
                                <option value="" disabled>-- Select Unit --</option>
                                {units.map((unit) => (
                                    <option key={unit.getId()} value={unit.getId()}>
                                        {unit.getName()}
                                    </option>
                                ))}
                            </select>
                            <button
                                className="w-full md:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:bg-gray-400"
                                onClick={handleSearchByUnit}
                                disabled={!selectedUnitId || isLoading || isSearching}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                <span>Find Nearest to Unit</span>
                            </button>
                        </div>
                    </header>

                    {/* Main Content Area */}
                    <main className="flex flex-1 overflow-hidden p-4 flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                        <div id="map-container" className="flex-1 min-h-0 rounded-lg shadow-xl md:w-2/3"></div>
                        <div className="w-full md:w-1/3 flex flex-col space-y-4">
                            {/* Sensor Controls */}
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Sensor Information</h3>
                                <div className="flex flex-col space-y-2">
                                    <select
                                        ref={selectedSensorRef}
                                        className="w-full p-2 pl-4 text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                                        onChange={getSensorInfo}
                                        disabled={sensors.length === 0}
                                    >
                                        <option value="">-- Select Sensor --</option>
                                        {sensors.map((sensor) => (
                                            <option key={sensor.id} value={sensor.id}>
                                                {sensor.n}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Search Controls */}
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Find Units Near Position</h3>
                                <div className="flex flex-col space-y-2">
                                    <input
                                        type="text"
                                        value={searchPosition ? `${searchPosition.lat.toFixed(5)}, ${searchPosition.lng.toFixed(5)}` : ''}
                                        onChange={(e) => {
                                            const parts = e.target.value.split(',').map(s => s.trim());
                                            if (parts.length === 2 && !isNaN(parseFloat(parts[0])) && !isNaN(parseFloat(parts[1]))) {
                                                setSearchPosition({ lat: parseFloat(parts[0]), lng: parseFloat(parts[1]) });
                                            }
                                        }}
                                        placeholder="Lat, Lng (e.g., 54.68, 25.27)"
                                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={isLoading || isSearching}
                                    />
                                    <div className="flex items-center space-x-2">
                                        <label className="text-sm text-gray-600">Max Results:</label>
                                        <input
                                            type="number"
                                            value={maxUnits}
                                            onChange={(e) => setMaxUnits(parseInt(e.target.value))}
                                            min="1"
                                            max="50"
                                            className="w-20 p-2 border border-gray-300 rounded-lg"
                                            disabled={isLoading || isSearching}
                                        />
                                        <label className="text-sm text-gray-600 ml-4">Last Message (min):</label>
                                        <select
                                            value={lastMessageTimeFilter}
                                            onChange={(e) => setLastMessageTimeFilter(parseInt(e.target.value))}
                                            className="w-24 p-2 border border-gray-300 rounded-lg"
                                            disabled={isLoading || isSearching}
                                        >
                                            <option value="0">Any</option>
                                            <option value="5">5 min</option>
                                            <option value="15">15 min</option>
                                            <option value="30">30 min</option>
                                            <option value="60">1 hr</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={useRouting}
                                            onChange={(e) => setUseRouting(e.target.checked)}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                            disabled={isLoading || isSearching}
                                        />
                                        <label className="text-sm font-medium text-gray-700">Use routing for distance</label>
                                    </div>
                                    <button
                                        onClick={handleSearchByPosition}
                                        className="w-full mt-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 disabled:bg-gray-400"
                                        disabled={!searchPosition || isLoading || isSearching}
                                    >
                                        Find Nearest
                                    </button>
                                </div>
                            </div>

                            {/* Search Results */}
                            <div className="bg-white p-4 rounded-lg shadow-md flex-1 overflow-y-auto">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Search Results</h3>
                                {isSearching ? (
                                    <div className="flex items-center justify-center p-4">
                                        <p className="text-gray-500 text-sm italic">Searching for units...</p>
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Msg</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {searchResults.map((result, index) => (
                                                <tr key={index}>
                                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{prettyPrintDistance(result.distance)}</td>
                                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-blue-600 cursor-pointer hover:underline" onClick={() => mapRef.current.setView([result.unit.getPosition().y, result.unit.getPosition().x], 14)}>
                                                        {result.unit.getName()}
                                                    </td>
                                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{new Date(result.unit.getPosition().t * 1000).toLocaleTimeString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="text-gray-500 text-sm italic">
                                        No results found or search not initiated.
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>

                    {/* Log Panel */}
                    <footer className="p-4 bg-white shadow-inner border-t border-gray-200 h-40 overflow-y-auto rounded-t-lg">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">Logs</h3>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                            {isLoading ? (
                                <p className="italic text-gray-400">Loading initial data...</p>
                            ) : logMessages.length > 0 ? (
                                logMessages.map((msg, index) => (
                                    <p key={index} className="bg-gray-50 p-2 rounded-md transition-colors duration-100 hover:bg-gray-100" dangerouslySetInnerHTML={{__html: msg}}></p>
                                ))
                            ) : (
                                <p className="italic text-gray-400">Please select a unit to start tracking...</p>
                            )}
                        </div>
                    </footer>
                </div>
            );
        };
        // Main application component
        const AppWrapper = () => {
            return (
                <div className="flex flex-col h-screen font-sans bg-gray-100 antialiased">
                    <MapComponent />
                </div>
            );
        };
        window.onload = function() {
            root.render(<AppWrapper />);
        };
    </script>
</body>
</html>
```

## Usage Instructions

1. Save the above code as an HTML file
2. Open the file in a web browser
3. The dashboard will automatically connect to the Wialon API using the provided token
4. Select a unit from the dropdown to track
