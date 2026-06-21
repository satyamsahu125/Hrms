# Overtime Entry Feature Specification

## Overview

In this feature, a site manager should be able to add overtime details for employees at the end of the day. The overtime information will later be used during payroll generation, so the data should be correct and properly validated.

The feature should also work properly on mobile devices because site managers may enter overtime directly from the construction site.

---

## Acceptance Criteria

1. A site manager should be able to select an active employee from the employee list.

2. The site manager should be able to enter:
   - Employee Name
   - Overtime Date
   - Overtime Hours
   - Reason for Overtime

3. The system should save the overtime record successfully after validation.

4. The overtime entry should be visible in the overtime history.

5. The overtime hours should be considered during payroll generation.

6. The site manager should be able to view overtime records before payroll is generated.

7. The system should show a success message when the overtime is saved successfully.

8. The system should show an error message if something goes wrong during submission.

9. Duplicate overtime entries for the same employee on the same date should not be allowed.

10. The system should store information about who created the overtime record and when it was created.

---

## Edge Cases

While reviewing this feature, I identified the following situations that should be handled properly:

- Employee does not exist.
- Employee is inactive or terminated.
- Overtime hours are negative.
- Overtime hours are 0.
- Overtime hours are more than 24 hours.
- Overtime date is in the future.
- Same employee already has overtime entered for the same date.
- Payroll has already been generated for that period.
- User loses internet connection while submitting the form.
- Required fields are left empty.
- User enters a very long reason.

---

## Questions for Product Manager

Before development starts, I would like clarification on the following points:

1. What is the maximum overtime allowed per day?
2. Is there any monthly overtime limit?
3. Can overtime records be edited after submission?
4. Does overtime require HR approval before payroll generation?
5. What should happen if payroll is already generated and overtime is added later?
6. Should payroll be automatically recalculated after overtime changes?
7. Can managers enter overtime for previous dates?
8. Should duplicate overtime entries be blocked completely or allowed with a warning?

---

## Test Scenarios

### Scenario 1: Successful Overtime Entry

**Given** an active employee exists

**When** the site manager enters 2 overtime hours with a valid date and reason

**Then** the overtime record should be saved successfully

**And** the record should appear in overtime history

---

### Scenario 2: Future Date Validation

**Given** the overtime entry form is open

**When** the site manager selects a future date

**Then** the system should not allow submission

**And** a validation message should be displayed

---

### Scenario 3: Invalid Overtime Hours

**Given** the overtime entry form is open

**When** the site manager enters -2 overtime hours

**Then** the system should display a validation error

**And** the record should not be saved

---

### Scenario 4: Inactive Employee

**Given** an employee is inactive or terminated or is on Leave

**When** the site manager tries to add overtime

**Then** the system should reject the request

**And** display an appropriate error message

---

### Scenario 5: Duplicate Overtime Entry

**Given** overtime already exists for an employee on a specific date

**When** another overtime entry is submitted for the same employee and date

**Then** the system should prevent the duplicate entry

**And** display an appropriate message

---

## Launch Blockers

The feature should not be released if:

- Overtime is not included in payroll calculations.
- Invalid overtime values can be saved.
- Inactive or terminated employees can receive overtime.
- Duplicate overtime entries are allowed without validation.
- Data is lost during form submission.


---

## Future Improvements 

These features are not required for the first release but can be considered later:

- Overtime approval workflow.
- Bulk overtime upload.
- Monthly overtime reports.
- Overtime notifications.
- Payroll recalculation history.