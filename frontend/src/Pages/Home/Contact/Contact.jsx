import React from 'react'         //import pages,css and images
import Header from '../Header/Header';
import Mail from "../../Images/Meet-the-team.svg";
import "../Landing/Landing.css";

//Contact page component
function Contact() {
  return (
    <>
    <Header/>
    <div className="contact">
        <h4>Contact Us</h4>
        <hr className="underLine"/>
        <div className="content">
          <img src={Mail} width={700} alt="" />
          <form  className="form-submit">
            <h4>Send Us a Message</h4>
            <input
              type="text"
              placeholder="Name"
              className="input"
            />
            <input
              type="text"
              placeholder="Email Address"
            />
            <textarea
              placeholder="Message"
              className="textArea"
              name="message"
            />
            <button className="w-[19rem] bg-light-blue-800">Send Us a Message</button>
          </form>
        </div>
      </div>
    </>
  )
}

//exporting Contact component
export default Contact