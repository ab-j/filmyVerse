import React, { useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { Link } from "react-router-dom";
import {getAuth, RecaptchaVerifier, signInWithPhoneNumber} from 'firebase/auth'
import app from "./firebase/FireBase";
import swal from "sweetalert";
import { addDoc } from "firebase/firestore";
import { usersRef } from "./firebase/FireBase";
import { useNavigate } from "react-router-dom";
import bcrypt from 'bcryptjs';

const auth = getAuth(app);

const Signup = () => {
  const navigate=useNavigate();
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [OTP, setOTP] = useState("");

  const generateRecaptha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    }, auth);
  }

  const requestOtp = () => {
    setLoading(true);
    generateRecaptha();
    let appVerifier = window.recaptchaVerifier;
      signInWithPhoneNumber(auth, `+91${form.mobile}`, appVerifier)
      .then(confirmationResult => {
        window.confirmationResult = confirmationResult;
        swal({
          text: "OTP Sent",
          icon: "success",
          buttons: false,
          timer: 3000,
        });
        setOtpSent(true);
        setLoading(false);
      }).catch((error) => {
        console.log(error)
      })
}

const uploadData = async () => {
  try {
    const salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(form.password, salt);
    await addDoc(usersRef, {
      name: form.name,
      password: hash,
      mobile: form.mobile
    });
  } catch(err) {
    console.log(err);
  }
}

const verifyOTP = () => {
  try {
    setLoading(true);
    window.confirmationResult.confirm(OTP).then((result) => {
      uploadData();
      swal({
        text: "Sucessfully Registered",
        icon: "success",
        buttons: false,
        timer: 3000,
      });
      navigate('/login')
      setLoading(false); 
    })
  } catch (error) {
    console.log(error);
  }
}


  return (
    <div className="w-full flex  flex-col mt-4 justify-center items-center ">
      <h1 className=" text-4xl  font-bold">
        {" "}
        Sign<span className=" text-red-600">Up</span>
      </h1>

      {otpSent ? (
        <>
          <div class="p-2  w-full md:w-1/3">
            <div class="relative">
              <label for="message" class="leading-7 text-sm text-white">
                OTP
              </label>
              <input
                value={OTP}
                autoFocus
                onChange={(e) => setOTP(e.target.value)}
                id="message"
                name="message"
                class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <button onClick={verifyOTP} class="flex mx-auto my-4 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
              {loading ? <TailSpin height={25} color="white" /> : "Confirm OTP"}
            </button>
          </div>
        </>
      ) : (
        <>
          <div class="p-2  w-full md:w-1/3">
            <div class="relative">
              <label for="imgLink" class="leading-7 text-sm text-white">
                Name
              </label>
              <input
                
                value={form.name}
                autoFocus
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                id="message"
                name="message"
                class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>

          <div class="p-2  w-full md:w-1/3">
            <div class="relative">
              <label for="imgLink" class="leading-7 text-sm text-white">
                Mobile No.
              </label>
              <input
                type={"number"}
                value={form.mobile}
              
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                id="message"
                name="message"
                class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>

          <div class="p-2 w-full md:w-1/3">
            <div class="relative">
              <label for="password" class="leading-7 text-sm text-white">
                Password
              </label>
              <input
              type={'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                id="message"
                name="message"
                class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>
          <button
            onClick={requestOtp}
            class="flex mx-auto my-2 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
          >
            {loading ? <TailSpin height={25} color="white" /> : "Request OTP"}
          </button>
        </>
      )}
      <div>
        <p>
          Already have an account?
          <Link to={"/login"}>
            
            <span className=" text-blue-500"> Log In</span>
          </Link>
        </p>
      </div>
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Signup;
