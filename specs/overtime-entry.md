# Overtime Entry Feature — Spec


## What We Are Building and Why

Site managers need to log overtime for workers at the end of the day from their phones.
This data goes straight into payroll. 
If the validation is wrong or the data is messy,workers get paid the wrong amount. 
So the correctness of this feature matters more than how it looks.

---

## Acceptance Criteria

These are the things that must be true before we call this :

**1. Only active workers should show up in the worker selection.**
Workers who are terminated, suspended, or inactive must not appear. 

**2. Must be required field to calculate the Overtime**
- Worker name — picked from a list
- Overtime date
- Overtime hours / or should be automatic calculated with from and to time.
- Reason for overtime 

**3. Overtime date cannot be a future date.**
1. Today's date should be automatically filled in the field .
2. Manager can only select date from this month only and till today's date.
3. Future date should be disabled from the calender preventing manager from selecting it.

**4. Over Time should not be less than 0.5 or should not be more than daily set limit**
1. Entering 0 or a negative number should show a validation error. 
2. Entering over time should not be more than set limit.


**5. After a successful save, the success message must include worker name and date.**
After saving successfully , success alert should be displayed e.g. " OVerTime saved successfully for Employee:abc to date: dd/mm/yyyy"


**6. Overtime hours must be included when payroll is generated/calculated.**

Overtime is to pay employee for their work so when generating payroll it overtime is clearly included in the payroll.

**7.wrong action should display a proper error**
If Manager perform any wrong action like 
   - leave empty field and saving
   - wrong data in the fields
   - negative time
   - On Leave employee
   - terminated Employee
   -inActive Employee 
  application should throw proper error before sending data to the server.

**8.No Duplicate entry.**
1. If a manager tries to submit overtime for a same  worker who already has an entry 
 the server validate before saving successfully with proper message like "Duplicate Entry Found" .
2. if a manager tries to submit overtime for same date on another day then the server validate before saving successfully with proper message like "Duplicate Entry Found" .

**9. Every record should contain who submitted with the timestamp**

Any manager record overtime entry should contain who submitted and at what time it submitted.
it help clrify who audited the entry.

**10. Submitted records must appear in the Attendance section under OT**
 Overtime should be display in the attendance sheet of the employee to verify.

**11. The form must work properly on a phone.**

All the features should be working correctly in phone like: 

- Buttons are clearly visible and functional.
- The date picker works on mobile browsers .
- The worker dropdown is scrollable.
- The form shpould be properly alingned.


---

 ## Questions for PM


These are real situations that will happen once the feature goes live.
Each one needs a handled state, not an unhandled error.

### Unauthorize api Call
If someone calls the API directly with a worker ID that doesn't exist, the backend should return a clear error. Not a 500.

### Worker transferred to another project
if any worker is transferred to another project under another Manager 
que: is the previous manager can log the overtime for the worker?
que2: what if both manager log the overtime for the same user? 
que23 : is other manager is allowed to add  more time for the same user?

### Boundary Value Analysis

how boundary value of over should be handled 
for example the maximum limit is  30 hours per week
que :and overtime is already logged for 28 hours does manager can add 4 hours now?


### error while submitting
Manager fills the form, taps Submit, and get some unexpected error while saving 

que : is that entry rolled back or wait till connecting again?
ques2: if saved successfully on backend and failed to reflect in the ui.

### Payroll already generated for that period
If Jun payroll is generated and manager tries to submit overtime for a  date in same month,
que : is system allow to submit? or it will automatically added into next payroll?

---

## Test Scenarios

### Scenario 1 — Positive

**Given** worker Employee1 is active and has no overtime logged for today

**When** the manager selects Empoyee1, enters 3 hours, picks today's date, and types
"site cleanup ran late" as the reason

**Then** the record saves

**And** the success message shows "Overtime saved for Employee1 on [today's date]"

**And** the record appears in the overtime history with the correct hours, date, reason,
and the submitting manager's name.

---

### Scenario 2 — Future date blocked

**Given** the overtime entry form is open

**When** the manager selects tomorrow's date

**Then** the form does not submit

**And** the date field shows the message: "Overtime date cannot be in the future"

**And** all other data entered by the manager stays in the form

---

### Scenario 3 — 0 hours blocked

**Given** the overtime entry form is open

**When** the manager types 0 in the hours field and fills everything else correctly

**Then** the form does not submit

**And** the hours field shows a overtime should not be less than 0.5 or the minimum set criteria

---

### Scenario 4 — Negative hours blocked

**Given** the overtime entry form is open

**When** the manager types -2 in the hours field

**Then** the form does not submit

**And** the hours field shows a  overtime should not be less than 0.5 or the minimum set criteria

---

### Scenario 5 — More than 24 hours blocked

**Given** the overtime entry form is open

**When** the manager types 25 in the hours field

**Then** the form does not submit

**And** the hours field shows a validation error :overtime should not be more than 24 hours or the maximum set criteria

---

### Scenario 6 — Terminated worker not visible

**Given** worker Employee-B is marked as terminated

**When** the manager opens the worker dropdown

**Then** Employee-B does not appear in the list

**And** if someone calls the API directly with Employee-B ID, the backend returns
an error saying the worker is not eligible for overtime

---

### Scenario 7 — Duplicate entry blocked

**Given** overtime of 2 hours has already been saved for Employee-A on June 15

**When** any manager submits another overtime entry for Employee-A on June 15

**Then** the submission is blocked

**And** the error message says "Duplicate Entry Found" or "overtime already exists for Employee-A on June 15"

---

### Scenario 8 — Monthly cap conflict

**Given** Employee-A has 57 overtime hours logged this month and the monthly cap is 60

**When** a manager tries to submit 6 hours overtime for Employee-A

**Then** the system does not allow the full 6 hours

**And** shows a message that says Employee-A can only receive 3 more overtime hours this
month (or blocks completely — depends on PM decision from question 2)

---

### Scenario 9 — managers submitting OT for same worker, two different days

**Given** Employee-A works on June 15

**And** Manager submit 2 hours overtime for Employee-A on June 15 at 5pm
and it saves successfully

**When** Manager submit 4 hours overtime for Employee-A on June 16 at 5:10pm

**Then** Manager get a duplicate error

**And** the error tells Manager that overtime already exists for Employee-A on June 15


---

### Scenario 10 — Connection error during mid-submit

**Given** the manager has filled the form completely and Clicked Submit Button

**When** the network connection drops before the server responds and the request times out

**Then** the app shows a message that the "submission failed Please  try again:

**And** if the manager retries and the record was already saved before the connection
dropped, the backend detects the duplicate and does not create a second record

---

### Scenario 11 — Required fields empty

**Given** the overtime form is open

**When** the manager taps Submit without filling any fields

**Then** all required fields show validation errors

**And** the form does not submit

---

### Scenario 12 — Payroll already closed for that period

**Given** payroll has already been finalized for Jun 2026

**When** a manager tries to submit overtime for a worker for a date in Jub 2026

**Then** the submission is blocked

**And** the error says payroll for Jun 2026 is already Generated and this entry cannot
be added Or will be added on next month payroll

---

### Scenario 13 — Submit button tapped twice

**Given** the manager fills the form and taps Submit

**When** the manager click Submit button multiple time simulteneously

**Then** only one record is send to server 

**And** the button should be disabled

---


## Launch Blockers

Do not release the feature if any of these are not working:

- Overtime is not included in payroll when payroll generating — this is the entire reason for
  the feature and if it doesn't work, nothing else matters
- Inactive or terminated workers can receive overtime entries
- Invalid hours (zero, negative, above 24) can be saved
- Duplicate entries for the same worker on the same date can be saved
- A submission failure gives no feedback — data disappears silently and the manager
  doesn't know what happened
- The form is broken on a phone — can't tap properly, date picker doesn't work,
  or form is too small to use without zooming
- No audit trail of who submitted what and when

---

## Can Wait for V2

These are good ideas but should not block the release:

- Overtime approval workflow — HR reviews before payroll picks it up
- Editing or deleting overtime entries after they are saved
- Bulk overtime upload for managers who track it in a spreadsheet
- Monthly overtime reports per worker or per site
- Notifications when overtime is submitted or when it gets close to the monthly cap
- Different payroll rate for weekend or public holiday overtime
- Recalculation history when late overtime adjustments are made
- Searching and filtering the overtime history list

---

## Notes for Developer

A few things worth knowing before starting:

- The monthly cap scenario is a payroll correctness risk. We cannot make an assumption
  here — wrong behavior means workers are underpaid or overpaid.

- The two-managers-same-worker scenario needs a business decision, not just a technical
  fix. The code is straightforward (first one wins). But someone in payroll or HR needs
  to say that's the correct business rule before we build it that way.

- Mobile testing must be done on an actual phone with real network conditions,
  including a slow connection. Construction sites do not have reliable WiFi or strong
  signal. The connectivity loss scenario is not theoretical.

- The backend must validate everything the UI validates. Anyone with API access
  bypasses the frontend. Duplicate check, active worker check, date range check —
  all of these need to live in the backend, not just the form.