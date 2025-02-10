import React from "react";
import Banner from "./Components/Banner";
import CourseList from "./Components/CourseList";

const Main = ({ data }) => {
 return (
   <div className="container">
     <Banner title={data.title} />
     <CourseList courses={data.courses} />
   </div>
 );
};

export default Main;
