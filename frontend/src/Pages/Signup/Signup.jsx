import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import Radiobtn from "../Components/RadioBtn/Radiobtn";
import Header from "../Home/Header/Header";

import "./Styles.css";
import Images from "../Images/Grammar-correction.svg";

// Signup component
const Signup = () => {
  // states to store form data and errors
  const [Firstname, setFirstName] = useState("");
  const [Lastname, setLastName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [userType, setUserType] = useState('');

  // useNavigate hook
  const navigate = useNavigate()


  //function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form data
    const newErrors = {};

    // Check if first name is empty
    if (!Firstname.trim()) {
      newErrors.firstname = 'First name is required';
    }

    // Check if last name is empty
    if (!Lastname.trim()) {
      newErrors.lastname = 'Last name is required';
    }

    // Check if email is empty
    if (!Email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(Email)) {
      newErrors.email = 'Invalid email format';
    }

    // Check if password is empty
    if (!Password.trim()) {
      newErrors.password = 'Password is required';
    }

    // Check if user type is empty
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare data to send to the server
    const data = {
      Firstname: Firstname,
      Lastname: Lastname,
      Email: Email,
      Password: Password,
    };

    try {
      // Send a POST request to the server
      const response = await fetch(`/api/${userType}/signup`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Parse the JSON response
      const responseData = await response.json();

      if (response.ok) {
        // Registration successful
        console.log("Registration successful");
        navigate('/varifyEmail');
      } else if (response.status === 400) {
        // Handle specific validation errors returned by the server
        setErrors(responseData.errors || {});
      } else {
        // Other status codes
        console.error("Registration failed with status code:", response.status);
      }
    } catch (error) {
      // Network errors
      setErrors(error.message);
     
    }
  };

  // Return statement
  return (
    <>
    <Header/>
    <div className="section">
      <article className="article">
        <div className="header">
          <h3 className="head">WELCOME !!</h3>
          <h4 className="Sub-head">Join with us Today !!</h4>
        </div>

        <div className="inpts">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="input-x input-4"
              placeholder="Firstname"
              value={Firstname}
              onChange={(e) => setFirstName(e.target.value)}
            />
            {errors.firstname && (
              <div className="error-message">{errors.firstname}</div>
            )}

            <input
              type="text"
              className="input-x input-5"
              placeholder="Lastname"
              value={Lastname}
              onChange={(e) => setLastName(e.target.value)}
            />
            {errors.lastname && (
              <div className="error-message">{errors.lastname}</div>
            )}

            <input
              type="text"
              className="input-x input-6"
              placeholder="Email"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <div className="error-message">{errors.email}</div>
            )}

            <input
              type="password"
              className="input-x input-7"
              placeholder="Password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}

            <div className="rad-btns">
              <Radiobtn userType={userType} setUserType={setUserType}/>
            </div>

            <div className="signupage">
              <span>Already have an account ? </span>
              <NavLink to="/Login" style={{ color: "green" }} className="link">
                Login
              </NavLink>
            </div>
            <div className="btn">  
            <button type="submit" className="btn-4">
              SignUp
            </button>
            </div>
          </form>
        </div>
      </article>

      <div className="right-part">
        <img src={Images} alt="" className="imgs" />
      </div>
    </div>
    </>
  );
};

//exporting Signup component
export default Signup;
