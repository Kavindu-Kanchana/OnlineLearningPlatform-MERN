import React,{ useEffect, useState } from 'react'//import React, useEffect, useState
import { useParams } from 'react-router-dom'//import useParams
import Popup from './Popup';//import Popup

function StudentCourses() {
  //useState
  const { ID } = useParams();
  const [subDetails, setsubDetails] = useState({});
  const [popup, setPopup] = useState(false);
  const [data, setdata] = useState([]);
 
  
//useEffect
  useEffect(() => {
      const getData = async () => {
        try {
          //fetch data from backend
          const response = await fetch(`/api/course/student/${ID}/enrolled`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
  
          const user = await response.json();
          setdata(user.data);
          console.log(user);

        } catch (error) {
          setError(error.message)
        }
      };
      getData();
  },[]);

  //openpopup function
  const openpopup = (sub)=>{
    setPopup(true);
    setsubDetails(sub);
  }
//handleUnenroll function
  const handleUnenroll = async (courseId) => {
    try {
        const response = await fetch(`/api/course/${courseId}/remove/student/${ID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to unenroll');
        }

      
        const updatedData = data.filter((course) => course._id !== courseId);
        setdata(updatedData);
    } catch (error) {
        console.error('Error unenrolling:', error.message);
        
    }
};

  const Image = {
    "physics" : "https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/8e9bf690d23d886f63466a814cfbec78187f91d2",
    "chemistry" : "https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/3e546b344774eb0235acc6bf6dad7814a59d6e95",
    "computer" : "https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/a64c93efe984ab29f1dfb9e8d8accd9ba449f272",
    "biology" : "https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/28ac70002ae0a676d9cfb0f298f3e453d12b5555",
    "math" : "https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/61930117e428a1f0f7268f888a84145f93aa0664",
    
    
  }

  return (
    <>
      <div className='flex flex-wrap justify-center gap-20 pl-48 mx-48 mt-12'>
        {data.map((sub) => (
          <div key={sub._id} className='subject'>
            <div className='flex flex-col items-center'>
              <div className="subject-content" onClick={() => openpopup(sub)}>
                <img src={Image[sub.coursename]} alt={sub.coursename} />
                <p>{sub.coursename}</p>
              </div>
              <button onClick={() => handleUnenroll(sub._id)} className="bg-red-900 text-white rounded px-4 py-2 mt-2 self-start">Unenroll</button>
            </div>
          </div>
        ))}
      </div>
      {popup && <Popup onClose={() => setPopup(false)} subject={subDetails} />}
    </>
  );
}

export default StudentCourses