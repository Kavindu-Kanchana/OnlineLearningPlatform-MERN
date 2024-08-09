import React from 'react'         //import statements
import Email from '../../Images/email.svg'
import { NavLink } from "react-router-dom"
import Header from '../../Home/Header/Header'

//function to verify email
function VarifyEmail() {
  return (
    <>
    <Header/>
    <div className='flex justify-center'>
        <div className='bg-blue-gray-900 w-96 h-96  rounded-md flex flex-col gap-5 justify-center items-center mt-10'>
            <img src={Email} width={150} alt="email" />
            <p className='text-white text-3xl'>Send Email</p>
            <p className='text-gray-300 mx-7 text-sm'>A link for verification has been emailed to your email. In order to finish the verification process, click the link. You may need to check your spam mail folder.</p>
            <NavLink to='/login'>
                <p className=' text-blue-700'>◀ Back to Login Page</p>
            </NavLink>
        </div>
    </div>
    </>
  )
}

//exporting VarifyEmail
export default VarifyEmail