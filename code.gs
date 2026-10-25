const SHEET_NAME = 'DailyProgress';
const MY_EMAIL = Session.getActiveUser().getEmail(); 
const PORTFOLIO_FORM_LINK = "https://sumitaidev.com/Daily-Progress-Tracker"; 
const SECRET_PASSWORD = "123"; 

// 1. Setup the Sheet (Run once to initialize)
function setupSheet() {
  const doc = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = doc.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = doc.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastColumn() === 0 || sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Tasks Assigned', 'Tasks Completed', 'Hours Studied', 'Notes']);
  }
}

// 2. Handle incoming POST requests from your website
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = JSON.parse(e.postData.contents);

    if(data.password !== SECRET_PASSWORD) {
       return ContentService.createTextOutput(JSON.stringify({"result":"error", "error": "Invalid Password"})).setMimeType(ContentService.MimeType.JSON);
    }

    if (sheet.getLastColumn() === 0) {
      sheet.appendRow(['Timestamp', 'Tasks Assigned', 'Tasks Completed', 'Hours Studied', 'Notes']);
    }

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    const newRow = headers.map(function(header) {
      if (header === 'Timestamp') return new Date();
      return data[header] || '';
    });

    sheet.appendRow(newRow);
    return ContentService.createTextOutput(JSON.stringify({"result":"success"})).setMimeType(ContentService.MimeType.JSON);
  
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({"result":"error", "error": error.toString()})).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// 3. Email Functions
function sendEveningReminder() {
  const subject = "Proof of Work: Daily Reminder";
  const body = "It's 10:00 PM. Time to log your daily progress!\n\nSubmit your work here: " + PORTFOLIO_FORM_LINK;
  GmailApp.sendEmail(MY_EMAIL, subject, body);
}

function sendDailyAnalysis() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  
  const lastRow = data.length < 2 ? ['No Data', 0, 0, 0, 'No notes yet'] : data[data.length - 1]; 
  
  const subject = "Morning Briefing: Yesterday's Progress";
  const body = `Good Morning!\n\nHere is your daily analysis:\n- Tasks Assigned: ${lastRow[1]}\n- Tasks Completed: ${lastRow[2]}\n- Hours Studied: ${lastRow[3]}\n- Notes: ${lastRow[4]}\n\nKeep pushing forward!`;
  
  GmailApp.sendEmail(MY_EMAIL, subject, body);
}

function sendWeeklyAnalysis() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  
  let totalAssigned = 0, totalCompleted = 0, totalHours = 0;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  for(let i=1; i<data.length; i++) {
     const rowDate = new Date(data[i][0]);
     if(rowDate >= sevenDaysAgo) {
       totalAssigned += Number(data[i][1]) || 0;
       totalCompleted += Number(data[i][2]) || 0;
       totalHours += Number(data[i][3]) || 0;
     }
  }

  const completionRate = totalAssigned > 0 ? Math.round((totalCompleted / totalAssigned) * 100) : 0;

  const subject = "Weekly Dashboard: Proof of Work Analysis";
  const body = `Sunday Review!\n\nHere is your progress over the last 7 days:\n- Total Hours Studied: ${totalHours.toFixed(1)} hrs\n- Total Tasks Completed: ${totalCompleted} / ${totalAssigned}\n- Task Completion Rate: ${completionRate}%\n\nReview your dashboard for more details. Have a great Sunday!`;
  
  GmailApp.sendEmail(MY_EMAIL, subject, body);
}

// 4. Time-Based Cloud Scheduler
function setupTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(t => ScriptApp.deleteTrigger(t));

  ScriptApp.newTrigger('sendEveningReminder').timeBased().atHour(22).everyDays(1).create();
  ScriptApp.newTrigger('sendDailyAnalysis').timeBased().atHour(6).everyDays(1).create();
  ScriptApp.newTrigger('sendWeeklyAnalysis').timeBased().onWeekDay(ScriptApp.WeekDay.SUNDAY).atHour(8).create();
}

// 5. TEST FUNCTIONS (Run these from the top dropdown to test emails)
function testDailyEmail() { sendDailyAnalysis(); }
function testWeeklyEmail() { sendWeeklyAnalysis(); }
function testEveningReminder() { sendEveningReminder(); }
