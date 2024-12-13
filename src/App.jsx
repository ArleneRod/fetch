import React, { useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const terms = {
    Fall: "Fall",
    Winter: "Winter",
    Spring: "Spring",
};

const meetsPat = /^ *((?:M|Tu|W|Th|F)+) +(\d\d?):(\d\d) *[ -] *(\d\d?):(\d\d) *$/;

const timeParts = meets => {
    const [match, days, hh1, mm1, hh2, mm2] = meetsPat.exec(meets) || [];
    return !match ? {} : {
        days,
        hours: {
            start: hh1 * 60 + mm1 * 1,
            end: hh2 * 60 + mm2 * 1
        }
    };
};

const mapValues = (fn, obj) => (
    Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, fn(value)]))
);

const addCourseTimes = course => ({
    ...course,
    ...timeParts(course.meets)
});

const addScheduleTimes = schedule => ({
    title: schedule.title,
    courses: mapValues(addCourseTimes, schedule.courses)
});

const days = ['M', 'Tu', 'W', 'Th', 'F'];

const daysOverlap = (days1, days2) => (
    days.some(day => days1.includes(day) && days2.includes(day))
);

const hoursOverlap = (hours1, hours2) => (
    Math.max(hours1.start, hours2.start) < Math.min(hours1.end, hours2.end)
);

const timeConflict = (course1, course2) => (
    daysOverlap(course1.days, course2.days) && hoursOverlap(course1.hours, course2.hours)
);

const courseConflict = (course1, course2) => (
    getCourseTerm(course1) === getCourseTerm(course2) && timeConflict(course1, course2)
);

const hasConflict = (course, selected) => (
    selected.some(selection => courseConflict(course, selection))
);

const fetchSchedule = async () => {
    const url = "https://courses.cs.northwestern.edu/394/guides/data/cs-courses.php";
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch data");
    return addScheduleTimes(await response.json());
};

const getCourseTerm = course => course.term;
const getCourseNumber = course => course.number;

const toggle = (x, lst) => (
    lst.includes(x) ? lst.filter(y => y !== x) : [x, ...lst]
);

const Banner = ({ title }) => <h1 className="m-4">{title}</h1>;

const Course = ({ course, selected, setSelected }) => {
    const isSelected = selected.includes(course);
    const isDisabled = !isSelected && hasConflict(course, selected);

    const style = {
        backgroundColor: isDisabled ? 'lightgrey' : isSelected ? 'lightgreen' : 'white'
    };

    return (
        <div className="card m-1 p-2"
             style={style}
             onClick={isDisabled ? null : () => setSelected(toggle(course, selected))}>
            <div className="card-body">
                <div className="card-title">{getCourseTerm(course)} CS {getCourseNumber(course)}</div>
                <div className="card-text">{course.title}</div>
                <div className="card-text">{course.meets}</div>
            </div>
        </div>
    );
};

const TermButton = ({ term, setTerm, checked }) => (
    <>
        <input
            type="radio"
            id={term}
            className="btn-check"
            checked={checked}
            autoComplete="off"
            onChange={() => setTerm(term)}
        />
        <label className="btn btn-success m-1 p-2" htmlFor={term}>
            {term}
        </label>
    </>
);

const TermSelector = ({ term, setTerm }) => (
    <div className="btn-group">
        {Object.values(terms).map((value) => (
            <TermButton
                key={value}
                term={value}
                setTerm={setTerm}
                checked={value === term}
            />
        ))}
    </div>
);

const CourseList = ({ courses }) => {
    const [term, setTerm] = useState("Fall");
    const [selected, setSelected] = useState([]);

    const termCourses = Object.values(courses).filter(course => course.term === term);

    return (
        <>
            <TermSelector term={term} setTerm={setTerm} />
            <div className="course-list">
                {termCourses.map(course =>
                    <Course key={course.id} course={course} selected={selected} setSelected={setSelected} />
                )}
            </div>
        </>
    );
};

const Main = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["schedule"],
        queryFn: fetchSchedule,
    });

    if (error) return <h1>Error: {error.message}</h1>;
    if (isLoading) return <h1>Loading the schedule...</h1>;

    return (
        <div className="container">
            <Banner title={data.title} />
            <CourseList courses={data.courses} />
        </div>
    );
};

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <Main />
    </QueryClientProvider>
);

export default App;