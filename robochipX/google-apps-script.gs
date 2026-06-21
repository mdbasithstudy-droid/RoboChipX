// ─── ROBOCHIPX 2026 — Google Apps Script ─────────────────────────────────────
// Deploy as: Extensions → Apps Script → Deploy → New deployment
//   Type        : Web App
//   Execute as  : Me
//   Who has access: Anyone
//
// After deploying, copy the Web App URL and paste it into app.js as the
// fetch() endpoint inside initRegistration().
// ─────────────────────────────────────────────────────────────────────────────

var PAYMENT_URL   = 'https://YOUR-VERCEL-DOMAIN.vercel.app/payment.html';
var SHEET_NAME    = 'Registrations';   // tab name inside your Google Sheet
var SENDER_NAME   = 'ROBOCHIPX 2026';

// ── Entry point ───────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    var data         = JSON.parse(e.postData.contents);
    var leaderEmail  = data.leaderEmail  || '';
    var mobile       = data.mobile       || '';
    var submittedAt  = data.submittedAt  || new Date().toISOString();

    appendToSheet(leaderEmail, mobile, submittedAt);
    sendConfirmationEmail(leaderEmail, mobile, submittedAt);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Google Sheets insertion ───────────────────────────────────────────────────
// Sheet columns: Leader Email | Mobile Number | Submitted At
function appendToSheet(leaderEmail, mobile, submittedAt) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

  // Write header row if the sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Leader Email', 'Mobile Number', 'Submitted At']);
    sheet.getRange(1, 1, 1, 3).setFontWeight('bold');
  }

  sheet.appendRow([leaderEmail, mobile, submittedAt]);
}

// ── Confirmation email ────────────────────────────────────────────────────────
function sendConfirmationEmail(leaderEmail, mobile, submittedAt) {
  var subject  = 'ROBOCHIPX 2026 — Registration Received';
  var htmlBody = buildEmailHtml(leaderEmail, mobile, submittedAt);

  MailApp.sendEmail({
    to:       leaderEmail,
    subject:  subject,
    htmlBody: htmlBody,
    name:     SENDER_NAME
  });
}

// ── HTML email template ───────────────────────────────────────────────────────
function buildEmailHtml(leaderEmail, mobile, submittedAt) {
  // Format submittedAt to a readable IST string
  var dateStr = '';
  try {
    var d = new Date(submittedAt);
    dateStr = Utilities.formatDate(d, 'Asia/Kolkata', 'dd MMM yyyy, hh:mm a') + ' IST';
  } catch (_) {
    dateStr = submittedAt;
  }

  return '<!DOCTYPE html>' +
  '<html lang="en">' +
  '<head>' +
    '<meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1.0">' +
    '<title>ROBOCHIPX 2026 — Registration Received</title>' +
  '</head>' +
  '<body style="margin:0;padding:0;background:#050814;font-family:Arial,sans-serif;">' +

    '<!-- Wrapper -->' +
    '<table width="100%" cellpadding="0" cellspacing="0" border="0"' +
      ' style="background:#050814;padding:40px 16px;">' +
      '<tr><td align="center">' +

        '<!-- Card -->' +
        '<table width="600" cellpadding="0" cellspacing="0" border="0"' +
          ' style="max-width:600px;width:100%;background:#0a1020;' +
                  'border:1px solid rgba(0,240,255,0.2);border-radius:16px;' +
                  'overflow:hidden;">' +

          '<!-- Header strip -->' +
          '<tr>' +
            '<td style="background:linear-gradient(135deg,#00f0ff,#bd00ff);' +
                       'padding:32px 40px;text-align:center;">' +
              '<p style="margin:0 0 6px 0;font-size:12px;letter-spacing:5px;' +
                        'text-transform:uppercase;color:#02040a;font-weight:700;">' +
                'Rajalakshmi Institute of Technology' +
              '</p>' +
              '<h1 style="margin:0;font-size:28px;font-weight:900;letter-spacing:3px;' +
                         'text-transform:uppercase;color:#02040a;">' +
                'ROBOCHIPX \'26' +
              '</h1>' +
              '<p style="margin:8px 0 0 0;font-size:13px;color:#02040a;font-weight:600;">' +
                '24-Hour Robotics &amp; VLSI Innovation Challenge' +
              '</p>' +
            '</td>' +
          '</tr>' +

          '<!-- Body -->' +
          '<tr>' +
            '<td style="padding:40px;">' +

              '<h2 style="margin:0 0 8px 0;font-size:20px;color:#00f0ff;' +
                         'letter-spacing:1px;">Registration Received ✓</h2>' +
              '<p style="margin:0 0 28px 0;font-size:15px;color:#8f9cae;line-height:1.6;">' +
                'Thank you for registering for <strong style="color:#f0f3f8;">ROBOCHIPX 2026</strong>. ' +
                'We have received your registration details. Complete your payment to ' +
                'confirm your team\'s spot at the 24-hour innovation challenge.' +
              '</p>' +

              '<!-- Details box -->' +
              '<table width="100%" cellpadding="0" cellspacing="0" border="0"' +
                ' style="background:rgba(0,240,255,0.05);border:1px solid rgba(0,240,255,0.15);' +
                        'border-radius:10px;margin-bottom:32px;">' +
                '<tr>' +
                  '<td style="padding:20px 24px;">' +
                    '<p style="margin:0 0 6px 0;font-size:11px;letter-spacing:2px;' +
                              'text-transform:uppercase;color:#00f0ff;">Leader Email</p>' +
                    '<p style="margin:0 0 18px 0;font-size:15px;color:#f0f3f8;' +
                              'word-break:break-all;">' + leaderEmail + '</p>' +

                    '<p style="margin:0 0 6px 0;font-size:11px;letter-spacing:2px;' +
                              'text-transform:uppercase;color:#00f0ff;">Mobile Number</p>' +
                    '<p style="margin:0 0 18px 0;font-size:15px;color:#f0f3f8;">+91 ' + mobile + '</p>' +

                    '<p style="margin:0 0 6px 0;font-size:11px;letter-spacing:2px;' +
                              'text-transform:uppercase;color:#00f0ff;">Registered At</p>' +
                    '<p style="margin:0;font-size:15px;color:#f0f3f8;">' + dateStr + '</p>' +
                  '</td>' +
                '</tr>' +
              '</table>' +

              '<!-- Payment instruction -->' +
              '<p style="margin:0 0 24px 0;font-size:15px;color:#8f9cae;line-height:1.6;">' +
                '<strong style="color:#f0f3f8;">Next step:</strong> Click the button below to ' +
                'complete your payment of <strong style="color:#00f0ff;">₹300 per team</strong> ' +
                'through the secure college payment gateway.' +
              '</p>' +

              '<!-- CTA button -->' +
              '<table width="100%" cellpadding="0" cellspacing="0" border="0"' +
                ' style="margin-bottom:32px;">' +
                '<tr>' +
                  '<td align="center">' +
                    '<a href="' + PAYMENT_URL + '"' +
                      ' style="display:inline-block;padding:16px 40px;' +
                              'background:linear-gradient(135deg,#00f0ff,#bd00ff);' +
                              'color:#02040a;text-decoration:none;font-weight:700;' +
                              'font-size:15px;letter-spacing:1.5px;text-transform:uppercase;' +
                              'border-radius:8px;box-shadow:0 4px 20px rgba(0,240,255,0.35);">' +
                      'Continue to Payment &#8594;' +
                    '</a>' +
                  '</td>' +
                '</tr>' +
              '</table>' +

              '<!-- Fallback URL -->' +
              '<p style="margin:0 0 32px 0;font-size:12px;color:#8f9cae;text-align:center;">' +
                'Button not working? Copy and paste this link into your browser:<br>' +
                '<a href="' + PAYMENT_URL + '"' +
                  ' style="color:#00f0ff;word-break:break-all;">' + PAYMENT_URL + '</a>' +
              '</p>' +

              '<!-- Warning note -->' +
              '<table width="100%" cellpadding="0" cellspacing="0" border="0">' +
                '<tr>' +
                  '<td style="background:rgba(255,160,0,0.08);border:1px solid rgba(255,160,0,0.25);' +
                             'border-radius:8px;padding:14px 18px;">' +
                    '<p style="margin:0;font-size:13px;color:#ffb347;line-height:1.5;">' +
                      '&#9888;&nbsp; Registration fees are non-refundable. ' +
                      'Ensure you complete payment using the same email address you registered with.' +
                    '</p>' +
                  '</td>' +
                '</tr>' +
              '</table>' +

            '</td>' +
          '</tr>' +

          '<!-- Footer -->' +
          '<tr>' +
            '<td style="background:#02040a;padding:24px 40px;text-align:center;' +
                       'border-top:1px solid rgba(255,255,255,0.05);">' +
              '<p style="margin:0 0 6px 0;font-size:14px;font-weight:700;' +
                        'letter-spacing:2px;color:#f0f3f8;">ROBOCHIPX \'26</p>' +
              '<p style="margin:0;font-size:12px;color:#8f9cae;">' +
                '&#169; 2026 ROBOCHIPX Committee &mdash; Rajalakshmi Institute of Technology' +
              '</p>' +
            '</td>' +
          '</tr>' +

        '</table>' +
        '<!-- /Card -->' +

      '</td></tr>' +
    '</table>' +
    '<!-- /Wrapper -->' +

  '</body>' +
  '</html>';
}
