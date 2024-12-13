import React, { useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const terms = {
  Fall: "Fall",
  Winter: "Winter",
  Spring: "Spring",
};

const fetchSchedule = async () => {
  const url = "https://courses.cs.northwestern.edu/394/guides/data/cs-courses.php";
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch data");
  return response.json();
};

const getCourseTerm = (course) => course.term;
const getCourseNumber = (course) => course.number;

const toggle = (x, lst) => (
    lst.includes(x) ? lst.filter(y => y !== x) : [x, ...lst]
);

const Banner = ({ title }) => <h1 className="m-4">{title}</h1>;

const Course = ({ course, selected, setSelected }) => {
    const isSelected = selected.includes(course);

    const style = {
        backgroundColor: isSelected ? 'lightgreen' : 'white'
    };

    const isConflict = selected.some(selectedCourse =>
        selectedCourse.term === course.term && selectedCourse.time === course.time
    );

    return (
        <div
            className={`card m-1 p-2 ${isSelected ? "selected" : ""}`}
            style={style}
            onClick={() => setSelected(toggle(course, selected))}
        >
            <div className="card-body">
                <div className="card-title">{getCourseTerm(course)} CS {getCourseNumber(course)}</div>
                <div className="card-text">{course.title}</div>
                <button
                    className="btn btn-secondary"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelected(toggle(course, selected));
                    }}
                    disabled={isConflict && !isSelected}
                >
                    {isSelected ? "Deselect" : "Select"}
                </button>
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