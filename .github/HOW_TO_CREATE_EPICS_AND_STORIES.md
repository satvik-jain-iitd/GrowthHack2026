# How to Create Epics and Stories on GitHub — Beginner Step-by-Step Guide

**Iske liye aapko coding nahi aani chahiye.** Yeh guide bilkul beginner ke liye
hai — jaise chhoti class mein "MS Paint kaise khole" sikhaya jaata hai, waise
hi yahan "GitHub Issue kaise banaye" step by step dikhaya gaya hai.

Har step mein exactly bataya gaya hai: kaunse button pe click karna hai,
kahan text likhna hai, aur aage kya karna hai.

---

## Part 1 — Kholo GitHub Repository

1. Apna browser (Chrome/Edge) kholo.
2. Address bar mein yeh link daalo aur Enter dabao:
   `https://github.com/sjain480_aexp/EASE-GH2026`
3. Agar login maangta hai, apni American Express GitHub id se login karo.
4. Aapko repository ka main page dikhega — top mein tabs honge:
   `Code | Issues | Pull requests | Discussions | Actions | Projects | ...`

---

## Part 2 — Ek Naya Epic Banao

Epic ek **bada kaam** hota hai — jaise "Onboarding journey banana." Iske
andar chhote-chhote Stories aayenge.

1. Top ke tabs mein se **"Issues"** pe click karo.
2. Right side mein ek green button dikhega — **"New issue"**. Uspar click karo.
3. Ab aapko do template cards dikhenge — **"Epic"** aur **"Story"**.
4. **"Epic"** card ke neeche **"Get started"** button pe click karo.
5. Ek form khulega jisme yeh boxes honge:
   - **Title** (sabse upar) — yahan Epic ka short naam likho.
     Example: `[Epic]: Architecture documentation per AmEx standards`
     (`[Epic]:` already likha hua milega, bas uske aage apna title type karo)
   - **User Voice** — pehle se ek example likha hua hai jaise:
     `As a <type of user>, I want <capability>, so that <benefit>.`
     Isko replace karke apna asli sentence likho. Phir uske neeche jo line
     `> *🗣️ Hindi: ...*` likhi hai, usko bhi replace karke wahi baat
     Romanised Hindi mein likho — is Hindi wali line ko waise hi rehne do
     (quote mark `>` aur `*` symbols ke saath), yeh usko alag dikhne mein
     madad karta hai.
   - **Goal / Why this Epic exists** — same tarah, pehle English, phir
     neeche Hindi line.
   - **In Scope / Out of Scope / Dependencies / Risks** — yeh chaar boxes
     mein short bullet points likho (`-` se shuru karke, ek line ek point).
   - **Stories** — ise waise hi chhod do (uska matlab hai "Stories baad mein
     is Epic ke andar 'sub-issue' ke through add honge" — Part 3 dekho).
6. Sabse neeche **"Create"** button pe click karo (ya keyboard se
   `Ctrl + Enter` bhi dabaa sakte ho).
7. Bas! Epic ban gaya. Aapko ek issue number milega, jaise `#5`.

---

## Part 3 — Ek Story Banao (Epic ke Andar, "Sub-issue" ke Through)

Story ek **chhota, kaam ka tukda** hota hai jo ek Epic ke andar aata hai.

1. Jo Epic abhi banaya tha, usko kholo (Issues list mein uske title pe click
   karo).
2. Epic ke description ke **bilkul neeche**, aapko ek button dikhega:
   **"Create sub-issue"**.
3. Uspar click karo.
4. Ek chhota box khulega jisme "Story" template chuno (agar poochta hai).
5. Ab wahi Story form khulega:
   - **Title** — `[Story]: ` ke aage apna title likho.
   - **Description** — English + Hindi (jaise Epic mein kiya tha).
   - **Happy Path** — jab sab kuch sahi jaata hai to kya hota hai, step by
     step (1, 2, 3...).
   - **Sad Path** — jab user galti karta hai ya beech mein chhod deta hai.
   - **Edge Cases** — ajeeb lekin valid situations (jaise: user ka naam bahut
     lamba ho, ya internet slow ho).
   - **Error Scenarios** — jab kuch fail ho jaaye (jaise: network error,
     galat data).
   - **Acceptance Criteria (Gherkin)** — pehle se ek example diya hua hai:
     ```
     Scenario: <short name>
       Given <starting context>
       When <action taken>
       Then <expected result>
     ```
     Isko replace karke apna asli scenario likho. Zaroorat ho to aur
     Scenario blocks neeche add kar sakte ho (copy-paste karke).
   - **In Scope / Out of Scope / Dependencies / Risks** — Epic jaisa hi,
     short bullet points.
   - **Related Epic (fallback only)** — ise **khaali chhod do**, kyunki
     humne isse already sub-issue ke through Epic se jod diya hai (step 2-3).
6. Neeche **"Create"** button click karo (ya `Ctrl + Enter`).
7. Story ban gayi, aur woh automatically Epic ke andar dikhegi with a
   progress bar (jaise "0 of 3 sub-issues completed").

---

## Part 4 — English + Hindi Formatting (Bold/Italic ka Tareeka)

Har box mein aapko yeh pattern dikhega:

```
<English sentence yahan.>

> *🗣️ Hindi: <Wahi baat Hindi mein.>*
```

Isko waise hi rakho — `>` (greater-than sign) line ko ek "quote block" bana
deta hai (thoda indent + left border), aur `*...*` us text ko *italic* bana
deta hai. Isse Hindi wala part visually alag dikhta hai, bina kisi code box
ke.

Agar aap type karne ke bajaye toolbar use karna chahte ho:
1. Textbox ke upar ek chhoti toolbar hoti hai (**B**, *I*, `"`, etc.)
2. `"` (Quote) button dabao — ek `>` line ban jaayegi.
3. Us line ke andar cursor rakhke *I* (Italic) button dabao, phir apna
   Hindi text likho.

---

## Part 5 — Story ko "In Progress" Karna (Project Board Status)

*(Yeh tabhi applicable hai jab Project Board ban chuka ho — abhi yeh step
manual hai jab tak Project set up nahi hota.)*

1. Project Board kholo (README mein "Sprint Board" section se link milega).
2. Apni Story ko dhoondo (usually "To Do" column mein hogi).
3. Card ko click-and-drag karke **"In Progress"** column mein le jao.
4. Story ko apne aap ko assign karo: Story issue kholo → right side mein
   **"Assignees"** ke neeche apna naam select karo.

---

## Part 6 — PR (Pull Request) ko Story se Jodna

Jab code likhna shuru karo:

1. Ek naya branch banao (apna coding agent — Copilot/Codex/Claude — yeh
   khud kar sakta hai).
2. Jab kaam complete ho, GitHub par Pull Request (PR) banao.
3. PR ke description box mein sabse upar likho:
   `Closes #<Story ka number>`
   Example: agar Story `#7` thi, to likho `Closes #7`.
4. Isse GitHub automatically Story ko PR se jod dega, aur jab PR merge
   hoga, Story khud-ba-khud **close** ho jaayegi aur Project Board par
   **"Done"** dikhegi — aapko kuch manually karne ki zaroorat nahi.

---

## Quick Cheat-Sheet

| Kaam | Kahan Click Karna Hai |
|---|---|
| Naya Epic banao | Issues tab → New issue → Epic → Get started |
| Naya Story banao (Epic ke andar) | Epic issue kholo → "Create sub-issue" |
| Story ko apne naam assign karo | Story issue kholo → right sidebar → Assignees |
| Story ka status badlo | Project Board → card ko drag-drop karo |
| PR ko Story se jodo | PR description mein likho: `Closes #<number>` |

---

*Yeh guide `.github/ISSUE_TEMPLATE/epic.yml` aur `.github/ISSUE_TEMPLATE/story.yml`
templates ke saath use karne ke liye banaya gaya hai — pehle wahan se dekhiye
"Get started" button milta hai ya nahi.*
