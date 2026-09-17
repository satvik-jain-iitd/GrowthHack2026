const SOURCE_ARTICLES = [
  {
    id: 'create-shift',
    title: 'How to create and edit a shift in the Dashboard',
    author: 'Resy OS Help Desk',
    read: '2 min',
    updated: 'Updated Jun 23',
    source: 'https://helpdesk.resy.com/how-to-create-and-edit-a-shift-in-dashboard-service-settings-ByNaZwmIu',
    intro: 'The shift creation tool walks you through Shift Basics, Service Settings, Availability, Reservation Settings and Custom Policies with helpful tips along the way.',
    steps: [
      { title: 'Access Dashboard Service Settings', note: 'Select "Service" from the left-hand menu, then click "Shift Settings" to open the weekly calendar of active and upcoming shifts. Your login must have permission to edit shifts.' },
      { title: 'Start a new shift', note: 'Click the blue "New Shift" button in the top-right corner. The wizard walks you through every aspect of the shift.' },
      { title: 'Shift Basics', note: 'Name the shift (e.g. "Dinner"), pick the day pattern and set start/end times.' },
      { title: 'Service Settings', note: 'Set the booking interval (pacing) and turn time. Pacing controls how fast online spots fill.' },
      { title: 'Availability', note: 'Per table: Online (bookable by guests), In-house (reserved for in-house bookings) or Walk-in. Set your off-market time here — when online reservations stop for the day.' },
      { title: 'Reservation Settings', note: 'Set party size limits for online bookings.' },
      { title: 'Custom Policies', note: 'Add cancellation windows or prepaid policies if your house needs them.' },
      { title: 'Update Shift', note: 'Click "Update Shift" to complete shift creation.' }
    ],
    tip: 'If a new shift is only slightly different from an existing one, use the three-dot menu > "Copy Shift" and adjust — faster than starting from scratch.'
  },
  {
    id: 'go-live',
    title: 'Going Live on Resy',
    author: 'Resy OS Help Desk',
    read: '2 min',
    updated: 'Updated Oct 8',
    source: 'https://helpdesk.resy.com/live-day-checklist-r1BVbvXUu',
    intro: 'A list of items to review as you go live on Resy.',
    steps: [
      { title: 'View your listing on Resy.com', note: 'Confirm reservation availability, photos, venue & reservation copy, address & map, and social media links.' },
      { title: 'View the widget on your website', note: 'Confirm the widget is installed correctly and guests are able to book from it.' },
      { title: 'Review your shifts and table inventory', note: 'Online (bookable through consumer channels), In-house (reserved, bookable only through Resy OS and the Dashboard) and Walk-in (not bookable through any channel). Check pacing per 15-minute interval.' },
      { title: 'Review your floor plan in ResyOS', note: 'On the Floor Plan view, check seating capacities. Black circles are the minimum guests and the total circles are the maximum that can book on a table.' },
      { title: 'Review date closures', note: 'Close holidays and scheduled closed dates via the calendar icon in ResyOS, or Service > Calendar in the Dashboard.' }
    ],
    tip: 'Any changes saved to the floor plan are automatically reflected online.'
  },
  {
    id: 'invite-team',
    title: 'Add User and Password Permissions for Users',
    author: 'Resy OS Help Desk',
    read: '2 min',
    updated: 'Updated Mar 5',
    source: 'https://helpdesk.resy.com/categories/user-settings-r18Wkrvwd',
    intro: 'Learn to add, edit, remove and manage all users and logins. If you do not want a user to make edits to Settings, leave permission off.',
    steps: [
      { title: 'Open Users', note: 'Click "Users" in the Dashboard left-hand menu.' },
      { title: 'Add a user', note: 'Click "Add User" and enter their name and work email.' },
      { title: 'Choose a role', note: 'Admin, Manager or Staff — pick the least privilege that lets them do the job.' },
      { title: 'Set Settings permission', note: 'Keep "Can edit venue & shift settings" off for config you want protected. Shifts can additionally be password protected.' },
      { title: 'Send the invite', note: 'They receive an email to set their password and sign in to Resy OS and the Dashboard.' }
    ],
    tip: 'Use the three-dot menu on any user to edit, remove or reset access later.'
  },
  {
    id: 'wrong-phone',
    title: "Right number, wrong guest?",
    author: 'Resy OS Help Desk',
    read: '1 min',
    updated: 'Updated May 27',
    source: 'https://helpdesk.resy.com/resyos-faq-B1ciD7Uu',
    intro: 'Resy uses phone numbers as a unique guest identifier, so a number can only be tied to one guest. When the wrong guest is on a number, use this flow to reassign it.',
    steps: [
      { title: 'Start booking the reservation', note: 'Search the table or slot you want to book as usual.' },
      { title: 'Use "Right number, wrong guest?"', note: 'When booking, tap the flow that flags the phone number, then enter the correct guest name and continue booking.' },
      { title: 'Guest verifies by text', note: 'A text message goes out to the number asking the guest to verify they are booking at your restaurant.' },
      { title: 'Number moves to the right guest', note: 'Once verified, the phone number is tied to the correct guest profile.' }
    ],
    tip: 'You can also merge duplicate guest profiles to keep visit history on one profile.'
  }
];

const Docs = {
  list: function () {
    return SOURCE_ARTICLES.concat(Recorder.load());
  },

  find: function (id) {
    return this.list().find(d => d.id === id);
  },

  el: function (id) { return document.getElementById(id); },

  render: function () {
    const wrap = this.el('docs-catalog');
    const art = this.el('docs-article');
    wrap.style.display = 'block';
    art.style.display = 'none';
    const html = this.list().map(d =>
      '<div class="card doc-card" data-doc="' + d.id + '">' +
      '<h4>' + d.title + '</h4>' +
      '<div class="tagline">' + d.author + ' · ' + d.steps.length + ' steps · ' + d.read + (d.fromRecording ? ' · ' + d.updated : '') + '</div>' +
      '</div>').join('');
    wrap.innerHTML = '<h3 class="head-row">My how-to guides <span class="muted" style="font-weight:400;font-size:12px">(guides you finish get recorded here, like a Scribe doc)</span></h3>' + html;
    wrap.querySelectorAll('[data-doc]').forEach(card => {
      card.onclick = () => this.open(card.getAttribute('data-doc'));
    });
  },

  open: function (id) {
    const d = this.find(id);
    if (!d) return;
    const wrap = this.el('docs-catalog');
    const art = this.el('docs-article');
    wrap.style.display = 'none';
    art.style.display = 'block';
    art.innerHTML =
      '<button class="btn btn-ghost btn-sm" id="docs-back">&larr; All guides</button>' +
      '<div class="doc-article" style="margin-top:14px">' +
      '<h2>' + d.title + '</h2>' +
      '<div class="doc-meta">' +
      '<span class="chip blue">' + d.author + '</span>' +
      '<span class="chip grey">' + d.steps.length + ' steps</span>' +
      '<span class="chip grey">' + d.read + '</span>' +
      '<span class="chip grey">' + d.updated + '</span>' +
      '</div>' +
      '<p class="doc-intro">' + d.intro + '</p>' +
      d.steps.map((s, i) =>
        '<div class="step-card">' +
        '<div class="shead"><span class="snum">Step ' + (i + 1) + '</span><h4>' + s.title + '</h4></div>' +
        '<p>' + s.note + '</p>' +
        '<div class="shot">Screenshot — ' + s.title + '</div>' +
        '</div>').join('') +
      '<div class="tip"><b>Tip</b> &nbsp;' + d.tip + '</div>' +
      '<div class="helpful"><span>Was this article helpful?</span>' +
      '<button class="btn btn-ghost btn-sm" data-yes>Yes</button>' +
      '<button class="btn btn-ghost btn-sm" data-no>No</button></div>' +
      '</div>';
    this.el('docs-back').onclick = () => this.render();
    art.querySelector('[data-yes]').onclick = () => App.toast('Thanks for the feedback!');
    art.querySelector('[data-no]').onclick = () => App.toast('We will route this to the team.');
  }
};
