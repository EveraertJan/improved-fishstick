
# Student Attendance Monitor

A Dockerized system for tracking student attendance during lectures using automated recognition and database logging.

## Features

* Facial recognition–based attendance tracking
* Web dashboard for attendance reports
* REST API for data retrieval
* PostgreSQL for storage

## Components

* **frontend**: HTML dashboard
* **backend**: Seperate Node API service for handling recognition and API endpoints
* **database**: PostgreSQL instance

## Setup

use the .env.template to create a new .env file

```bash
git https://github.com/JanEveraertEHB/DEV-V-2025
cd DEV-V-2025
docker compose up -d --build
```

## Usage

* Access dashboard: `http://localhost:8080`
* API base URL: `http://localhost:3000/`

## Logs

```bash
docker compose logs -f
```

## Stopping

```bash
docker compose down
```
## Author
Jan Everaert (jan.everaert@ehb.be)
