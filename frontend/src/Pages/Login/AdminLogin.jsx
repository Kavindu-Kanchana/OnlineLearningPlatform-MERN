import React, { useState } from "react";        //import statements
import {  useNavigate } from "react-router-dom";
import Header from '../Home/Header/Header';
import "./Login.css"; //importing css
import Admin from './Images/Admin.svg'

//Admin login component
export default function AdminLogin() {
  // useState hooks
  const [User, setUser] = useState("");
  const [Password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  // useNavigate hook
  const navigate = useNavigate()

  //function to handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    //client side validation
    const newErrors = {};

    // Check if username is empty
    if (!User.trim()) {
        newErrors.User = "User Name is required";
    }
    
    // Check if password is empty
    if (!Password.trim()) {
      newErrors.password = "Password is required";
    }

    // Set errors if any
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Data to be sent to backend
    const data = {
      username: User,
      password: Password,
    };

    try {
      // Send data to backend
      const response = await fetch(`/api/admin/login`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responesData = await response.json()
      console.log(responesData);
      const userid = responesData.data.admin._id
 
      // Handle response
      if (response.ok) {
          console.log(response); 
        // Redirect to admin page
       navigate(`/admin/${userid}`)
      } else if (response.status === 401) {
        // incorrect password
        setErrors({ password: responesData.message || "Incorrect password" });
      } else if (response.status === 403) {
        // Login failed
        setErrors({ general: responesData.message || "Login failed" });
      } else if (response.status === 400) {
        // Admin does not exist
        setErrors({ general: responesData.message || "Admin does not exist" });
      } else {
        // An unexpected error occurred
        setErrors({ general: "An unexpected error occurred" });
      }
      // catch the error
    } catch (error) {
      // Set error message
      setErrors(error.message);
    }
  };

  //returning the admin login component
  return (
    <>
    <Header/>
    <section className="main">
      {/* image component */}
      <div className="img-3">
        <img src={Admin} width={500} alt="" />
      </div>
      <div className="container py-5">
        <div className="para1">
          <h2> HI,WELCOME BACK !</h2>
        </div>

        <div className="para">
          <h5> Log Into Your Account</h5>
        </div>

        <div className="form">
          <form onSubmit={handleSubmit}>
            <div className="input-1">
              <input
                type="text"
                placeholder="Email Address"
                className="input-0"
                value={User}
                onChange={(e) => setUser(e.target.value)}
              />
              {errors.User && (
                <div className="error-message">{errors.User}</div>
              )}
            </div>
            <div className="input-2">
              <input
                type="password"
                placeholder="Password"
                className="input-0"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <div className="error-message">{errors.password}</div>
              )}
            </div>

            {/* button */}
            <div className="btns">
              <button type="submit" className="btns-1">
                Log In
              </button>
            </div>
            {errors.general && (
              <div className="error-message">{errors.general}</div>
            )}
          </form>
        </div>
      </div>
    </section>
    </>
  );
}
