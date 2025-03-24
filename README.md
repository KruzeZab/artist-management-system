# Artist Management System

## Project Overview

This project is an Artist Management System built with Node.js (without Express) on the backend and HTML, CSS, and vanilla JavaScript on the frontend. The system allows users to manage artists and their songs with role-based access control (RBAC). The backend is structured into three main layers: Controller, Service, and Model. The frontend uses vanilla JavaScript and custom CSS divided by pages.

## Live Demo

https://jam.dev/c/affec2c1-f010-440f-b94c-ac56a80579d2

## Features

- **User Authentication**: Users can register, log in, and log out.

- **User Management**: Super Admin can view, update, and delete user accounts.

- **Artist Management**: Artist managers can create, view, and update artists.

- **Song Management**: Artists can upload, view, update, and delete their songs.

- **Role-Based Access Control**: Only users with appropriate roles (Super Admin, Artist Manager, Artist) can perform certain actions.

- **Husky Eslint Prettier For Linting**: Used for linting code and pre-commit hook.

## Technologies Used

- **Backend**: Node.js (Vanilla JS)

- **Frontend**: HTML, CSS, Vanilla JavaScript

- **Database**: PostgreSQL

- **Authentication**: Token Based Authentication

- **Listing User Songs**: Users can view the songs associated with their profile.

- **Listing User Artists**: Users can view the artists associated with their profile.

## Getting Started

### Backend Setup with Docker

1.  **Clone the repository**:

bash

CopyEdit

`git clone git@github.com:KruzeZab/artist-management-system.git`

2.  **Navigate to the project directory**:

bash

CopyEdit

`cd artist-management-system`

3.  **Run the backend and database with Docker**:

bash

CopyEdit

`docker compose up`

This will start the backend server and PostgreSQL database.

### Frontend Setup

1.  **Navigate to the frontend directory**:

bash

`cd frontend`

2.  **Install dependencies**:

bash

CopyEdit

`yarn install`

3.  **Build the frontend**:

bash

CopyEdit

`yarn build`

4.  **Serve the frontend**: After building, you can serve the frontend from the `/dist` folder using a static file server or open the files directly in your browser.
