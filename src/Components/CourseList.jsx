import React, { useState } from "react";
import TermSelector from "./TermSelector";
import Course from "./Course";

const CourseList = ({ courses }) => {
    const [term, setTerm] = useState("Fall");
    const [selected, setSelected] = useState([]);

    const termCourses = Object.values(courses).filter(course => course.term === term);

    return (
        <>
            <TermSelector term={term} setTerm={setTerm} />
            <div className="course-list">
            {termCourses.map(course => <Course key={course.id} course={course} selected={selected} setSelected={setSelected} />)}
            </div>
        </>
    );
};

export default CourseList;
