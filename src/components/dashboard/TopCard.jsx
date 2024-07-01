import React from 'react'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FireTruckIcon from '@mui/icons-material/FireTruck';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

const TopCard = ({from}) => {
  return (
    <div className="flex flex-col gap-2 w-60 sm:w-72 text-[10px] sm:text-xs z-50">
    <div
        className={`error-alert cursor-default flex items-center justify-between w-full h-12 sm:h-14 rounded-lg ${from === "emergency" ? "bg-[#232531]": "bg-[#b2b9e0]"} px-[10px]`}
    >
        <div className="flex gap-2">
        <div className="text-[#d65563] bg-white/5 backdrop-blur-xl p-1 rounded-lg">
           {
                from === "emergency" ? <LocalFireDepartmentIcon className='cursor-pointer' />
                :<FireTruckIcon className='cursor-pointer' />
           }
        </div>
        <div>
            <p className="text-white cursor-pointer">Create Emergency Request</p>
            <p className="text-gray-500 cursor-pointer">This is the description part</p>
        </div>
        </div>
        <button
        className={`${from === "emergency"? "text-gray-600": "text-gray-200"} hover:bg-white/10 p-1 rounded-md transition-colors ease-linear`}
        >
        <ArrowForwardIosIcon/>
        </button>
    </div>
    </div>

  )
}

export default TopCard
