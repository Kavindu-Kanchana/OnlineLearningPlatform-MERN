import React from 'react'
import Footer from "../../Footer/Footer.jsx"    //import pages and css
import Header from '../Header/Header.jsx';
import '../Landing/Landing.css'
import Plant from "../../Images/Plant.svg";   //import images
import Plant2 from "../../Images/Plant2.svg";

//About page component
function About({backgroundC}) {
  return (
    <>
    <Header/>
    <div className="about" style={{backgroundColor: backgroundC}}>
        <h4>About Us</h4>
        <hr className="underLine"/>
        <div className="content">
          <div className="left-svg">
            <img src={Plant2} className="w-[22rem]" alt="" />
          </div>
          <p>
            Learnify believes in education's ability to alter people's lives. Our platform is intended to serve as a portal to knowledge, providing students with a varied choice of courses and learning opportunities.
            <br/>
            <br/>
            Learnify was founded on a passion for learning and a commitment to make quality education accessible to all. We understand the obstacles that modern learners confront and strive to give a convenient and effective answer.
            <br/>
            <br/>
            Our purpose is simple but profound: to empower people through education. We want to build a worldwide learning community where students can explore new interests, improve their abilities, and achieve their academic and professional objectives. We seek to make learning entertaining, dynamic, and pleasurable via the use of technology and new teaching methods.
          </p>
          <div className="right-svg">
            <img src={Plant} className="w-[30rem]" alt="" />
          </div>
        </div>
    </div>
    <Footer/>
    </>
  )
}

//exporting About component
export default About