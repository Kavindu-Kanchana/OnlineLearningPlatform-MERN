import React from "react";
import { NavLink, useParams } from "react-router-dom";  //import statements
import rejected from "../Images/rejected.svg";

//Rejected component
function Rejected() {
  const { ID, user } = useParams();
  // Check if user is student or teacher
  let type = '';
  if(user === 'student'){
    type = 'StudentDocument';
  }else{
    type = 'TeacherDocument';
  }

  //return statement
  return (
    <>
      <div className="flex flex-col gap-6 items-center py-5">
        <img src={rejected} width={350} alt="" />
        <h1 className="text-[#F37070] text-4xl font-bold">Response is Rejected !</h1>
        <p className="text-[#fadcb6] text-xl w-[35rem] text-center">
          Although we appreciate your response, the picture on your ID card is not clear. Kindly submit again.
        </p>
        <NavLink to={`/${type}/${ID}`}>
          <p className="text-[#6DD15D] text-xl">◀ Go To Verification Page </p>
        </NavLink>
      </div>
    </>
  );
}

//exporting Rejected component
export default Rejected;
