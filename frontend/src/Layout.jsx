import React from 'react'
import {Outlet} from 'react-router-dom' //import statement

//Layout component
function Layout() {
  return (
    <>
    <Outlet/>
    </>
  )
}

//exporting Layout component
export default Layout