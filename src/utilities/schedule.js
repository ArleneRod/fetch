import { terms } from './time';  

const meetsPat = /^ *((?:M|Tu|W|Th|F)+) +(\d\d?):(\d\d) *[ -] *(\d\d?):(\d\d) *$/;

export const timeParts = (meets) => {
    const [match, days, hh1, mm1, hh2, mm2] = meetsPat.exec(meets) || [];
    return !match ? {} : {
        days,
        hours: {
            start: hh1 * 60 + mm1 * 1,
            end: hh2 * 60 + mm2 * 1
        }
    };
};

export const addCourseTimes = (course) => ({
    ...course,
    ...timeParts(course.meets)
});

export const addScheduleTimes = (schedule) => ({
    title: schedule.title,
    courses: Object.fromEntries(
      Object.entries(schedule.courses).map(([key, value]) => [
        key, 
        { 
          ...addCourseTimes(value), 
          id: key 
        }
      ])
    )
  });

export const fetchSchedule = async () => {
    const url = "https://courses.cs.northwestern.edu/394/guides/data/cs-courses.php";
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch data");
    return addScheduleTimes(await response.json());
};
export const getCourseNumber = course => {
    if (!course || !course.id) return '';
    return course.id.slice(1, 4);
  };
  
  export const getCourseTerm = course => {
    if (!course || !course.id) return '';
    return terms[course.id.charAt(0)] || '';
  };
 