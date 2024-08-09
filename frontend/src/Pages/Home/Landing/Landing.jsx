import { NavLink , useNavigate} from "react-router-dom";  //importing libraries
import React, { useState } from "react";

import Footer from "../../Footer/Footer.jsx"; //importing pages
import Contact from "../Contact/Contact.jsx";
import Header from "../Header/Header.jsx";

import Plant from "../../Images/Plant.svg"; //importing images
import Classroom from "../../Images/Classroom.svg";
import Plant2 from "../../Images/Plant2.svg"

import "./Landing.css"; //importing css

//Landing page component
function Landing() {
  //useState hooks
  const [subject, setSubject] = useState('');

  const navigate = useNavigate()

  //function to handle search
  const handleSearch = ()=>{
    navigate(`/Search/${subject}`)
  }

  //returning the Landing component
  return (
    <>
    <Header/>
    {/* Top Section */}
      <div className="top">
        <div className="left">
          <h1>
          Developing Brains, Creating Futures: <br />Your Favourite Online Learning Portal <span className="font-semibold text-amber-400 font-serif text-5xl">Learnify</span>
          </h1>
          {/*  Search option */}
          <div className="search mb-10">
            <img src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/6c476f454537d7f27cae2b4d0f31e2b59b3020f5" width={30} alt="" />
            <input type="text" placeholder='Ex: Physics ...' value={subject} onChange={(e)=>setSubject(e.target.value)}/>
            <button className='w-32' onClick={handleSearch}>Find Courses</button>
          </div>
        </div>
        <div className="right">
          <img src={Classroom} width={500} alt="" />
        </div>
      </div>

      {/* Features Panel */}
      <div className="features ">
        <p>Why Us ?</p>
        <div className="fets2">
          <div className="fet cursor-pointer mb-5">
            <img
              src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/622a85ea75414daadf6055613c074c5280b95444"
              alt=""
            />
            <h4>Expert Instructors</h4>
            <p>
            The foundation of our instructional strategy consists of our knowledgeable mentors. They provide our kids with a plethora of knowledge to help them succeed.
            </p>
          </div>

          <div className="fet cursor-pointer mb-5">
            <img
              src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/1478ee1b2a35123ded761b65c3ed2ceaece0d20f"
              alt=""
            />
            <h4>Live Class</h4>
            <p>
            Our live classrooms offer interactive learning experiences with skilled instructors.
            </p>
          </div>

          <NavLink to='/contact'>
            <div className="fet cursor-pointer">
              <img
                src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/c412120e39b2095486c76978d4cd0bea88fd883b"
                alt=""
              />
              <h4>24/7 x 365 days Support</h4>
              <p>
              We provide our students with 24-hour live support. Our team is available 24/7 to provide direction and assistance with any questions or challenges, even at midnight.
              </p>
            </div>
          </NavLink>
        </div>
      </div>

      {/* Courses Panel*/}
      <div className="courses">
      <p>Find Your Favourite Courses</p>
      <hr className="underLine"/>
      <div className="subjects">
        <div className="subject">
          <img src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/a64c93efe984ab29f1dfb9e8d8accd9ba449f272" alt="Computer" />
          <p>Computer</p>
        </div>
        <div className="subject">
          <img src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/3e546b344774eb0235acc6bf6dad7814a59d6e95" alt="Chemistry" />
          <p>Chemistry</p>
        </div>
        <div className="subject">
          <img src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/61930117e428a1f0f7268f888a84145f93aa0664" alt="Math" />
          <p>Math</p>
        </div>
        <div className="subject">
          <img src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/28ac70002ae0a676d9cfb0f298f3e453d12b5555" alt="Physics" />
          <p>Biology</p>
        </div>
        <div className="subject">
          <img src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/8e9bf690d23d886f63466a814cfbec78187f91d2" alt="Physics" />
          <p>Physics</p>
        </div> 
      </div>
    </div>

      {/* About Us Panel */}
      <div className="about" style={{backgroundColor: "#042439"}}>
        <h4>About Us</h4>
        <hr className="underLine"/>
        <div className="content">
          <div className="left-svg">
            <img src={Plant2} width={300} alt="" />
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
            <img src={Plant} width={400} alt="" />
          </div>
        </div>
      </div>

      {/* Contact Us Panel */}
      <div className="contact-us">
        <Contact/>
      </div>

      {/* Footer Panel*/}
      <Footer/>
    </>
  );
}

//exporting Landing component
export default Landing;
