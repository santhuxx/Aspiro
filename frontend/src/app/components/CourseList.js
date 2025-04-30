import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [instituteName, setInstituteName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [courseType, setCourseType] = useState("online");
  const [courseStatus, setCourseStatus] = useState("ongoing");
  const [editIndex, setEditIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query

  // Handle input changes for text fields
  const handleInputChange = (setter) => (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z0-9\s]*$/.test(value)) {
      setter(value);
    }
  };

  // Start date validation
  const handleStartDateChange = (e) => {
    const value = e.target.value;
    const today = new Date().toISOString().split("T")[0];
    if (value <= today) {
      setStartDate(value);
    } else {
      alert("Start date cannot be in the future!");
    }
  };

  // End date validation for completed courses
  const handleEndDateChange = (e) => {
    const value = e.target.value;
    const today = new Date().toISOString().split("T")[0];

    if (courseStatus === "completed") {
      if (value && value > today) {
        alert("End date for completed courses cannot be in the future!");
      } else if (value >= startDate || value === startDate) {
        setEndDate(value);
      } else {
        alert("End date cannot be earlier than start date!");
      }
    } else if (courseStatus === "ongoing") {
      if (value && value < startDate) {
        alert("End date cannot be earlier than start date!");
      } else {
        setEndDate(value); // Allow future dates for ongoing courses
      }
    }
  };

  const handleAddCourse = () => {
    if (!courseName.trim() || !instituteName.trim() || !description.trim() || !startDate || (courseStatus === "completed" && !endDate)) {
      alert("All fields are required!");
      return;
    }

    if (editIndex === null) {
      const duplicate = courses.some(
        (course) =>
          course.courseName.toLowerCase() === courseName.toLowerCase() &&
          course.instituteName.toLowerCase() === instituteName.toLowerCase()
      );

      if (duplicate) {
        alert("This course already exists!");
        return;
      }

      setCourses([
        ...courses,
        { courseName, instituteName, description, startDate, endDate, courseType, courseStatus },
      ]);
    } else {
      const updatedCourses = [...courses];
      updatedCourses[editIndex] = {
        courseName,
        instituteName,
        description,
        startDate,
        endDate,
        courseType,
        courseStatus,
      };
      setCourses(updatedCourses);
    }

    clearForm();
    setShowForm(false);
  };

  const handleEditCourse = (index) => {
    setCourseName(courses[index].courseName);
    setInstituteName(courses[index].instituteName);
    setDescription(courses[index].description);
    setStartDate(courses[index].startDate);
    setEndDate(courses[index].endDate);
    setCourseType(courses[index].courseType);
    setCourseStatus(courses[index].courseStatus);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDeleteCourse = (index) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setCourses(courses.filter((_, i) => i !== index));
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
    setEditIndex(null);
  };

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Filter courses based on search query
  const filteredCourses = courses.filter((course) => 
    course.courseName.toLowerCase().includes(searchQuery) ||
    course.instituteName.toLowerCase().includes(searchQuery)
  );

  return (
    <Box
      sx={{
        background: "#B5CFB4",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        maxWidth: "500px",
      }}
    >
      <TextField
        label="Search Courses"
        fullWidth
        value={searchQuery}
        onChange={handleSearchChange}
        margin="normal"
        sx={{ marginBottom: "20px" }}
      />

      <Button
        variant="contained"
        sx={{
          backgroundColor: "#14523D",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#062b14",
          },
        }}
        onClick={() => setShowForm(true)}
      >
        Add Course
      </Button>

      <Dialog open={showForm} onClose={() => setShowForm(false)}>
        <DialogTitle>{editIndex !== null ? "Edit Course" : "Add Course"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Institute Name"
            fullWidth
            value={instituteName}
            onChange={handleInputChange(setInstituteName)}
            margin="normal"
          />
          <TextField
            label="Course Name"
            fullWidth
            value={courseName}
            onChange={handleInputChange(setCourseName)}
            margin="normal"
          />
          <TextField
            label="Course Description"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            value={startDate}
            onChange={handleStartDateChange}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          {courseStatus === "completed" && (
            <TextField
              label="End Date"
              type="date"
              fullWidth
              value={endDate}
              onChange={handleEndDateChange}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
          {courseStatus === "ongoing" && (
            <TextField
              label="Optional End Date (Future)"
              type="date"
              fullWidth
              value={endDate}
              onChange={handleEndDateChange}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
          <Box mt={2}>
            <Typography variant="body1">Course Type</Typography>
            <Button
              variant={courseType === "online" ? "contained" : "outlined"}
              onClick={() => setCourseType("online")}
              sx={{ marginRight: 2 }}
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
          <Box mt={2}>
            <Typography variant="body1">Course Status</Typography>
            <Button
              variant={courseStatus === "ongoing" ? "contained" : "outlined"}
              onClick={() => setCourseStatus("ongoing")}
              sx={{ marginRight: 2 }}
            >
              Ongoing
            </Button>
            <Button
              variant={courseStatus === "completed" ? "contained" : "outlined"}
              onClick={() => setCourseStatus("completed")}
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
            {editIndex !== null ? "Update Course" : "Add Course"}
          </Button>
        </DialogActions>
      </Dialog>

      <Box mt={2}>
        <Typography variant="h6" color="#423F3F">Ongoing Courses</Typography>
        <Box sx={{ maxHeight: "300px", overflowY: "auto", paddingRight: "10px" }}>
          {filteredCourses
            .filter((course) => course.courseStatus === "ongoing")
            .map((course, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
                sx={{
                  padding: "10px",
                  borderRadius: "5px",
                  boxShadow: 1,
                  background: "rgba(255, 255, 255, 0.3)",
                  borderRadius: "8px",
                  marginBottom: "8px",
                  color: "black",
                }}
              >
                <Typography
                  variant="body1"
                  onClick={() => alert(`Course Details: ${course.description}`)}
                  style={{ cursor: "pointer", fontWeight: "bold", fontSize: "16px" }}
                >
                  {course.courseName}
                </Typography>
                <Box>
                  <Button
                    color="primary"
                    onClick={() => handleEditCourse(index)}
                    size="small"
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    color="error"
                    onClick={() => handleDeleteCourse(index)}
                    size="small"
                  >
                    <DeleteIcon />
                  </Button>
                </Box>
              </Box>
            ))}
        </Box>

        <Typography variant="h6" color="#423F3F" >Completed Courses</Typography>
        <Box sx={{ maxHeight: "300px", overflowY: "auto", paddingRight: "10px" }}>
          {filteredCourses
            .filter((course) => course.courseStatus === "completed")
            .map((course, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
                sx={{
                  padding: "10px",
                  borderRadius: "5px",
                  boxShadow: 1,
                  background: "rgba(255, 255, 255, 0.3)",
                  borderRadius: "8px",
                  marginBottom: "8px",
                  color: "black",
                }}
              >
                <Typography
                  variant="body1"
                  onClick={() => alert(`Course Details: ${course.description}`)}
                  style={{ cursor: "pointer", fontWeight: "bold", fontSize: "16px" }}
                >
                  {course.courseName}
                </Typography>
                <Box>
                  <Button
                    color="primary"
                    onClick={() => handleEditCourse(index)}
                    size="small"
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    color="error"
                    onClick={() => handleDeleteCourse(index)}
                    size="small"
                  >
                    <DeleteIcon />
                  </Button>
                </Box>
              </Box>
            ))}
        </Box>
      </Box>
    </Box>
  );
};

export default CourseList;




















