import React, { useState, useEffect } from 'react';//import useState, useEffect
import { useNavigate, useParams } from 'react-router-dom';//import useNavigate, useParams

function VarifyDoc() {
    //useParams
    const { type, adminID, ID } = useParams();
    const [data, setData] = useState(null);
    const navigator = useNavigate();
    const [value, setValue] = useState("");

    //handleMessage function
    const handleMessage = (event) => {
        setValue(event.target.value);
    };

    //Approval function
    const Approval = async(id, type, approve)=>{
        try {
          const data = {
            Isapproved : approve,
            remarks : value,
          }
    
          //fetch data from backend
          const response = await fetch(`/api/admin/${adminID}/approve/${type}/${id}`, {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
        
            navigator(`/admin/${adminID}`);
    
        } catch (error) {
          console.log(error.message);
        }
      }
//useEffect for fetching data
    useEffect(() => {
        const getData = async () => {
            try {
                //fetch data from backend
                const docData = await fetch(`/api/admin/${adminID}/documents/${type}/${ID}`);
                const response = await docData.json();
                setData(response.data);
                console.log(response.data);
            } catch (err) {
                console.log(err.message);
            }
        };
        getData();
    }, []);
//react components
    return (
        <>
            <nav className="h-16 sm:h-20 md:h-24 lg:h-24  w-full bg-[#042439] flex justify-between items-center px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
                <div className="flex items-center">
                    <h1 onClick={()=>  navigator(`/admin/${adminID}`)} className="text-lg sm:text-xl md:text-2xl lg:text-3xl  text-blue-700 font-bold font-mono ml-2">
                    ◀ Go Back
                    </h1>
                </div>
                <div><h2 className='text-2xl text-white font-bold'>Document  Details</h2></div>
                <div className="flex items-center">
                    <button onClick={() => navigator('/')} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                        Logout
                    </button>
                </div>
            </nav>

            {type === "student" && data && data.theStudent && (
                <>
                    <div className='flex gap-10 text-gray-200 justify-center mt-5 text-[1.3rem]'>
                        <p>Full Name : {data.theStudent.Firstname} {data.theStudent.Lastname}</p>
                        <p>Phone Number : {data.studentDocs.Phone}</p>
                        <p>Home Address : {data.studentDocs.Address}</p>
                    </div>

                    <div className='flex mt-10 justify-center gap-20 flex-wrap text-gray-200  font-bold'>
                        <div className='m-5 flex flex-col gap-3'>
                            <img src={data.studentDocs.Idpic} alt="idpic" width={500}/>
                            <p>Identity Card </p>
                        </div>
                        <div className='flex items-end mb-10 flex-col gap-10'>
                            <textarea value={value} onChange={handleMessage} className='w-96 h-60 mt-6 text-black p-5' placeholder='Write reason for rejecting application ...'/>
                            <div className="flex items-center gap-3">
                                <div className="px-5 py-1  bg-green-600 text-lg font-bold text-white ring-1 ring-inset ring-white rounded-lg hover:scale-95 hover:bg-green-900" onClick={()=>Approval(data.theStudent._id, "student", "approved")}>
                                Approved !
                                </div>
                                <div className="px-5 py-1  bg-red-600 text-lg font-bold text-white ring-1   ring-inset ring-white rounded-lg hover:scale-95 hover:bg-red-900" onClick={()=>Approval(data.theStudent._id, "student", "rejected")}>
                                Rejected !
                                </div>

                                <div className="px-5 py-1  bg-blue-600 text-lg font-bold text-white ring-1   ring-inset ring-white rounded-lg hover:scale-95 hover:bg-blue-900" onClick={()=>Approval(data.theStudent._id, "student", "reupload")}>
                                Upload Again!
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {type === "teacher" && data && data.theTeacher &&  (
                <>
                    <div className='flex gap-10 text-gray-200 justify-center mt-5 text-[1.3rem]'>
                        <p>Full Name : {data.theTeacher.Firstname} {data.theTeacher.Lastname}</p>
                        <p>Phone No : {data.teacherDocs.Phone}</p>
                        <p>Experience : {data.teacherDocs.Experience} years</p>
                        <p>Home Address : {data.teacherDocs.Address}</p>
                    </div>

                    <div className='flex mt-10 justify-center gap-20 flex-wrap text-gray-200 font-bold'>                       
                        <div className='m-5 flex flex-col gap-3'>
                            <img src={data.teacherDocs.Idpic} alt="idpic" width={500}/>
                            <p>Identity Card </p>
                        </div>
                        <div className='flex items-end mb-10 flex-col gap-10'>
                            <textarea value={value} onChange={handleMessage} className='w-96 h-60 mt-6 text-black p-5' placeholder='Write reason for rejecting application ...'/>

                            <div className="flex items-center gap-3">
                                <div className="px-5 py-1  bg-green-600 text-lg font-bold text-white ring-1 ring-inset ring-white rounded-lg hover:scale-95 hover:bg-green-900" onClick={()=>Approval(data.theTeacher._id, "teacher", "approved")}>
                                Approved !
                                </div>
                                <div className="px-5 py-1  bg-red-600 text-lg font-bold text-white ring-1   ring-inset ring-white rounded-lg hover:scale-95 hover:bg-red-900" onClick={()=>Approval(data.theTeacher._id, "teacher", "rejected")}>
                                Rejected !
                                </div>

                                <div className="px-5 py-1  bg-blue-600 text-lg font-bold text-white ring-1   ring-inset ring-white rounded-lg hover:scale-95 hover:bg-blue-900" onClick={()=>Approval(data.theTeacher._id, "teacher", "reupload")}>
                                Upload Again!
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default VarifyDoc;
