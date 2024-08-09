import React, { useEffect, useState } from 'react'//import React, useEffect, useState
import { useParams } from 'react-router-dom'//import useParams

function DashboardTeacher() {
  //useState
  const { ID } = useParams();
  const [data, setdata] = useState([]);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState([]);

  //useEffect
  useEffect(() => {
    const getData = async () => {
      try {
        //fetch data from backend
        const response = await fetch(`/api/Teacher/TeacherDocument/${ID}`, {
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
      } catch (error) {
        setError(error.message)
      }
    };
    getData();
  },[]);

  //useEffect
  useEffect(() => {
    const getCourses = async () => {
      try {
        //fetch data from backend
        const response = await fetch(`/api/course/Teacher/${ID}/enrolled`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const res = await response.json();
        setCourses(res.data);
      } catch (error) {
        setError(error.message)
      }
    };
    getCourses();
   },[]);

  return (
    <>
        <div className='m-5 ml-60 text-white flex flex-col gap-7'>
                <p>Name: {data.Firstname} {data.Lastname}</p>
                <p>Email: {data.Email}</p>
            <div className='flex gap-3 items-center'>
                <p>Courses:</p>
                {courses && (
                  courses.map((course) => <p key={course._id} className=' bg-[#1671D8] py-1 px-2 rounded-xl'>{course.coursename}</p>)
                )}
            </div>
        </div>
    </>
  )
}

export default DashboardTeacher