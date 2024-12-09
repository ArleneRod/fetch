import React from "react";
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

const Banner = ({ title }) => <h1 className="m-4">{title}</h1>;

const Course = ({ course }) => (
  <div className="card m-2 p-2">
    <div className="card-body">
      <h5 className="card-title">{course.term} CS {course.number}</h5>
      <p className="card-text">{course.title}</p>
    </div>
  </div>
);

const TermButton = ({ term, selectedTerm, setSelectedTerm }) => (
  <>
    <input
      type="radio"
      id={term}
      className="btn-check"
      autoComplete="off"
      checked={term === selectedTerm}
      onChange={() => setSelectedTerm(term)}
    />
    <label className="btn btn-success m-1 p-2" htmlFor={term}>
      {term}
    </label>
  </>
);

const TermSelector = ({ selectedTerm, setSelectedTerm }) => (
  <div className="btn-group">
    {Object.values(terms).map((term) => (
      <TermButton
        key={term}
        term={term}
        selectedTerm={selectedTerm}
        setSelectedTerm={setSelectedTerm}
      />
    ))}
  </div>
);

const CourseList = ({ courses }) => {
  const [selectedTerm, setSelectedTerm] = React.useState("Fall");

  const filteredCourses = Object.values(courses).filter(
    (course) => course.term === selectedTerm
  );

  return (
    <>
      <TermSelector selectedTerm={selectedTerm} setSelectedTerm={setSelectedTerm} />
      <div className="course-list">
        {filteredCourses.map((course) => (
          <Course key={course.id} course={course} />
        ))}
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
