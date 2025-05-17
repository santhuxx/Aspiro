"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { db } from "@/firebase/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

const CourseList = ({ email }) => {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [instituteName, setInstituteName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [courseType, setCourseType] = useState("online");
  const [courseStatus, setCourseStatus] = useState("ongoing");
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("CourseList initialized with email:", email);
    if (!email) {
      setError("No user email provided. Please log in.");
      setLoading(false);
      return;
    }

    const fetchCourses = async () => {
      setLoading(true);
      setError("");
      try {
        const coursesRef = collection(db, "userCourses", email, "courses");
        const q = query(coursesRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedCourses = [];
        querySnapshot.forEach((doc) => {
          fetchedCourses.push({ id: doc.id, ...doc.data() });
        });
        setCourses(fetchedCourses);
        console.log("Fetched courses:", fetchedCourses);
      } catch (err) {
        console.error("Error fetching courses:", err, { code: err.code, message: err.message });
        setError(`Failed to load courses: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [email]);

  const handleInputChange = (setter) => (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z0-9\s]*$/.test(value)) {
      setter(value);
    }
  };

  const handleStartDateChange = (e) => {
    const value = e.target.value;
    if (value) {
      setStartDate(value);
    } else {
      alert("Please select a valid start date.");
    }
  };

  const handleEndDateChange = (e) => {
    const value = e.target.value;
    const today = new Date().toISOString().split("T")[0];

    if (value && value < startDate) {
      alert("End date cannot be earlier than start date!");
      return;
    }

    if (courseStatus === "completed") {
      if (value && value > today) {
        alert("End date for completed courses cannot be in the future!");
      } else if (value) {
        setEndDate(value);
      } else {
        alert("End date is required for completed courses!");
      }
    } else if (courseStatus === "ongoing") {
      setEndDate(value); // Allow future or empty end dates for ongoing courses
    }
  };

  const handleAddCourse = async () => {
    if (!courseName.trim() || !instituteName.trim() || !description.trim() || !startDate || (courseStatus === "completed" && !endDate)) {
      alert("All required fields must be filled!");
      return;
    }

    if (!email) {
      setError("Cannot save course: No user email provided.");
      return;
    }

    try {
      const courseData = {
        courseName: courseName.trim(),
        instituteName: instituteName.trim(),
        description: description.trim(),
        startDate,
        endDate: endDate || "",
        courseType,
        courseStatus,
        createdAt: Timestamp.now(),
      };

      console.log("Saving course data:", courseData);

      if (editId) {
        const courseRef = doc(db, "userCourses", email, "courses", editId);
        await updateDoc(courseRef, courseData);
        setCourses(courses.map((c) => (c.id === editId ? { id: editId, ...courseData } : c)));
        console.log("Course updated:", { id: editId, ...courseData });
      } else {
        const duplicate = courses.some(
          (course) =>
            course.courseName.toLowerCase() === courseName.toLowerCase().trim() &&
            course.instituteName.toLowerCase() === instituteName.toLowerCase().trim()
        );
        if (duplicate) {
          alert("This course already exists!");
          return;
        }
        const courseRef = await addDoc(collection(db, "userCourses", email, "courses"), courseData);
        setCourses([{ id: courseRef.id, ...courseData }, ...courses]);
        console.log("Course added:", { id: courseRef.id, ...courseData });
      }

      clearForm();
      setShowForm(false);
    } catch (err) {
      console.error("Error saving course:", err, {
        code: err.code,
        message: err.message,
        email,
        courseData,
      });
      setError(`Failed to save course: ${err.message}`);
    }
  };

  const handleEditCourse = (course) => {
    setCourseName(course.courseName);
    setInstituteName(course.instituteName);
    setDescription(course.description);
    setStartDate(course.startDate);
    setEndDate(course.endDate);
    setCourseType(course.courseType);
    setCourseStatus(course.courseStatus);
    setEditId(course.id);
    setShowForm(true);
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteDoc(doc(db, "userCourses", email, "courses", id));
        setCourses(courses.filter((c) => c.id !== id));
        console.log("Course deleted:", id);
      } catch (err) {
        console.error("Error deleting course:", err, { code: err.code, message: err.message });
        setError(`Failed to delete course: ${err.message}`);
      }
    }
  };

  const clearForm = () => {
    setCourseName("");
    setInstituteName("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setCourseType("online");
    setCourseStatus("ongoing");
    setEditId(null);
    setError("");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.courseName.toLowerCase().includes(searchQuery) ||
      course.instituteName.toLowerCase().includes(searchQuery)
  );




  return (
    <Box
      sx={{
        background: "#B5CFB4",
        p: 3,
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
      }}
    >
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress sx={{ color: "#14523D" }} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : (
        <>
          <TextField
            label="Search Courses"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            margin="normal"
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={() => setShowForm(true)}
            sx={{
              backgroundColor: "#14523D",
              "&:hover": { backgroundColor: "#062b14" },
              mb: 1,
            }}
          >
            Add Course
          </Button>
          

          <Dialog open={showForm} onClose={() => setShowForm(false)}>
            <DialogTitle>{editId ? "Edit Course" : "Add Course"}</DialogTitle>
            <DialogContent>
              <TextField
                label="Institute Name"
                fullWidth
                value={instituteName}
                onChange={handleInputChange(setInstituteName)}
                margin="normal"
                required
              />
              <TextField
                label="Course Name"
                fullWidth
                value={courseName}
                onChange={handleInputChange(setCourseName)}
                margin="normal"
                required
              />
              <TextField
                label="Course Description"
                fullWidth
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                margin="normal"
                required
              />
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                value={startDate}
                onChange={handleStartDateChange}
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                label={courseStatus === "completed" ? "End Date" : "Optional End Date"}
                type="date"
                fullWidth
                value={endDate}
                onChange={handleEndDateChange}
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required={courseStatus === "completed"}
              />
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">Course Type</Typography>
                <Button
                  variant={courseType === "online" ? "contained" : "outlined"}
                  onClick={() => setCourseType("online")}
                  sx={{ mr: 2 }}
                >
                  Online
                </Button>
                <Button
                  variant={courseType === "physical" ? "contained" : "outlined"}
                  onClick={() => setCourseType("physical")}
                >
                  Physical
                </Button>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">Course Status</Typography>
                <Button
                  variant={courseStatus === "ongoing" ? "contained" : "outlined"}
                  onClick={() => setCourseStatus("ongoing")}
                  sx={{ mr: 2 }}
                >
                  Ongoing
                </Button>
                <Button
                  variant={courseStatus === "completed" ? "contained" : "outlined"}
                  onClick={() => setCourseType("completed")}
                >
                  Completed
                </Button>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowForm(false)} color="secondary">
                Cancel
              </Button>
              <Button
                onClick={handleAddCourse}
                color="primary"
                disabled={
                  !courseName.trim() ||
                  !instituteName.trim() ||
                  !description.trim() ||
                  !startDate ||
                  (courseStatus === "completed" && !endDate)
                }
              >
                {editId ? "Update Course" : "Add Course"}
              </Button>
            </DialogActions>
          </Dialog>

          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" color="#14523D">
              Ongoing Courses
            </Typography>
            <Box sx={{ maxHeight: "300px", overflowY: "auto", pr: 1 }}>
              {filteredCourses
                .filter((course) => course.courseStatus === "ongoing")
                .map((course) => (
                  <Box
                    key={course.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 2,
                      mb: 1,
                      borderRadius: "8px",
                      bgcolor: "rgba(255, 255, 255, 0.3)",
                      boxShadow: 1,
                    }}
                  >
                    <Typography
                      variant="body1"
                      onClick={() => alert(`Course Details: ${course.description}`)}
                      sx={{ cursor: "pointer", fontWeight: "bold" }}
                    >
                      {course.courseName} ({course.instituteName})
                    </Typography>
                    <Box>
                      <Button
                        color="primary"
                        onClick={() => handleEditCourse(course)}
                        size="small"
                      >
                        <EditIcon />
                      </Button>
                      <Button
                        color="error"
                        onClick={() => handleDeleteCourse(course.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </Button>
                    </Box>
                  </Box>
                ))}
            </Box>

            <Typography variant="h6" color="#14523D" sx={{ mt: 2 }}>
              Completed Courses
            </Typography>
            <Box sx={{ maxHeight: "300px", overflowY: "auto", pr: 1 }}>
              {filteredCourses
                .filter((course) => course.courseStatus === "completed")
                .map((course) => (
                  <Box
                    key={course.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 2,
                      mb: 1,
                      borderRadius: "8px",
                      bgcolor: "rgba(255, 255, 255, 0.3)",
                      boxShadow: 1,
                    }}
                  >
                    <Typography
                      variant="body1"
                      onClick={() => alert(`Course Details: ${course.description}`)}
                      sx={{ cursor: "pointer", fontWeight: "bold" }}
                    >
                      {course.courseName} ({course.instituteName})
                    </Typography>
                    <Box>
                      <Button
                        color="primary"
                        onClick={() => handleEditCourse(course)}
                        size="small"
                      >
                        <EditIcon />
                      </Button>
                      <Button
                        color="error"
                        onClick={() => handleDeleteCourse(course.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </Button>
                    </Box>
                  </Box>
                ))}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default CourseList;
