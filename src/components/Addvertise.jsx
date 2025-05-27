import React from 'react'
import robo from '../assets/robo.png'

const Addvertise = () => {
  return (
    <div className='w-full bg-white py-2 px-4'>
        <div className='max-w-[1240px] mx-auto grid md:grid-cols-3'>
            <img className='w-[450px] mx-auto my-4 ms-8' src={robo} alt="" />
            <div className='flex flex-col justify-center col-span-2 ms-12'>
                <h1 className='md:text-3xl sm:text-2xl text-xl py-4 uppercase font-poppins font-semibold text-[#1C5739]'>Try Our Help Assistant for Free! </h1>
                
                <button className='bg-gradient-to-r from-[#b2fad2] to-[#4cffea] rounded-md w-[150px] my-6 mx-0 px-8 py-2 font-poppins font-semibold text-[#1C5739]'>Try Now</button>
            </div>
            
        </div>
    </div>
  )
}

export default Addvertise