import React, { useEffect, useRef, useState } from 'react';
import { changeText } from '../../Utils';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';

const EmergencyForm = () => {
    const [request, setRequest] = useState({
        name: "",
        phone: "",
        nearest: "",
        address: "",
        type: "",
        notes: ""
    });

    const [station, setStation] = useState(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyCs7CfC6OxGtlOaD7sjHUXdr0Xzp_hQiMU",
        libraries: ['places']
    });

    const autocompleteRef = useRef(null);
    const addressAutocompleteRef = useRef(null);

    const handleAddressPlaceChanged = async () => {
        const place = addressAutocompleteRef.current.getPlace();
        if (place.geometry) {
            const address = place.formatted_address;
            setRequest(prevRequest => ({
                ...prevRequest,
                address
            }));
            const location = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            };
            console.log("location", location);
            await findNearestFireStation(location);
        }
    };

    const handleNearestPlaceChanged = () => {
        const place = autocompleteRef.current.getPlace();
        if (place.geometry) {
            const nearest = place.formatted_address;
            setRequest(prevRequest => ({
                ...prevRequest,
                nearest
            }));
        }
    };

    const findNearestFireStation = async (location) => {
        const fireStations = [
            {
                "name": "Adajan Fire Station",
                "officer": "Officer A",
                "vehicles": [
                    {
                        "type": "Engine",
                        "count": 2
                    },
                    {
                        "type": "Ladder",
                        "count": 1
                    }
                ],
                "address": "Opp. Star Bazar, Bh. Alishan Enclave, Surat-Hazira Road, Surat, Gujarat, India"
            },
            {
                "name": "Morabhagal Fire Station",
                "officer": "Officer B",
                "vehicles": [
                    {
                        "type": "Engine",
                        "count": 3
                    },
                    {
                        "type": "Rescue",
                        "count": 1
                    }
                ],
                "address": "Opp. Jamia Hussainia Hostel, Morabhal Char Rasta, Morabhagal, Surat, Gujarat, India"
            },
            {
                "name": "Majura Gate Fire Station",
                "officer": "Officer C",
                "vehicles": [
                    {
                        "type": "Tanker",
                        "count": 2
                    }
                ],
                "address": "Opp. Jolly Plaza, Besides Old LB Cinema, Majura Gate, Surat, Gujarat, India"
            },
            {
                "name": "Muglisara Fire Station",
                "officer": "Officer C",
                "vehicles": [
                    {
                        "type": "Tanker",
                        "count": 2
                    }
                ],
                "address": "Besides SMC HQ, Muglisara Main Road, Surat, Gujarat, India"
            },
            {
                "name": "Navsari Bazar Fire Station",
                "officer": "Officer C",
                "vehicles": [
                    {
                        "type": "Tanker",
                        "count": 2
                    }
                ],
                "address": "Navsari Bazar Char Rasta, Opp. Mobin Hospital, Kot Sofil Road, Surat, Gujarat, India"
            },
            {
                "name": "Ganchi Sheri Fire Station",
                "officer": "Officer C",
                "vehicles": [
                    {
                        "type": "Tanker",
                        "count": 2
                    }
                ],
                "address": "Navapura, Ganchi Sheri, Surat, Gujarat, India"
            },
            {
                "name": "Kosad Fire Station",
                "officer": "Officer C",
                "vehicles": [
                    {
                        "type": "Tanker",
                        "count": 2
                    }
                ],
                "address": "Nr. Kosad Health Center, Opp. Ganeshpura Front, Amroli Sayan Road, Surat	"
            },
            {
                "name": "Katargam Fire Station",
                "officer": "Officer C",
                "vehicles": [
                    {
                        "type": "Tanker",
                        "count": 2
                    }
                ],
                "address": "Nr. Dholakia Garden, Katargamgam Road, Surat, Gujarat, India"
            },
            {
                "name": "Kapodra Fire Station",
                "officer": "Officer C",
                "vehicles": [
                    {
                        "type": "Tanker",
                        "count": 2
                    }
                ],
                "address": "Nr. Kapodra Police Station, Varachha-Kapodra Road, Surat, Gujarat, India"
            },
            {
                "name": "Pandesara Fire Station",
                "officer": "Officer C",
                "vehicles": [
                    {
                        "type": "Tanker",
                        "count": 2
                    }
                ],
                "address": "Pandesara GIDC, Road No. C, Nr. Bank of Baroda, Pandesara, Surat, Gujarat, India"
            },
            {
                "name": "Mandarwaja Fire Station",
                "officer": "Officer C",
                "vehicles": [
                    {
                        "type": "Tanker",
                        "count": 2
                    }
                ],
                "address": "Besides Ambedkar Shopping Center, Ring Road, Surat, Gujarat, India"
            },
            {
                "name": "Dumbhal Fire Station",
                "officer": "Officer C",
                "vehicles": [
                    {
                        "type": "Tanker",
                        "count": 2
                    }
                ],
                "address": "Nr. South East Zone Office, Model Town Road, Dumbhal, Surat, Gujarat, India"
            }
        ];
    
        const getDistance = async (loc1, loc2) => {
            // Implement distance calculation based on addresses (example using Google Distance Matrix API)
            const origin = loc1.address;
            const destination = loc2.address;
            const apiKey = 'AIzaSyCs7CfC6OxGtlOaD7sjHUXdr0Xzp_hQiMU';
            const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;
            
            try {
                const response = await fetch(url);
                const data = await response.json();
    
                if (data.status === 'OK') {
                    const distanceText = data.rows[0].elements[0].distance.text;
                    const distanceValue = data.rows[0].elements[0].distance.value;
                    return { text: distanceText, value: distanceValue };
                } else {
                    throw new Error('Failed to calculate distance');
                }
            } catch (error) {
                console.error('Error calculating distance:', error);
                return null;
            }
        };
    
        let nearestStation = null;
        let minDistance = Infinity;
    
        for (const station of fireStations) {
            const distance = await getDistance(location, station);
            if (distance && distance.value < minDistance) {
                minDistance = distance.value;
                nearestStation = station;
            }
        }
    
        console.log("Nearest Fire Station:", nearestStation);
    };

    useEffect(() => {
        if (station) {
            setRequest(prevRequest => ({
                ...prevRequest,
                nearest: station.name
            }));
        }
    }, [station]);

    return (
        <>
            {!isLoaded ? "Loading..." :
                <div className='my-5 sm:flex sm:gap-7'>
                    <div className='shadow-custom p-5 w-full rounded-sm bg-white'>
                        <p className='font-bold text-slate-700'>Create Emergency Request</p>
                        <hr className='my-6' />
                        <div className='my-3'>
                            <label htmlFor="name" className="mb-2 text-sm text-start text-grey-900">Name*</label>
                            <input id="name" type="text" name="name" onChange={(e) => changeText(e, setRequest, request)} placeholder="John Doe" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
                        </div>
                        <div className='my-3'>
                            <label htmlFor="phone" className="mb-2 text-sm text-start text-grey-900">Phone*</label>
                            <input id="phone" type="number" name="phone" onChange={(e) => changeText(e, setRequest, request)} placeholder="0123456789" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
                        </div>
                        <div className='my-3'>
                            <label htmlFor="address" className="mb-2 text-sm text-start text-grey-900">Address*</label>
                            <Autocomplete
                                onLoad={autocomplete => addressAutocompleteRef.current = autocomplete}
                                onPlaceChanged={handleAddressPlaceChanged}
                            >
                                <input id="address" type="text" name="address" placeholder="Enter your address" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
                            </Autocomplete>
                        </div>
                        <div className='my-3'>
                            <label htmlFor="nearest" className="mb-2 text-sm text-start text-grey-900">Nearest Place*</label>
                            <Autocomplete
                                onLoad={autocomplete => autocompleteRef.current = autocomplete}
                                onPlaceChanged={handleNearestPlaceChanged}
                            >
                                <input id="nearest" type="text" name="nearest" placeholder="Enter nearest place" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
                            </Autocomplete>
                        </div>
                        <div className='my-3'>
                            <label htmlFor="emergency" className="mb-2 text-sm text-start text-grey-900">Emergency Type*</label>
                            <input id="emergency" type="text" name="emergency" onChange={(e) => changeText(e, setRequest, request)} placeholder="Describe your emergency" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
                        </div>
                        <div className='my-3'>
                            <label htmlFor="description" className="mb-2 text-sm text-start text-grey-900">Description Of Incident</label>
                            <textarea
                                onChange={(e) => changeText(e, setRequest, request)}
                                name="description"
                                id="description"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                placeholder="Additional notes"
                            />
                        </div>
                        <div className='my-3'>
                            <label htmlFor="priority" className="mb-2 text-sm text-start text-grey-900">Priority</label>
                            <select onChange={(e) => changeText(e, setRequest, request)} name='priority' id="priority" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div className='my-3'>
                            <label htmlFor="notes" className="mb-2 text-sm text-start text-grey-900">Notes</label>
                            <textarea
                                onChange={(e) => changeText(e, setRequest, request)}
                                name="notes"
                                id="notes"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                placeholder="Additional notes"
                            />
                        </div>
                    </div>
                    <div className='shadow-custom p-5 w-full bg-white'>
                        {station && (
                            <div>
                                <h3>Nearest Fire Station</h3>
                                <p>Name: {station.name}</p>
                                <p>Address: {station.address}</p>
                            </div>
                        )}
                    </div>
                </div>
            }
        </>
    );
};

export default EmergencyForm;
