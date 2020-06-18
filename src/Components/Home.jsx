import React from "react";
const Home = () => {
  return (
    <div className="container md:w-3/4 mx-auto mt-20 mb-10">
      <img
        src="/img/jordan.jpg"
        className="mx-auto w-48 mb-5 rounded-full"
        alt=""
      />
      <h1 className="font-bold text-center mx-auto text-5xl my-5">
        Hi, I'm Jordan
      </h1>
      <p className="w-11/12 lg:w-3/4 mx-auto text-3xl mb-10">
        I am an ITSGG student in the Software Development career.
      </p>
      <p className="w-11/12 lg:w-3/4 text-3xl mx-auto">
        I have been a fullstack developer for 2 years, currently I use the MERN
        stack. My main interests are software development, marketing and
        education through various social networks.
      </p>
    </div>
  );
};

export default Home;
