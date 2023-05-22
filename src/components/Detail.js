import React, { useEffect, useState } from "react";
import ReactStars from "react-stars";
import { useParams } from "react-router-dom";
import { moviesRef } from "./firebase/FireBase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase/FireBase";
import { MutatingDots } from "react-loader-spinner";
import Review from "./Review";
const Detail = () => {
  const { id } = useParams();
  const [loading, setLoader] = useState(false);
  const [data, setData] = useState({
    name: "",
    year: "",
    img: "",
    Description: "",
    rating: 0,
    rated: 0,
  });
  useEffect(() => {
    async function getData() {
      setLoader(true);
      const _doc = doc(db, "movies", id);
      const _data = await getDoc(_doc);
      // console.log(_data.data());
      setData(_data.data());
      setLoader(false);
    }
    getData();
  }, []);
  return (
    <div className="p-4 mt-4 flex flex-col md:flex-row  items-center md:items-start w-full justify-center ">
      {loading ? (
        <div className="w-full flex justify-center items-center h-96">
          <MutatingDots color="red" secondaryColor="red" />
        </div>
      ) : (
        <>
          <img className=" h-96 block md:sticky top-24 " src={data.img} />

          <div className=" ml-0 md:ml-4 w-full md:w-1/2">
            <h1 className=" text-3xl font-bold text-red-500">
              {data.name}
              <span className="  text-white font-thin text-xl">
                ({data.year})
              </span>
            </h1>
            <ReactStars size={20} half={true} value={data.rating/data.rated} edit={false} />
            <p className="mt-2">{data.Description}</p>

            <Review id={id} prevrating={data.rating} userRated={data.rated} />
          </div>
        </>
      )}
    </div>
  );
};

export default Detail;
