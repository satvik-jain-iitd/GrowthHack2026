(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.intents = factory();
})(typeof self !== 'undefined' ? self : this, function () {

  const INTENTS = [
    {
      id: 'online-availability',
      ask: 'When can guests book online?',
      match: ['book', 'booking', 'online', 'availability', 'full', 'not available', 'sold out'],
      answer: 'Both your pacing and table inventory determine online availability. Set the tables you want guests to see to "Online" and control the flow with pacing (15-minute booking intervals). Tables kept "In-house" for walk-ins never appear online.',
      action: { type: 'journey', value: 'create-shift', label: 'Walk me through creating a shift' }
    },
    {
      id: 'off-market',
      ask: 'What is Off-Market Time?',
      match: ['off market', 'off-market', 'offmarket', 'close', 'cut off', 'booked out', 'stop online'],
      answer: 'The off-market time is when online reservations stop being bookable for the day — your cut-off for same-night bookings. Set it in the Availability step of the shift wizard.',
      action: { type: 'journey', value: 'create-shift', label: 'Show me where' }
    },
    {
      id: 'shutoff',
      ask: 'Shut off reservations during service',
      match: ['shut off', 'disable', 'turn off', 'stop reservations', 'online off'],
      answer: 'On the Resy OS app, tap the three-dot menu on the dashboard, toggle "Online Reservations Enabled" off and hit Apply. A red bar confirms reservations are disabled for that shift. Note: updating shifts can be password protected in the Dashboard.',
      action: null
    },
    {
      id: 'wrong-phone',
      ask: "Guest's phone belongs to someone else",
      match: ['wrong guest', 'phone', 'wrong number', 'duplicate', 'profile'],
      answer: 'Resy treats a phone number as a unique guest ID, so it can only belong to one guest. When booking, use the "Right number, wrong guest?" flow: enter the correct guest name and continue — a text goes to that number asking the guest to verify the booking at your restaurant. Once verified, the number is tied to the correct guest.',
      action: { type: 'doc', value: 'wrong-phone', label: 'Read the how-to' }
    },
    {
      id: 'chits',
      ask: 'Auto-print chits?',
      match: ['chit', 'print', 'printer', 'auto print'],
      answer: 'Yes — Resy auto-prints chits for reservations and walk-ins. Tap your restaurant name > Settings > Printing, and toggle "Auto print chits when seated". Use a compatible chit printer.',
      action: null
    },
    {
      id: 'reporting',
      ask: 'Where are my covers & reports?',
      match: ['cover', 'covers', 'report', 'analytics', 'breakdown', 'no show', 'no-show', 'turnover', 'turn time', 'data'],
      answer: 'Open Analytics in Resy OS or the online Dashboard for cover breakdowns, average covers per table, turn times and no-shows.',
      action: { type: 'screen', value: 'analytics', label: 'Open Analytics' }
    },
    {
      id: 'password',
      ask: 'I forgot my password',
      match: ['password', 'forgot', 'login', 'reset', 'sign in', 'signed out'],
      answer: 'Reset it through the "Forgot password?" link on the Resy OS and Dashboard login pages. While you are at it — want to review who can sign in?',
      action: { type: 'journey', value: 'invite-team', label: 'Review team access' }
    },
    {
      id: 'team',
      ask: 'Add a teammate / staff login',
      match: ['add user', 'invite', 'staff', 'team', 'employee', 'permission', 'login', 'user', 'account'],
      answer: 'Open Users, click Add User, and choose a role. Keep "Can edit venue & shift settings" off for roles that do not need it — shift edits can also be password protected.',
      action: { type: 'journey', value: 'invite-team', label: 'Invite a team member' }
    },
    {
      id: 'golive',
      ask: 'Walk me through going live',
      match: ['go live', 'going live', 'golive', 'launch', 'checklist', 'first day', 'open'],
      answer: 'Here is the launch checklist partners review before going live: your listing on Resy.com, the website widget, shifts and table inventory, the floor plan, and date closures. I can walk you through every step.',
      action: { type: 'journey', value: 'go-live', label: 'Start the go-live checklist' }
    },
    {
      id: 'createshift',
      ask: 'How do I create a shift?',
      match: ['create shift', 'new shift', 'shift', 'shift settings', 'lunch', 'dinner', 'schedule'],
      answer: 'Service > Shift Settings > New Shift. The wizard covers Shift Basics, Service Settings, Availability, Reservation Settings and Custom Policies — with helpful tips along the way.',
      action: { type: 'journey', value: 'create-shift', label: 'Walk me through it' }
    },
    {
      id: 'support',
      ask: 'Talk to a person',
      match: ['support', 'human', 'contact', 'email', 'phone', 'help', 'agent', 'resysupport'],
      answer: 'Our team is here to help. Email resysupport@resy.com or use the chat bubble on every help page — we are at your side before and after launch.',
      action: null
    }
  ];

  const JOURNEYS = {
    'create-shift': {
      id: 'create-shift',
      title: 'Create a shift',
      slug: 'create-shift',
      steps: [
        { screen: 'service', anchor: 'rail-service', type: 'click', title: 'Open Service', body: 'Shift settings live under Service. Click Service in the left rail to open it.' },
        { anchor: 'shift-new', type: 'click', open: 'wizard', title: 'Start the shift wizard', body: 'Click "New Shift". The wizard walks you through setup with helpful tips along the way.' },
        { anchor: 'wizard-basics', type: 'fill', wstep: 0, title: 'Shift Basics', body: 'Name the shift — "Dinner" — and set start and end times. Keep it a weekly recurring shift for now.' },
        { anchor: 'wizard-service', type: 'hint', wstep: 1, title: 'Service Settings', body: 'Set the booking interval (pacing) and turn time. Pacing controls how fast online spots fill — 15-minute intervals are the Resy default.' },
        { anchor: 'wizard-availability', type: 'fill', wstep: 2, title: 'Availability', body: 'This is where online availability is decided. Set tables to Online for guests, hold some for walk-ins, and set your off-market time (when online booking stops).' },
        { anchor: 'wizard-res', type: 'hint', wstep: 3, title: 'Reservation Settings', body: 'Limit party sizes for online bookings (say, max 6) so larger groups call the restaurant instead.' },
        { anchor: 'wizard-policy', type: 'fill', wstep: 4, title: 'Custom Policies', body: 'Add a cancellation policy or a deposit if your house needs one.' },
        { anchor: 'wizard-update', type: 'click', title: 'Update Shift', body: 'Click "Update Shift" to save. Guests can now book inside this shift\'s availability.' }
      ]
    },
    'go-live': {
      id: 'go-live',
      title: 'Going live on Resy',
      slug: 'go-live',
      steps: [
        { screen: 'golive', anchor: 'golive-1', type: 'click', mark: 1, title: 'View your listing on Resy.com', body: 'Confirm the five things guests see first: reservation availability, photos, venue & reservation copy, address & map, and social media links.' },
        { anchor: 'golive-2', type: 'click', mark: 2, title: 'Test the widget on your website', body: 'Make sure the Book Now widget is installed correctly and guests can actually book from it.' },
        { anchor: 'golive-3', type: 'click', mark: 3, title: 'Review shifts & table inventory', body: 'Check the availability flag per table — Online, In-house or Walk-in — and pacing for the shift.' },
        { anchor: 'golive-4', type: 'click', mark: 4, title: 'Review your floor plan in ResyOS', body: 'Check seating capacities. Black dots are the minimum guests, ring dots the maximum that can book a table.' },
        { anchor: 'golive-5', type: 'click', mark: 5, title: 'Review date closures', body: 'Close holidays and scheduled closed dates so guests cannot book them — via the calendar icon on the iPad or Service > Calendar in the Dashboard.' }
      ]
    },
    'invite-team': {
      id: 'invite-team',
      title: 'Invite a team member',
      slug: 'invite-team',
      steps: [
        { screen: 'users', anchor: 'rail-users', type: 'click', title: 'Open Users', body: 'New logins live under Users in the left rail.' },
        { anchor: 'users-add', type: 'click', open: 'usermodal', title: 'Add a user', body: 'Click "Add User" to start the invite.' },
        { anchor: 'user-name', type: 'fill', title: 'Name', body: 'Enter the staff member\'s first and last name.' },
        { anchor: 'user-email', type: 'fill', title: 'Email', body: 'Use their work email — Resy logins are tied to it.' },
        { anchor: 'user-role', type: 'hint', title: 'Choose a role', body: 'Admin, Manager or Staff. Pick the least privilege that lets them do the job; you can change it later.' },
        { anchor: 'user-settings', type: 'toggle', title: 'Settings permission', body: 'Leave "Can edit venue & shift settings" off unless the role needs to change config — shift edits can be password protected too.' },
        { anchor: 'user-invite', type: 'click', title: 'Send the invite', body: 'Click "Send invite" — they get an email to set their password and sign in.' }
      ]
    }
  };

  function matchIntent(text) {
    const q = String(text).toLowerCase();
    let best = null;
    let bestScore = 0;
    for (const it of INTENTS) {
      let score = 0;
      for (const kw of it.match) {
        if (q.indexOf(kw) !== -1) score += kw.length > 5 ? 2 : 1;
      }
      if (score > bestScore) {
        bestScore = score;
        best = it;
      }
    }
    return best;
  }

  if (typeof require === 'function' && require.main === module) {
    const assert = require('assert');
    const cases = [
      ['when can guests book online?', 'online-availability'],
      ['why is the whole dining room full tonight', 'online-availability'],
      ['what is off market time', 'off-market'],
      ['shut off reservations during service', 'shutoff'],
      ['guest phone number belongs to another guest', 'wrong-phone'],
      ['how do I change my password', 'password'],
      ['invite my new host', 'team'],
      ['going live tomorrow', 'golive'],
      ['create a dinner shift', 'createshift'],
      ['please connect me with support', 'support']
    ];
    for (const [text, expectId] of cases) {
      assert.strictEqual(matchIntent(text) && matchIntent(text).id, expectId, 'query: ' + text);
    }
    for (const j of Object.keys(JOURNEYS)) {
      assert.ok(JOURNEYS[j].title, 'journey missing title: ' + j);
      for (const s of JOURNEYS[j].steps) {
        assert.ok(s.anchor, j + ' step missing anchor');
        assert.ok(s.title && s.body, j + ' step missing copy');
        assert.ok(/hint|click|fill|toggle/.test(s.type), j + ' step bad type: ' + s.type);
      }
    }
    console.log('ponytail: intents self-check OK (' + INTENTS.length + ' intents, ' + Object.keys(JOURNEYS).length + ' journeys)');
  }

  return { INTENTS: INTENTS, JOURNEYS: JOURNEYS, matchIntent: matchIntent };
});
