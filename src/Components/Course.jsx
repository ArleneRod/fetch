import React from "react";
import { toggle, hasConflict } from "../utilities/time";

const getCourseTerm = course => course.term;
const getCourseNumber = course => course.number;

const Course = ({ course, selected, setSelected }) => {
    const isSelected = selected.includes(course);
    const isDisabled = !isSelected && hasConflict(course, selected);

    const style = {
        backgroundColor: isDisabled ? "lightgrey" : isSelected ? "lightgreen" : "white",
    };

    return (
        <div
            className="card m-1 p-2"
            style={style}
            onClick={isDisabled ? null : () => setSelected(toggle(course, selected))}
        >
            <div className="card-body">
                <div className="card-title">{getCourseTerm(course)} CS {getCourseNumber(course)}</div>
                <div className="card-text">{course.title}</div>
                <div className="card-text">{course.meets}</div>
            </div>
        </div>
    );
};

export default Course;
