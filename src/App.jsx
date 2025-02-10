
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Banner from "./Components/Banner";
import CourseList from "./Components/CourseList";
import EditForm from "./Components/EditForm";
import { useQuery } from "react-query";
import { fetchSchedule } from "./utilities/schedule";

const queryClient = new QueryClient();

function App() {
    return (
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    );
  }
  
  function AppContent() {
    const { data, isLoading, error } = useQuery({
      queryKey: ["schedule"],
      queryFn: fetchSchedule
    });
  
    if (error) return <h1>Error: {error.message}</h1>;
    if (isLoading) return <h1>Loading the schedule...</h1>;
  
    return (
      <BrowserRouter>
        <div className="container">
          <Banner title={data.title} />
          <Routes>
            <Route path="/" element={<CourseList courses={data.courses} />} />
            <Route path="/edit" element={<EditForm />} />
          </Routes>
        </div>
      </BrowserRouter>
    );
  }


export default App;
