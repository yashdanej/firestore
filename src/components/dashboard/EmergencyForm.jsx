import React, { useEffect, useRef, useState } from 'react';
import { changeText } from '../../Utils';
import { useJsApiLoader, Autocomplete, DistanceMatrixService } from '@react-google-maps/api';

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
    const [loading, setLoading] = useState(false);
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyCs7CfC6OxGtlOaD7sjHUXdr0Xzp_hQiMU",
        libraries: ['places']
    });

    const autocompleteRef = useRef(null);
    const addressAutocompleteRef = useRef(null);

    const handleAddressPlaceChanged = async () => {
        const place = addressAutocompleteRef.current.getPlace();
        if (place.geometry) {
            try {
                setLoading(true);
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
            } catch (error) {
                console.log("error", error);
            } finally {
                setLoading(false);
            }
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

    const findNearestFireStation = async (location) => {
        const service = new window.google.maps.DistanceMatrixService();
        const destinations = fireStations?.map(station => station.address);

        service.getDistanceMatrix({
            origins: [location],
            destinations: destinations,
            travelMode: 'DRIVING',
            unitSystem: window.google.maps.UnitSystem.METRIC,
        }, (response, status) => {
            if (status === 'OK') {
                const distances = response?.rows[0]?.elements;
                const sortedStations = distances?.map((distance, index) => ({
                    ...fireStations[index],
                    distance: distance?.distance?.value
                })).sort((a, b) => a?.distance - b?.distance);
                
                setStation(sortedStations);
                setRequest(prevRequest => ({
                    ...prevRequest,
                    nearest: sortedStations[0].name
                }));
            }
        });
    };

    useEffect(() => {
        if (station) {
            setRequest(prevRequest => ({
                ...prevRequest,
                nearest: station.name
            }));
            console.log("station", station);
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
                    <div className='w-full'>
                        {station && (
                            <div className='shadow-custom p-5 w-full bg-white'>
                                <p className='font-bold text-slate-700'>Nearby station</p>
                                <hr className='my-6' />
                                {
                                    station?.map((item) => {
                                        return (
                                            <>
                                                <div
                                                class="cursor-pointer overflow-hidden relative transition-all duration-500 hover:translate-y-2 w-72 h-44 bg-neutral-50 rounded-lg shadow-xl flex flex-row items-center justify-evenly gap-2 p-2 before:absolute before:w-full hover:before:top-0 before:duration-500 before:-top-1 before:h-1 before:bg-purple-200"
                                                >
                                                <svg
                                                    class="stroke-purple-200 shrink-0"
                                                    height="50"
                                                    preserveAspectRatio="xMidYMid meet"
                                                    viewBox="0 0 100 100"
                                                    width="50"
                                                    x="0"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    y="0"
                                                >
                                                    <path
                                                    d="M17.9,60.7A14.3,14.3,0,0,0,32.2,75H64.3a17.9,17.9,0,0,0,0-35.7h-.4a17.8,17.8,0,0,0-35.3,3.6,17.2,17.2,0,0,0,.4,3.9A14.3,14.3,0,0,0,17.9,60.7Z"
                                                    fill="none"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="8"
                                                    ></path>
                                                </svg>
                                                <div>
                                                    <span class="font-bold">{item.name}</span>
                                                    <p class="line-clamp-3">
                                                    {item.address}
                                                    </p>
                                                </div>
                                                </div>
                                            </>
                                        )
                                    })
                                }
                            </div>
                        )}
                    </div>
                </div>
            }
        </>
    );
};

export default EmergencyForm;
