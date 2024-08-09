
# Learnify - A Online Learning Platform

An Online Learning Platform developed using the MERN Stack (MongoDB, Express.js, React.js, Node.js)

## Objective:

Provide a feature-rich online learning platform that allows for live video conferencing, course creation, and approval processes. It should have three user types: student, teacher, and administrator.

## Features

#### 1. *User Authentication:*
   - Student Login & SignUp
   - Teacher Login & SignUp
   - Admin Login & SignUp

#### 2. *Application Approval:*
   - Students and teachers can submit applications for approval.
   - Admin validates and approves the applications of users.

#### 3. *Dashboard:*
   - Students see enrolled courses, scheduled classes , browse courses
   - Teachers can created courses,  view student enrollments
   - Teachers can schedule classes via google meet links

#### 4. *Course Enrollment:*
   - Students can browse and enroll on courses on the platform.
   - Students can unenroll from the courses also

#### 5. *Live Video Conferencing:*
   - Integrated video conferencing tool (similar to Google Meet) for real-time teacher-student interaction.

#### 6. *Email Notifications:*
   - When a user signs up or enrolls in a course, send them an email.


## *Tech Stack:*

#### *UI/UX:*
  - figma

#### *Frontend:*
  - React (Vite) for dynamic and responsive UI.
  - Tailwindcss

#### *Backend:*
  - Node.js, Express and Mongoose for server-side development.

#### *Database:*
  - MongoDB for storing user profiles, course details, and application data.
  - Cloudinary for image storage

#### *Authentication:*
  - JWT (JSON Web Tokens) for secure authentication.

#### *Video Conferencing:*
  - Schedule classses via google meet links

## Installation and Running the project

- Clone this repository or downloads it
- Go inside the frontend folder and open the console in there.
- Use "npm install" to install the dependencies included in the package.json.
- Go inside the backend folder and open the console in there.
- Use "npm install" to install the dependencies included in the package.json.
- Setup environment variables by creating a ".env" file inside backend folder.
- Search in the project as 'process.env'.
- According to the search results define environment variables in the .env
- You need to create a cloudinary account as well as smtp_email and password for this.
- Start the backend by "npm run dev"
- Start the frontend by "npm run dev"
- First creates an admin using postman by sending a POST request
- Then go to /adminLogin to login as admin
- When you signUp as a user or a teacher first you need to verify the email
- Next you need to update your details
- After that you need to wait till admin approves your account
- The rest you can do it without any issue

## Contribution

- This project was created by Kavindu Kanchana, Jaliya Herath and Prathviharan K