import { useNavigate } from "react-router-dom";
import { getCourseTerm, getCourseNumber } from "../utilities/schedule";
import { hasConflict, toggle } from "../utilities/timeUtils";
import { terms } from "../utilities/time";
import { useUserState } from "../utilities/firebase";

const Course = ({ course, selected, setSelected }) => {
    const isSelected = selected.includes(course);
    const isDisabled = !isSelected && hasConflict(course, selected);
    const [user] = useUserState();
    const navigate = useNavigate();

    const style = {
        backgroundColor: isDisabled ? "lightgrey" : isSelected ? "lightgreen" : "white",
    };

    return (
        <div
            className="card m-1 p-2"
            style={style}
            onClick={isDisabled ? null : () => setSelected(toggle(course, selected))}
            onDoubleClick={!user ? null : () => navigate("/edit", { state: course })}
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



