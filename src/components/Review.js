import React, { useEffect, useState } from "react";
import ReactStars from "react-stars";
import { reviewsRef, db } from "./firebase/FireBase";
import {
  addDoc,
  doc,
  updateDoc,
  getDocs,
  where,
  query,
} from "firebase/firestore";
import { TailSpin, ThreeCircles } from "react-loader-spinner";
import swal from "sweetalert";

const Review = ({ id, prevrating, userRated }) => {
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState("");
  const [data, setData] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);



  
  const sendReview = async () => {
    setLoading(true);
    try {
      await addDoc(reviewsRef, {
        movieid: id,
        name: "abj",
        thoughts: form,
        rating: rating,
        timestamp: new Date().getTime(),
      });
      const ref = doc(db, "movies", id);
      await updateDoc(ref, {
        rating: prevrating + rating,
        rated: userRated + 1,
      });
      swal({
        title: "succesfully review send",
        icon: "success",
        button: false,
        timer: 3000,
      });
    } catch (error) {
      swal({
        title: error,
        icon: "error",
        button: false,
        timer: 3000,
      });
    }
    setRating(0);
    setForm("");
    setLoading(false);
  };

  useEffect(() => {
    async function getData() {
      setReviewsLoading(true);
      let quer = query(reviewsRef, where("movieid", "==", id));
      const querysnap = await getDocs(quer);
      querysnap.forEach((doc) => {
        setData((prev) => [...prev, doc.data()]);
      });

      setReviewsLoading(false);
    }
    getData();
  }, []);

  return (
    <div className="mt-4 w-full border-t-2 border-gray-400">
      <h1>Your Input</h1>
      <ReactStars
        size={30}
        half={true}
        value={rating}
        onChange={(rate) => setRating(rate)}
      />
      <input
        value={form}
        onChange={(e) => setForm(e.target.value)}
        type="text"
        placeholder="Write Your Review"
        autoFocus
        className="header  w-full outline-none p-2"
      />
      <button
        onClick={sendReview}
        className=" w-full p-1 flex justify-center bg-green-500"
      >
        {loading ? <TailSpin height={25} color="red" /> : "Share"}
      </button>

      {reviewsLoading ? (
        <div className="flex justify-center mt-5">
          <ThreeCircles color="green" height={30} />
        </div>
      ) : (
        <div className="  mt-9 border-t-2 border-red-700">
          {data.map((e, i) => {
            return (
              <div key={id} className="  bg-gray-900">
                <div className=" mt-2 p-2 rounded-md">
                  <p className=" flex justify-between">
                    {e.name}{" "}
                    <span className=" flex items-center text-xs text-center">{new Date(e.timestamp).toLocaleString()}</span>
                  </p>
                  <hr />
                  <ReactStars
                    size={20}
                    half={true}
                    value={e.rating}
                    edit={false}
                  />
                  <p className=" mt-2">{e.thoughts}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Review;
