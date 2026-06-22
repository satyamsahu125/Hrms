# Negative Testing Report

## Overview

I performed negative testing on the application to check how the system behaves when users enter wrong data or perform invalid actions. The purpose of this testing was to find validation issues, security issues, and error handling problems.

---

# BUG-001: Invalid URL Shows Application Error

## Feature

Routing / Error Handling

## Test Performed

I entered an invalid URL endpoint which does not exist in the application after that failed to access the system/server.

Example:

/employee/dashboard/EMP123

## Expected Result

The system should show a proper 404 page or an error message.

## Actual Result

The application shows an unexpected error page instead of handling the request properly.

## Result

FAIL

## Risk

Users may face application errors and poor user experience.

---

# BUG-002: User can apply for Leave  with End Date Before Start Date

## Feature

Leave Management

## Test Performed

i tried to submit a leave request with:

Start Date: 20-Jun-2025

End Date: 15-Jun-2025

## Expected Result

The system should not allow the request and should show a validation message.

## Actual Result

The leave request was submitted successfully without any validation.

## Result

FAIL

## Risk

Wrong leave records can affect attendance and payroll calculations.

---


# BUG-003: User can apply for leave for unrealistic days

## Feature

Leave Management / Validation

## Test Performed

I tried to apply leave for unrealistic date ranges such as:

- 100 years
- 1000 years
- Leave before employee joining date

## Expected Result

The system should validate the dates and reject such requests.

## Actual Result

The leave requests were submitted successfully without any validation.
The leave request was submitted successfully for the date before employee joining.

## Result

FAIL

## Risk

Invalid leave data can create payroll and attendance issues.

---

# BUG-004: No Maximum Length Validation in Text Fields

## Feature

Employee Management

## Test Performed

i Tried to Enter very long values (1000+ characters) in:

- First Name
- Last Name
- Other text fields

## Expected Result

The text field should be contrain with minimum or maximum length.
The system should restrict the number of characters and show a validation message.

## Actual Result

The application accepted the values without any validation breaking ui Experience.


## Result

FAIL

## Risk

This may cause database issues, display issues, and poor data quality.

---

# BUG-005: Unlimited Failed Login Attempts

## Feature

Authentication

## Test Performed

I tried enter wrong password multiple times.

## Expected Result

Employee Should be blocked for any time limit .
The system should limit the failed  login attempts.

## Actual Result

The application allows unlimited failed login attempt.

## Result

FAIL

## Risk

This increases the risk of brute-force attacks and unauthorized access attempts.

---

# Summary

| Test ID |                     Feature                               | Result |
|---------|-----------------------------------------------------------|--------|
| BUG-001 | Invalid URL Shows Application Error                       | FAIL   |
| BUG-002 | User can apply for Leave  with End Date Before Start Date | FAIL   |
| BUG-003 | User can apply for leave for unrealistic days             | FAIL   |
| BUG-004 | No Maximum Length Validation in Text Fields               | FAIL   |
| BUG-005 | Unlimited Failed Login Attempts                           | FAIL   |

## Conclusion

During negative testing, several validation and security issues were found in the application. The most important issues are missing leave date validation, unlimited login attempts, and no maximum length validation in input fields. These issues should be fixed to improve application quality and prevent future problems.