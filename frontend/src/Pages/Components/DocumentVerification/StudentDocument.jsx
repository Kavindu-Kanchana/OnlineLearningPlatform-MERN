import React, { useEffect, useState } from "react";//import React, useEffect, useState
import { RotatingLines } from "react-loader-spinner";//import RotatingLines
import Input from "./InputComponent/Input";// import Input
import { useNavigate, useParams } from "react-router-dom";//import useNavigate, useParams
import InputUpload from "./Inputupload/InputUpload";//import InputUpload
import logo from "../../Images/logo.svg";//import logo

//StudentDocument function
const StudentDocument = () => {
  //useState
  const [data, setdata] = useState([]);
  const [error, setError] = useState("");
  const { Data } = useParams();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  //useEffect
  useEffect(() => {
    const getData = async () => {
      try {
        //fetch data from backend
        const response = await fetch(`/api/student/StudentDocument/${Data}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const user = await response.json();
        setdata(user.data);
      } catch (error) {
        setError(error.message);
      }
    };

    getData();
  }, []);

  const [formData, setFormData] = useState({
    Phone: data.Phone || "",
    Address: data.Address || "",
    Idpic: null,
  });

  //handleFileChange function
  const handleFileChange = (fileType, e) => {
    setFormData({
      ...formData,
      [fileType]: e.target.files[0],
    });
  };
//handleInputChange function
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };
//handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    //formDataObj
    const formDataObj = new FormData();

    //Object.keys
    Object.keys(formData).forEach((key) => {
      formDataObj.append(key, formData[key]);
    });

    try {
      //fetch data from backend
      const response = await fetch(`/api/student/verification/${Data}`, {
        method: "POST",//calling post method
        body: formDataObj,
      });

      const responseData = await response.json();
      console.log("response", responseData);

      setLoader(false);
      if (!response.ok) {
        setError(responseData.message);
      } else {
        console.log("Form submitted successfully!");
        navigate("/pending");
      }
    } catch (e) {
      console.error("Error:", e);
    }
  };

  return (
    <>
      {loader && (
        <div className="absolute top-[40%] left-[45%] translate-x-[50%] translate-y-[50%]">
          <RotatingLines
            visible={true}
            height="100"
            width="100"
            color="#0D286F"
            strokeWidth="5"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />{" "}
          <span className="text-white text-xl ml-1">Uploading ......</span>
        </div>
      )}
      <div className="flex items-center gap-[20rem] px-32 py-2 bg-[#0D286F]">
        <div className="flex items-center gap-3">
          <img src={logo} className="w-14" alt="" />
          <h1 className="text-2xl text-[#4E84C1] font-bold">Learnify</h1>
        </div>
        <h2 className="text-white text-xl">Document Verification for (Student) </h2>
      </div>
      <hr />
      <form onSubmit={handleSubmit}>
              <p className="text-[#4E84C1] p-5 px-10">Personal Informations</p>
        <div className="flex flex-wrap gap-20 px-36 mb-10">
          <Input
            label={"First Name"}
            placeholder={"First Name"}
            value={data.Firstname}
            readonly
          />
          <Input
            label={"Last Name"}
            placeholder={"Last Name"}
            value={data.Lastname}
            readonly
          />
          <Input
            label={"Phone No."}
            placeholder={"Phone No."}
            value={formData.Phone}
            onChange={(e) => handleInputChange("Phone", e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-20 px-36">
          <Input
            label={"Home Address"}
            placeholder={"Home Address"}
            value={formData.Address}
            onChange={(e) => handleInputChange("Address", e.target.value)}
          />
          <InputUpload
            label={"Upload ID Card"}
            placeholder={"Upload ID Card"}
            value={formData.Idpic}
            onChange={(e) => handleFileChange("Idpic", e)}
          />
        </div>
        {error && <p className="text-white text-xl m-5 text-center">!! {error}</p>}
        <div className=" bg-[#0D286F] p-3 m-3 rounded-md absolute right-32 bottom-5 cursor-pointer">
          <button className=" text-white text-sm" type="Submit">
            Submit ▶️
          </button>
        </div>
      </form>
    </>
  );
};

export default StudentDocument;
