# ProfileVault - Complete Project Specification

## Project Overview

ProfileVault is a full-stack web application designed to securely manage user profiles, personal information, supporting documents, and downloadable profile documents.

The application allows users to register, authenticate, maintain their personal profile, upload supporting documents, and generate downloadable PDF and DOCX documents containing their profile information.

The primary objective is to build a production-ready application following modern full-stack development standards, including secure authentication, proper validation, modular architecture, file management, document generation, and deployment readiness.

---

# Original Task Requirements

Build a web application that provides:

### User Authentication

* Self-registration
* Username and password authentication
* Session management using JWT
* Proper validation and error handling

### Personal Details Management

Capture and manage:

* Full Name
* Date of Birth
* Email Address
* Mobile Number
* Address

### File Upload

Allow users to upload supporting documents.

Supported formats:

* JPG
* PNG
* PDF

Requirements:

* Validate file type
* Validate file size
* Store uploaded file metadata
* Associate uploaded files with user profile

### Document Generation

Generate downloadable:

* PDF document
* Microsoft Word (.docx) document

The generated document must contain submitted profile details.

### Profile Management

Allow authenticated users to:

* View profile
* Update profile
* Change password

---

# Project Goals

The application should demonstrate:

* Authentication & Authorization
* Secure Password Handling
* MongoDB Data Modeling
* File Upload Management
* Document Generation
* API Design
* Frontend Form Handling
* Validation
* Logging
* Security Best Practices
* Production Deployment

---

# Technology Stack

## Frontend

* React
* React Router DOM
* React Hook Form
* Zod
* @hookform/resolvers
* TanStack Query
* Axios
* Tailwind CSS
* shadcn/ui
* Sonner

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Zod
* Multer
* Winston
* Morgan
* Helmet
* Cors
* bcryptjs
* jsonwebtoken

## Database

MongoDB Atlas

## Deployment

Vercel

## Repository Structure

Monorepo

profile-vault/
├── Frontend/
└── Backend/

---

# Architecture Overview

## High Level Architecture

Frontend (React)
↓
REST APIs
↓
Backend (Express)
↓
MongoDB Atlas

For Documents:

User Upload
↓
Storage Provider
↓
Store Metadata In MongoDB

---

# Storage Architecture

The system must support multiple storage providers.

Storage provider should be configurable through environment variables.

Environment Variable:

STORAGE_PROVIDER=local

or

STORAGE_PROVIDER=blob

### Local Storage Mode

Files stored inside:

uploads/

Metadata stored in MongoDB.

### Blob Storage Mode

Use Vercel Blob Storage.

Environment Variable:

BLOB_READ_WRITE_TOKEN

Metadata stored in MongoDB.

The application should use a storage abstraction layer so switching providers does not require code changes in business modules.

---

# Authentication Architecture

Authentication must be JWT based.

Protected routes require:

Authorization: Bearer <token>

Passwords must be hashed using bcryptjs.

No plain text passwords should ever be stored.

---

# Validation Strategy

Validation must exist at two levels.

Frontend:

* React Hook Form
* Zod

Backend:

* Zod

Backend validation is the source of truth.

Never trust frontend validation alone.

---

# Logging Strategy

Morgan:

* Request logging

Winston:

* Application logs
* Error logs
* Warning logs

Logs should be stored inside:

logs/

---

# Security Requirements

Implement:

* Helmet
* Cors
* JWT Authentication
* Password Hashing
* File Type Validation
* File Size Validation
* Input Validation

---

# Development Principles

Follow industry-standard architecture.

Requirements:

* Modular architecture
* Feature-based modules
* Reusable services
* Separation of concerns
* Centralized error handling
* Standardized API responses
* Proper folder structure
* Environment-based configuration

The project must be developed phase-by-phase.

Do not skip phases.

Do not start frontend development until backend APIs are completed and tested.

---

# Development Plan

# ProfileVault - Cursor Development Plan

## Project Overview

Repository Structure:

profile-vault/
├── Frontend/
└── Backend/

Development Order:

1. Infrastructure Setup
2. Database Design
3. Backend Foundation
4. Authentication Module
5. Profile Module
6. Upload Module
7. Document Generation Module
8. Backend Testing
9. Frontend Setup
10. Authentication UI
11. Profile UI
12. Upload UI
13. Document Download UI
14. Dashboard
15. End-to-End Testing
16. Deployment
17. Documentation

---

# PHASE 1 — Infrastructure Setup

Goal:
Setup MongoDB Atlas and Storage Configuration.

Tasks:

1. Create MongoDB Atlas Cluster

2. Create Database:
   profile_vault

3. Create Environment Variables

Backend .env:

PORT=5000

NODE_ENV=development

MONGODB_URI=

JWT_SECRET=

JWT_EXPIRES_IN=7d

USE_BLOB_STORAGE=false

BLOB_READ_WRITE_TOKEN=

CLIENT_URL=http://localhost:5173

4. Storage Strategy

Implement configuration driven storage.

If:

USE_BLOB_STORAGE=true

Use Vercel Blob.

If:

USE_BLOB_STORAGE=false

Use local uploads folder.

Storage Service must abstract both implementations.

Expected Result:

Storage provider can be switched without changing business logic.

---

# PHASE 2 — Database Design

Goal:
Design database before writing APIs.

Collections:

1. Users
2. Profiles

User Schema

Fields:

username
password
isActive
lastLoginAt
createdAt
updatedAt

Constraints:

username:

* required
* unique
* trim
* lowercase

password:

* required
* hashed

Indexes:

username unique

---

Profile Schema

Fields:

userId

fullName

dob

email

mobile

address

documents

createdAt
updatedAt

Constraints:

userId:

* unique
* reference User

fullName:

* required
* trim

email:

* required
* unique

mobile:

* required

address:

* required

---

Document Sub Schema

Fields:

storageType

originalName

mimeType

size

url

uploadedAt

storageType:

local
blob

Supported Types:

image/jpeg

image/png

application/pdf

---

PHASE COMPLETE WHEN:

Schemas created
Indexes created
Database connection verified

Commit:
feat(database): create initial schemas

---

# PHASE 3 — Backend Foundation

Goal:
Create production grade backend architecture.

Install:

express
mongoose
zod
helmet
cors
morgan
winston
dotenv
cookie-parser

Folder Structure:

src/

config/

modules/

middlewares/

services/

utils/

validations/

constants/

logs/

uploads/

Setup:

1. Express App

2. Mongo Connection

3. Global Error Handler

4. Async Handler Utility

5. Winston Logger

6. Morgan Logger

7. Helmet

8. Cors

9. Health Check Route

GET /health

Expected Response:

{
success: true
}

---

PHASE COMPLETE WHEN:

Server starts
Health route works
Logs generated

Commit:
feat(core): setup backend foundation

---

# PHASE 4 — Authentication Module

Goal:
Complete authentication before touching profiles.

Install:

bcryptjs

jsonwebtoken

Create:

auth module

Features:

Register

Login

Logout

Get Current User

Change Password

APIs:

POST /api/auth/register

POST /api/auth/login

GET /api/auth/me

POST /api/auth/logout

PUT /api/auth/change-password

Requirements:

Password Hashing

JWT Authentication

JWT Middleware

Zod Validation

Response Standardization

---

PHASE COMPLETE WHEN:

Register works

Login works

JWT works

Protected routes work

Commit:
feat(auth): complete authentication module

---

# PHASE 5 — Profile Module

Goal:
Manage personal information.

APIs:

POST /api/profile

GET /api/profile

PUT /api/profile

Features:

Create Profile

View Profile

Update Profile

Validation:

Full Name

DOB

Email

Mobile

Address

All APIs protected.

---

PHASE COMPLETE WHEN:

Profile CRUD works

Commit:
feat(profile): implement profile module

---

# PHASE 6 — Upload Module

Goal:
Implement file uploads.

Install:

multer

Create:

Storage Service

Local Storage Service

Blob Storage Service

Multer Configuration

Validation:

jpg

jpeg

png

pdf

Maximum:

5 MB

API:

POST /api/upload

Flow:

Request

→ Validate

→ Store

→ Save Metadata

→ Return File Information

---

PHASE COMPLETE WHEN:

Local Upload Works

Blob Upload Works

Metadata Stored

Commit:
feat(upload): implement upload service

---

# PHASE 7 — Document Generation

Goal:
Generate PDF and DOCX.

Install:

pdfkit

docx

Endpoints:

GET /api/documents/pdf

GET /api/documents/docx

Document Contents:

Full Name

DOB

Email

Mobile

Address

Generated from profile.

---

PHASE COMPLETE WHEN:

PDF downloads

DOCX downloads

Commit:
feat(document): implement document generation

---

# PHASE 8 — Backend Validation

Goal:
Verify backend independently.

Test:

Register

Login

JWT

Profile CRUD

Upload

PDF

DOCX

Fix bugs.

---

PHASE COMPLETE WHEN:

All APIs working

Commit:
chore(backend): backend stable

---

# PHASE 9 — Frontend Setup

Goal:
Initialize frontend.

Create React Project.

Install:

react-router-dom

axios

react-hook-form

zod

@hookform/resolvers

@tanstack/react-query

tailwindcss

shadcn

sonner

Create:

Routing

Axios Client

Query Client

Layout Structure

Protected Routes

---

PHASE COMPLETE WHEN:

Frontend starts successfully

Commit:
feat(frontend): initial setup

---

# PHASE 10 — Authentication UI

Pages:

Register

Login

Features:

React Hook Form

Zod Validation

API Integration

Error Handling

Toast Notifications

---

PHASE COMPLETE WHEN:

User can register

User can login

Protected routes work

Commit:
feat(frontend): auth pages

---

# PHASE 11 — Profile UI

Pages:

Profile Page

Create Profile

Update Profile

View Profile

Fields:

Full Name

DOB

Email

Mobile

Address

---

PHASE COMPLETE WHEN:

Profile APIs integrated

Commit:
feat(frontend): profile management

---

# PHASE 12 — Upload UI

Features:

File Picker

File Validation

Upload Progress

Uploaded File List

Preview Images

Download Files

---

PHASE COMPLETE WHEN:

Uploads working

Commit:
feat(frontend): upload module

---

# PHASE 13 — Document Download UI

Buttons:

Download PDF

Download DOCX

Connect backend APIs.

---

PHASE COMPLETE WHEN:

Documents downloadable

Commit:
feat(frontend): document downloads

---

# PHASE 14 — Dashboard

Dashboard Components:

Profile Summary

Uploaded Documents

Quick Actions

Logout

Change Password

---

PHASE COMPLETE WHEN:

Dashboard complete

Commit:
feat(frontend): dashboard

---

# PHASE 15 — End To End Testing

Test:

Authentication

Profile

Upload

Document Generation

Change Password

Logout

Fix all issues.

Commit:
test: complete application testing

---

# PHASE 16 — Deployment

Backend:

Vercel

Frontend:

Vercel

Database:

MongoDB Atlas

Storage:

Vercel Blob

Environment Variables:

MONGODB_URI

JWT_SECRET

BLOB_READ_WRITE_TOKEN

USE_BLOB_STORAGE=true

---

# PHASE 17 — Documentation

Create:

README.md

Installation Guide

Environment Variables

API Documentation

Deployment Guide

Architecture Diagram

Commit:
docs: complete project documentation
