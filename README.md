# Proof of Work / Daily Progress Tracker

![Architecture Diagram](https://i.ibb.co/TqBtwd26/Screenshot-2026-10-25-at-5-28-35-PM.png)[cite: 1]

## Overview
A zero-cost, serverless automated daily progress tracking system designed to monitor task completion and study hours. Built using Google Apps Script and Google Sheets, this system features a password-protected frontend form that logs daily metrics directly into a spreadsheet database. It utilizes built-in time-driven triggers to function as a cloud scheduler, automatically sending customized daily and weekly email reports via the Gmail API[cite: 1].

## Features
* **Password-Protected Frontend:** Secure HTML/JS form designed to be hosted on any static site (e.g., GitHub Pages, custom portfolio domain).
* **Automated Email Reminders:** Sends a prompt every night at 10:00 PM to log the day's progress.
* **Daily Progress Reports:** Generates and emails a breakdown of yesterday's completed tasks and study hours at 6:00 AM.
* **Weekly Analytics Dashboard:** Calculates a 7-day rolling average and completion rate, emailed every Sunday at 8:00 AM.
* **Serverless Database:** Utilizes Google Sheets as a lightweight, accessible backend database.

## Tech Stack
* **Frontend:** HTML, CSS, Vanilla JavaScript (Fetch API)
* **Backend:** Google Apps Script (Serverless)
* **Database:** Google Sheets
* **Integrations:** Gmail API, Google Cloud Scheduler (Time-driven triggers)[cite: 1]

## Setup & Installation

**1. Backend (Google Apps Script)**
1. Create a new Google Sheet and navigate to **Extensions > Apps Script**.
2. Paste the contents of `Code.gs` into the editor.
3. Update the `PORTFOLIO_FORM_LINK` and `SECRET_PASSWORD` constants with your personal values.
4. Run the `setupSheet()` function manually once to generate the database headers.
5. Run the `setupTriggers()` function manually once to authorize the Gmail API and schedule the automated emails.
6. Click **Deploy > New deployment**, select **Web app**, set access to **Anyone**, and copy the resulting Web App URL.

**2. Frontend (HTML)**
1. Open the `index.html` file (or your portfolio's codebase).
2. Locate the `<script>` block at the bottom of the file.
3. Replace the `WEB_APP_URL` variable with the Web App URL generated from your Google Apps Script deployment.
4. Host the HTML file on your preferred platform (e.g., GitHub Pages, Vercel, or custom server).

## Usage
* **Testing Emails:** Open the Apps Script editor, select `testDailyEmail`, `testWeeklyEmail`, or `testEveningReminder` from the top function dropdown, and click **Run**.
* **Updating the Script:** Anytime changes are made to the `Code.gs` file, you must deploy a **New Deployment** for the changes to take effect on the live form.
