import React from 'react'
import {Outlet} from 'react-router-dom'
import TeacherDashboard from './TeacherDashboard'//import TeacherDashboard

function TeacherLayout() {
  return (
    <>
    <TeacherDashboard/>
    <Outlet/>
    </>
  )
}

export default TeacherLayout