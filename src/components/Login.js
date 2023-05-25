import React, { useContext, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import {query, where, getDocs} from 'firebase/firestore'
import { usersRef } from "./firebase/FireBase";
import {Appstate} from "../App"
import bcrypt from 'bcryptjs'
import swal from "sweetalert";
import Footer from "./Footer";
const Login = () => {
  const navigate = useNavigate();
  const useAppstate = useContext(Appstate);
  const [form, setForm] = useState({
    mobile: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    try {
      const quer = query(usersRef, where('mobile', '==', form.mobile))
      const querySnapshot = await getDocs(quer);

      querySnapshot.forEach((doc) => {
        const _data = doc.data();
        const isUser = bcrypt.compareSync(form.password, _data.password);
        if(isUser) {
          useAppstate.setLogin(true);
          useAppstate.setUserName(_data.name);
          swal({
            title: "Logged In",
            icon: "success",
            buttons: false,
            timer: 3000
          })
          navigate('/')
        } else {
          swal({
            title: "Invalid Credentials",
            icon: "error",
            buttons: false,
            timer: 3000
          })
        }
      })
    } catch (error) {
      swal({
        title: error.message,
        icon: "error",
        buttons: false,
        timer: 3000
      })
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-h-fit flex  flex-col mt-4 justify-center items-center ">
      <h1 className=" text-4xl  font-bold">
        {" "}
        Log<span className=" text-red-600">In</span>
      </h1>

      <div class="p-2  w-full md:w-1/3">
        <div class="relative">
          <label for="imgLink" class="leading-7 text-sm text-white">
            Mobile No.

          </label>
          <input
          type={"number"}
            value={form.mobile}
            autoFocus
            required
            autoComplete="off"
            requiredTxt
              formatErrorTxt
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            id="mobile"
            name="mobile"
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
            value={form.password}
            required
            requiredTxt
              formatErrorTxt
            autoComplete="off"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            id="password"
            name="password"
            class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
      </div>
      <button onClick={login} class="flex mx-auto  my-2 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
        {loading ? <TailSpin height={25} color="red" /> : "Login"}
      </button>

      <div>
        <p>
          Do not have account?{" "}
          <Link to={'/signup'}>
            {" "}
            <span className=" text-blue-500"> Sign Up</span>{" "}
          </Link>{" "}
        </p>
      </div>
    </div>
  );
};

export default Login;
