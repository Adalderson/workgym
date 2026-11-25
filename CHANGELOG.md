# Work Gym changelog

## v5.3.3 (2026-11-25): single-dumbbell logging

- Goblet Squat and Hip Thrust (shoulders on bench + DB) are one dumbbell, not a pair. The app no longer labels them "weight per hand" in the edit-set screen or in Send to Coach. Those screens now say the weight is the one dumbbell.
- The same exception covers a glute bridge with a DB on the hips (also one dumbbell). Paired dumbbell lifts are unchanged (still per hand).
- Keep the exercise name exactly `Hip Thrust (shoulders on bench + DB)` (weight history is keyed by name). Sit on the floor with the upper back against the bench, roll the one DB from the thighs into the hip crease with a folded towel/pad, then plant the feet and drive.
- Footer v5.3.3, SW cache `workgym-v5.3.3`. v5.3.2 is kept as downloads/workout-app-v5.3.2.html.

## v5.3.2 (2026-11-23): assign after create

- With a GitHub token, workout logs and plan requests are now created without assignees. The app then assigns Adalderson in a separate call (`POST /issues/{n}/assignees`), so GitHub emits a real "assigned" event for the coach's wake-up.
- Once an issue exists it is never posted again. If only the assign step fails, the session stays synced and the assignment is retried on the next app open or workout. An issue found again after a lost response gets assigned too.
- The no-token prefilled-link path is unchanged (it still pre-fills `assignees=Adalderson`).
- Footer v5.3.2, SW cache `workgym-v5.3.2`. v5.3.1 is kept as downloads/workout-app-v5.3.1.html.

## v5.3.1 (2026-11-23): GitHub token paste fix

- Fixes "That doesn't look like a GitHub token" when saving a pasted token on Android. Save now strips spaces, line breaks, zero-width and other invisible characters, quotes and a "Bearer " prefix, and fixes a keyboard-capitalised "Github_pat_".
- Accepts `github_pat_`, `ghp_`, `gho_` and `ghu_` tokens. Any other format is saved with a warning, and Test confirms whether it works.
- Save reads the field reliably on Android Chrome: it tracks the input, change, paste, composition and blur events plus autofill, and uses the latest full value. A "Show what I pasted" checkbox lets you check the field.
- Footer v5.3.1, SW cache `workgym-v5.3.1`. v5.3 is kept as downloads/workout-app-v5.3.html.

## v5.3 (2026-11-23): clearer goal names

- In the intake Goals step, "Recomp" is now **"Lose fat + build muscle"**. The stored value is still `recomp`, so existing intakes and plan requests stay compatible. Plan requests now say "Goal: Lose fat + build muscle (recomp)".
- Each goal button now has a one-line hint: Fat loss "Lose weight, keep muscle", Muscle gain "Add size, some fat gain OK", Lose fat + build muscle "Stay near current weight, change shape", Strength "Lift heavier", General fitness "Feel and move better". The buttons stack full-width so they fit a phone screen.
- Footer v5.3, SW cache `workgym-v5.3`. v5.2 is kept as downloads/workout-app-v5.2.html.

## v5.2 (2026-11-23): optional GitHub sync (silent auto-push)

- New **Settings > GitHub sync** card. Paste a fine-grained token limited to **Adalderson/workgym-data** (Issues: Read and write, Metadata: Read-only). The token is stored on that phone only (device-level, never in backups or exports, never in the repo), shown as ••••last4, with **Test** (reads the repo), **Sync all unsynced history** and **Remove**. Reset this phone also removes it.
- With a token, tapping **Done** silently opens an issue in workgym-data: `[Workout log] <Profile> <YYYY-MM-DD> <session>`, labels `workout-log` + `profile:<name>`, assigned to Adalderson, body = `Profile:` line + the Send to Coach summary + the session JSON.
- Offline or failed posts are queued on the phone and retried on the next app open or workout. A chip shows Synced #n / Queued / Sync failed on the Done screen and in History. Each session is marked with its issue number and carries a hidden session id, so a session is never posted twice (even if a response was lost).
- With a token, **Request new plan** posts straight to the repo (assigned to Adalderson) and falls back to the prefilled GitHub page if that fails.
- Without a token, everything works exactly as v5.1.
- Footer v5.2, SW cache `workgym-v5.2`. The backup format stays 5. v5.1 is kept as downloads/workout-app-v5.1.html.

## v5.1 (2026-11-23): requests go to a private repo

- Plan requests now open a new issue in the **private** repo **Adalderson/workgym-data** (https://github.com/Adalderson/workgym-data). It has the labels `plan-request`, `workout-log`, `profile:Adam` and `profile:Julie`, and its own `plan-request` issue template, assigned to Adalderson. The app still runs from the public workgym Pages site.
- The request form's public-repo warning is replaced with: "🔒 Requests are private: they go to Adam's private GitHub repo (Adalderson/workgym-data), visible only to Adam, the coach and invited collaborators." The help text now says that, because the repo is private, the GitHub account filing must be a collaborator there or file from Adam's account. Otherwise GitHub shows "page not found".
- `profiles.json` in the app repo now holds names only (`id`, `name`). The "load my latest plan from GitHub" option only appears if an entry has a `plan` path, so it's hidden now.
- The public repo's issue template was removed. Its existing `plan-request` and `profile:*` labels are left in place but unused.
- v5.1 has no workout-log posting and no GitHub token code. Any future workout-log or API feature must target Adalderson/workgym-data, with a token scoped to that repo only.
- Footer v5.1, SW cache `workgym-v5.1`. The backup format stays 5. v5 is kept as downloads/workout-app-v5.html.

## v5 (2026-11-23): one profile per phone, plan requests, intake, invite link

**One profile per phone.** The first launch on a phone binds it to one profile. After that, the app always opens as that person. There is no picker and no in-app switcher, so a workout can't be logged to the wrong person. The header shows the profile name as a read-only tag.

- **First launch on a new phone:** the app asks "I already have a profile" or "Set up a new profile".
  - "Already have" lists the names in `profiles.json` (in the repo, next to index.html) plus any profile already on the phone. You can also type a name. From there you can restore a backup file or load your latest plan from GitHub (the `plan` path in profiles.json).
  - A known name with no data, no backup and no plan goes to the intake card.
- **New profile:** opens a 7-step intake card covering name, sex, age, height, weight and units, goal and target weight, experience, days per week (2-6), preferred days, session length (30-90 min), where you train, equipment (with heaviest dumbbell), injuries, exercises to avoid, likes and dislikes, cardio, steps, sleep and schedule, diet notes (coaching context, not medical advice), and anything else.
- **Invite link:** `https://adalderson.github.io/workgym/?invite=new` (optionally `&name=Julie`) skips the welcome and opens the intake. On a phone that's already set up, it does nothing except show a toast. More > Share invite link uses the share sheet, or copies the link if sharing isn't available. og:title, og:description and og:image tags give texted links a preview.
- **Settings > This phone > Reset this phone:** collapsed by default and needs you to type RESET. It backs up first (share sheet or download), then unbinds the phone. The profile's data stays on the phone, and choosing that name again picks it back up.
- **Settings > Training schedule:** set days per week (2-6) and session length (30/45/60/75/90 min). Both are saved with the intake.

**Isolated data.** Every key is stored per profile as `wg5:<profileId>:<old key>`, for example `wg5:julie:workGymHistory`. That covers plan, mode, history (PRs, RIR, check-ins, edits), in-progress workout, bodyweight, nutrition, settings, last-backup and intake. The registry lives in `wg5Profiles`, the phone binding in `wg5Device`, and the migration record in `wg5Migrated`.

**Migration from v4.x (automatic, first v5 launch).**
- If any un-namespaced `workGym*` key exists, each one is copied byte-for-byte to `wg5:adam:*`, and the phone is bound to **Adam**. That includes an in-progress workout, which you're offered to resume.
- It never overwrites an existing `wg5:adam:*` value. It runs once (the `wg5Migrated` flag) and is idempotent if run again.
- The old keys are left untouched as a fallback, and v4.2 is still available at downloads/workout-app-v4.2.html.
- A fresh phone (no old data) shows the welcome screen instead.

**Profiles' settings.** Adam keeps his built-in Gym/Home plans and his care-team macro targets. Other profiles get no built-in plans and no macro targets, and their goal weight comes from the intake. Until they have a plan, the home screen shows **Request my starting plan**.

**Plan requests.** More > Request new plan (or the starting-plan button) opens a short form.
- The form asks for routine type (gym/home/travel/other), the routine or day it's about (optional), and goal/notes. The profile is fixed to the phone and can't be edited.
- Submitting opens `https://github.com/Adalderson/workgym/issues/new?title=…&body=…&labels=plan-request,profile:<Name>&assignees=Adalderson` in the browser.
- The body starts with machine-readable lines: `Profile:`, `Profile-ID:`, `Request:`, `Routine type:`, `Routine/day:`, `Days/week:`, `Session length:`, `Current plan:`. Then come the note, the request, the readable intake, recent training (last 2 weeks, top sets) and a fenced JSON block.
- URLs over 7000 characters drop the oldest training lines first.
- No GitHub token is stored. The person submits the issue with their own login. Labels and assignee only stick if that account has write access to the repo.
- Note shown everywhere: "Plan requests are checked daily at 8 PM Eastern (ET), and usually picked up right away."
- The repo is public, so the form warns that request contents (including the intake) are publicly readable.

**Plans for a specific profile.** A plan may carry `"profile": "Julie"`. Loading by `?plan=` link, file or paste only goes into the phone's profile. A plan for someone else is blocked with: "This plan is for Julie; this phone is set up for Adam. Open the link on Julie's phone." Plans without the field still load. `tools/validate-plan.js` accepts the field.

**Backups.**
- Export and backup format is version 5 and includes `profile`, `profileId` and `intake`. File names include the profile: `workgym-backup-adam-YYYY-MM-DD.json`.
- Restoring only goes into the phone's profile. A v5 backup from another profile is blocked.
- v2, v3 and v4 backups (which have no profile) restore into the phone's profile, with a confirm that names it.

**Send to Coach.** The session, today and the review summary texts now include `Profile: <Name>`.

**Version.** Footer v5, SW cache `workgym-v5`, APP_VERSION 5. Tests: `tools/run-tests-v5.sh` runs test-v5.js plus the v2/v3/v4 suites against v5 (legacy harness) and against their original builds, and validates every repo plan on v5. `tools/smoke-v5.js` is the Playwright phone smoke test.
