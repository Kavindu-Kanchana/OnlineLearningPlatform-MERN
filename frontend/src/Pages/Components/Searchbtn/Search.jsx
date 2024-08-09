import React, { useEffect, useState } from "react";//import React, useEffect, useState
import Success from "./Success";//import Success
import { useParams } from "react-router-dom";//import useParams
import "./Search.css";//import Search.css

//Search function
function Search() {
  const [data, setData] = useState("");
  const [course, setCourse] = useState([]);
  const [courseID, setCourseID] = useState([]);
  const [popup, setPopup] = useState(false);
  const [idArray, setIdArray] = useState([]);
  const { ID } = useParams();

  //closePopup function
  const closePopup = () => {
    setPopup(false);
    window.location.reload();
  };

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
        setCourseID(user.data);
        console.log(user.data);
        setIdArray(prevIdArray => [...prevIdArray, ...user.data.map(res => res._id)]);
        // using map to get the id of the course
      } catch (error) {
        console.log(error.message)
      }
    };
    getData();
  }, []);
  

  //SearchTeacher function
  const SearchTeacher = async (sub) => {
    const subject = sub.toLowerCase();
    const Data = await fetch(`/api/course/${subject}`);
    const response = await Data.json();
    if (response.statusCode === 200) {
      setCourse(response.data);
    }
    setData("");
  };

  //handleEnroll function
  const handleEnroll = async (courseName, id) => {
    try {
      let response = await fetch(
        //fetch data from backend
        `/api/course/${courseName}/${id}/add/student/${ID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // body: JSON.stringify({}),
        }
      );

      let res = await response.json();
      // console.log(res);
      setPopup(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="search mb-4">
        <img
          src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/6c476f454537d7f27cae2b4d0f31e2b59b3020f5"
          width={30}
          alt=""
        />
        <input
          type="text"
          placeholder="Ex: Physics ..."
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
        <button className="w-32" onClick={() => SearchTeacher(data)}>
          Find a Teacher
        </button>
      </div>
      <div className="overflow-auto h-56">
        {course &&
          course.map((Data) => (
            <div
              key={Data._id}
              className="relative bg-blue-600 p-4 gap-6 mb-3 flex items-center rounded-sm max-w-4xl"
            >
              <div className="text-white bg-blue-900 p-2 rounded-md">
                {Data.coursename}
              </div>
              <div className="text-gray-300">
                {Data.enrolledteacher.Firstname} {Data.enrolledteacher.Lastname}
              </div>
              <div className="text-gray-900">
                <span className="text-black">Desc :</span> {Data.description}
              </div>
              <div>{Data.enrolledStudent.length}/20</div>
              { idArray.includes(Data._id) ? (
                <div onClick={()=> alert("You Already enrolled, pls find other course")}
                  className="text-white bg-green-900 py-2 px-3 absolute right-4 cursor-not-allowed">
                  Already Enrolled
                </div>
              ) : Data.enrolledStudent.length < 20 ? (
                <div
                  onClick={() => handleEnroll(Data.coursename, Data._id)}
                  className="text-white bg-blue-900 py-2 px-3 absolute right-4 cursor-pointer"
                >
                  Enroll Now
                </div>
              ) : (
                <div onClick={()=> alert("Already Full, pls find other course")}
                  className="text-white bg-red-900 py-2 px-3 absolute right-4 cursor-not-allowed">
                  Already Full
                </div>
              )}
            </div>
          ))}
      </div>

      {popup && <Success onClose={closePopup} />}
    </>
  );
}

export default Search;
