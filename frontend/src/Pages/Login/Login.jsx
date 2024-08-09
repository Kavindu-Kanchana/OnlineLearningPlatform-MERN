import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
//importing components
import Header from "../Home/Header/Header";
import Radiobtn from "../Components/RadioBtn/Radiobtn";

import "./Login.css"; //importing css and images
import HR from "../Login/Images/HR.svg";

//Login component
export default function Login() {
  // useState hooks
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [userType, setUserType] = useState('');
  const [err, setErr] = useState('');
  
  // useNavigate hook
  const navigate=useNavigate()

  //function to handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    //client side validation
    const newErrors = {};

    // Check if email is empty
    if (!Email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(Email)) {
      newErrors.email = "Invalid email format";
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
      Email: Email,
      Password: Password,
    };

    try {
      // Send data to backend
      const response = await fetch(`/api/${userType}/login`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Get response
      const responesData = await response.json()
      if(responesData.message != 'Logged in'){
        setErr(responesData.message);
      }
      const userid = responesData.data.user._id
 
      // Handle response
      if (response.ok) {
        console.log("Login successful");
        console.log(responesData.data.user.Isapproved);
        
        // if user is pending
        if(responesData.data.user.Isapproved === "pending"){
          if(responesData.data.user.Teacherdetails || responesData.data.user.Studentdetails){
            navigate('/pending')
          }else{
            if(userType === 'student'){
              navigate(`/StudentDocument/${userid}`)
            }else if(userType === 'teacher'){
              navigate(`/TeacherDocument/${userid}`)
            }
          }
          // if user is approved
        }else if(responesData.data.user.Isapproved === "approved"){
          if(userType === 'student'){
            navigate(`/Student/Dashboard/${userid}/Search`)
          }else if(userType === 'teacher'){
            navigate(`/Teacher/Dashboard/${userid}/Home`)
          }
          // if user is rejected
        }else if(responesData.data.user.Isapproved === "reupload"){
          if(userType === 'teacher'){
            navigate(`/rejected/${userType}/${userid}`)
          }else{
            navigate(`/rejected/${userType}/${userid}`)
          }
        }        
      } else if (response.status === 401) {
        // password incorrect
        setErrors({ password: responesData.message || "Incorrect password !" });
      } else if (response.status === 403) {
        // Login failed
        setErrors({ general: responesData.message || "Login failed !" });
      } else if (response.status === 400) {
        // User does not exist
        setErrors({ general: responesData.message || "User does not exist !" });
        // if email is not valid
      } else if (response.status === 422) {
        // Email is not valid
        setErrors({
          general: responesData.message || '"Email" must be a valid email !',
        });
      } else {
        // Other unexpected errors
        setErrors({ general: "An unexpected error occurred.." });
      }
    } catch (error) {
   
      setErrors(error.message);
    }
  };

  //return statement
  return (
    <>
    <Header/>
    <section className="main">
      <div className="container">
        {/* headings */}
        <div className="para1">
          <h2> HI, WELCOME BACK !</h2>
        </div>

        <div className="para">
          <h5> Log Into Your Account.</h5>
        </div>

        <div className="form">
          <form onSubmit={handleSubmit}>
            <div className="input-1">
              <input
                type="text"
                placeholder="Email Address"
                className="input-0"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <div className="error-message">{errors.email}</div>
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

            {/* radio buttons */}
            <div className="radio-btn">
              <Radiobtn  userType={userType} setUserType={setUserType}  />
            </div>

            <div className="signup-link">
              <span>Don't have an account ? </span>
              <NavLink to="/signup" className="link">
                SignUp
              </NavLink>
            </div>

            {/* btns */}
            <div className="btns">
              <button type="submit" className="btns-1">
                Log In
              </button>
            </div>
            {err != '' && (
              <p className="text-red-400 text-sm">{err}</p>
            )}
          </form>
        </div>
      </div>

      {/* image */}
      <div className="img-3">
        <img src={HR} width={600} alt="" />
      </div>
    </section>
    </>
  );
}
