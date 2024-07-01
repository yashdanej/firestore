import React, { useState } from 'react'
import TopCard from '../../components/dashboard/TopCard'
import EmergencyForm from '../../components/dashboard/EmergencyForm';
import CreateRequest from '../../components/dashboard/CreateRequest';

const Dashboard = () => {
    const [emergency, setEmergency] = useState(true);
  return (
    <div className='min-h-screen bg-gray-50 '>
        <div className='py-5 mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
            <div className='sm:flex sm:gap-2'>
                <div className='py-1 mx-auto sm:mx-0 sm:py-0' onClick={() => setEmergency(true)}>
                    <TopCard from="emergency" />
                </div>
                <div className='py-1 mx-auto sm:mx-0 sm:py-0' onClick={() => setEmergency(false)}>
                    <TopCard from="not_emergency" />
                </div>
        </div>
        {
            emergency?<EmergencyForm/>:<CreateRequest/>
        }
        </div>
    </div>
  )
}

export default Dashboard
