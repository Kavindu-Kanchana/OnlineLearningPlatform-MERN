import React from "react";  //import statements
import { NavLink } from "react-router-dom";
import pending from "../Images/pending.svg";

//Pending component
function Pending() {
  return (
    <>
      <div className="flex flex-col gap-6 items-center py-5">
        <img src={pending} width={350} alt="" />
        <h1 className="text-[#EDF051] text-4xl font-bold">Response is Pending</h1>
        <p className="text-[#fadcb6] text-xl w-[35rem] text-center">
          We are awaiting your response. Please be patient. We will send you an email to let you know when your admin reviews your response and decides to approve it or reject it for whatever reason
        </p>
        <NavLink to="/">
          <p className="text-[#6DD15D] text-xl">◀ Go To Home</p>
        </NavLink>
      </div>
    </>
  );
}

//exporting Pending component
export default Pending;
