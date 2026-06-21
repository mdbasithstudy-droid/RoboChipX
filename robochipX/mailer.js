// ─── Mailer ───────────────────────────────────────────────────────────────────
// Confirmation emails are sent server-side by Google Apps Script (google-apps-script.gs).
// The Apps Script doPost() handler:
//   1. Appends the row to Google Sheets.
//   2. Calls MailApp.sendEmail() with a full HTML email body.
//
// No client-side email library is required.
// This file is retained as a reference stub.
// ─────────────────────────────────────────────────────────────────────────────
