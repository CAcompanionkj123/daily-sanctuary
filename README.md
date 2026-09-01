# Daily Sanctuary

DIGITAL DIARY — PRODUCTION BUILD PROMPT

Build a production-ready full-stack web application called Digital Diary.

The product should feel like a real personal physical diary transformed into a beautiful private digital experience.

The core philosophy is:

Write your thoughts. Plan your days. Remember your journey.

Do NOT make this look like Notion, Trello, Google Docs, or a generic SaaS dashboard.

The experience should feel:

Personal

Calm

Emotional

Minimal

Premium

Private

Paper-inspired

Fast

Distraction-free

The application must be fully functional, responsive, accessible, and production-ready.

1. TECH STACK

Use:

React

TypeScript

Tailwind CSS

Modern component architecture

Supabase for backend

Supabase Authentication

PostgreSQL database

Supabase Storage for media

Row Level Security (RLS)

Realtime where useful

Responsive mobile-first design

Use the platform's native/Supabase integration rather than introducing unnecessary external services.

Do not create fake/mock functionality where real functionality is required.

2. BRAND

Application name:

Digital Diary

Possible tagline:

Your thoughts. Your plans. Your story.

The brand should feel like a premium private journal rather than a productivity application.

Avoid excessive branding inside the actual diary-writing experience.

3. DESIGN SYSTEM

Overall aesthetic

Create a modern paper diary aesthetic.

Use:

Warm off-white / ivory backgrounds

Subtle paper texture

Soft shadows

Elegant typography

Rounded but not overly playful components

Thin borders

Generous whitespace

Subtle animations

The application should feel like:

Physical notebook + modern digital journal + elegant productivity system

Do not use:

Neon colors

Heavy gradients

Excessive glassmorphism

Gaming-style UI

Corporate SaaS appearance

Overly colorful dashboards

4. TYPOGRAPHY

Use a refined serif font for diary headings and an extremely readable sans-serif font for application controls.

Recommended:

Headings:

Playfair Display / Cormorant Garamond

Body/UI:

Inter / Geist

Diary writing area:

A highly readable serif or handwriting-style font option.

Allow the user to change diary writing font from Settings.

Provide:

Serif

Sans-serif

Handwritten

Do not use difficult-to-read handwriting fonts as the default.

5. AUTHENTICATION

Implement complete authentication.

Support:

Email/password signup

Email/password login

Logout

Forgot password

Reset password

Email verification

Persistent sessions

Protected routes

Optional architecture support for future:

Google login

Apple login

Users must never be able to access another user's diary data.

Use Supabase Auth.

Create a profiles table connected to auth.users.

Profile fields:

id

display_name

avatar_url

timezone

preferred_theme

preferred_font

created_at

updated_at

Use the authenticated user's ID as the ownership boundary throughout the database.

6. FIRST-TIME USER EXPERIENCE

After signup, show a beautiful onboarding experience.

Screen 1:

Welcome to your diary.

Subtitle:

"Some thoughts deserve a place to stay."

Button:

Open My Diary

Screen 2:

Ask:

What do you want to use your diary for?

Options:

Thoughts

Daily planning

Memories

Gratitude

Goals

Everything

Allow multiple selections.

Screen 3:

Ask:

How do you want your diary to feel?

Options:

Light

Dark

System

Then open today's diary page.

Do not force users through a long onboarding flow.

7. MAIN APP STRUCTURE

Desktop navigation:

LEFT SIDEBAR

Today's Page

Diary

Calendar

Tasks

Timeline

Search

Favorites

Settings

Bottom of sidebar:

User profile
Logout

On mobile:

Use a compact bottom navigation:

Today

Diary

Calendar

Tasks

More

The writing interface should remain the highest priority.

8. HOME / TODAY PAGE

IMPORTANT:

The default screen after login should NOT be a generic dashboard.

Open:

TODAY'S PAGE

Display:

Wednesday, 19 August 2026

and optionally:

11:15 AM

Use the user's actual timezone.

Below:

What's on your mind?

Large distraction-free writing area.

Placeholder:

Dear Diary...

The user should be able to immediately start writing.

Do not require clicking "Create Entry" before writing.

Autosave continuously.

Show a subtle status:

Saved

or

Saving...

Do not interrupt the writing experience.

9. DIARY ENTRY MODEL

Create a database table:

diary_entries

Fields:

id UUID primary key

user_id UUID

entry_date DATE

title TEXT nullable

content TEXT

mood TEXT nullable

mood_score INTEGER nullable

is_favorite BOOLEAN default false

is_locked BOOLEAN default false

created_at TIMESTAMP

updated_at TIMESTAMP

Create indexes for:

user_id

entry_date

created_at

updated_at

Unique constraint:

(user_id, entry_date)

BUT allow future architecture for multiple entries per day.

If multiple entries per day are implemented, remove the unique constraint and add entry_time.

10. DIARY WRITING EXPERIENCE

The diary page should visually resemble a physical notebook.

Example:

19 AUGUST 2026

Wednesday

Dear Diary,

[large writing area]

Features:

Autosave

Undo/redo

Basic formatting

Bold

Italic

Underline

Bullet list

Numbered list

Headings

Quote

Divider

Links

Do not make the toolbar permanently visible.

Show formatting controls only when text is selected or when requested.

Keyboard shortcuts:

Ctrl/Cmd + B
Ctrl/Cmd + I
Ctrl/Cmd + Z
Ctrl/Cmd + Shift + Z

Autosave after typing stops for a short debounce period.

Never lose written content if the network temporarily fails.

Implement local draft recovery.

11. DIARY PROMPTS

Under the writing area, optionally show:

Today's prompts

What happened today?

What am I thinking about?

What made me happy?

What challenged me?

What did I learn?

What am I grateful for?

What do I want tomorrow to look like?

Allow:

Hide prompts

The user should never be forced to answer them.

Add:

Give me another prompt

Generate/select another prompt from a predefined prompt library.

Create database table:

journal_prompts

Fields:

id

prompt

category

active

12. MOOD TRACKING

Allow the user to record a mood for each diary entry.

Use simple expressive icons.

Example:

😄 Great
🙂 Good
😐 Okay
😕 Low
😔 Sad
😤 Frustrated
😴 Tired
🔥 Motivated
❤️ Grateful

Store:

mood

mood_score

Do not make mood tracking mandatory.

Show mood at the top or bottom of the diary page without disrupting writing.

13. GRATITUDE

Allow an optional section:

Today I'm grateful for...

Three small input fields.

Store gratitude items linked to the diary entry.

Database:

gratitude_items

Fields:

id

entry_id

user_id

content

position

created_at

Users can have zero to three items.

14. DAILY PLAN

Every diary page should have an optional:

Today's Plan

Tasks can be added directly from the diary.

Example:

☐ Study Audit
☐ Record Reel
☐ Read Chapter 3
☐ Exercise

Users should not need to navigate to Tasks to create a task.

Allow:

Add task

Complete task

Edit task

Delete task

Reorder task

Database:

tasks

Fields:

id

user_id

title

description

task_date

due_time nullable

completed

completed_at nullable

priority

created_at

updated_at

15. TASK SYSTEM

Create a dedicated Tasks page.

Sections:

Today

Upcoming

Completed

Overdue

Task features:

Create

Edit

Delete

Complete

Reopen

Priority

Due date

Due time

Notes

Drag/reorder

Priorities:

Low

Medium

High

Use subtle visual indicators.

Do not make the interface visually aggressive.

16. SMART DAILY FLOW

At the end of each day, show:

Today's Reflection

Questions:

What went well?

What didn't go well?

What should I do differently tomorrow?

What am I proud of today?

These should be optional.

When the user opens tomorrow's page, show unfinished tasks from the previous day with an option:

Move unfinished tasks to today

Never automatically move them without user confirmation.

17. CALENDAR

Create a beautiful calendar view.

Views:

Month

Week

Day

Calendar days should show subtle indicators:

Diary entry exists

Tasks exist

Mood exists

Example:

19
● Diary
● 3 tasks

Clicking a date opens that day's diary.

Allow:

Previous month

Next month

Today

The calendar should be fast and responsive.

18. DIARY ARCHIVE

Create:

My Diary

Display entries chronologically.

Example:

August 2026

19 August
"Today I finally..."

Mood: 🔥

18 August
"Something I've been thinking about..."

Mood: 🙂

Each entry should display a short preview.

Allow:

Open

Favorite

Delete

Search

Filter

19. SEARCH

Create global diary search.

Search:

Entry title

Entry content

Tasks

Gratitude

Tags if implemented

Example:

User searches:

"CA Files"

Results:

12 August 2026
"...I was thinking about CA Files..."

27 July 2026
"...new idea for the series..."

Highlight matching text.

Search should be fast.

Use PostgreSQL full-text search where appropriate.

Do not expose entries from other users.

20. TIMELINE / MY JOURNEY

Create a beautiful chronological page:

My Journey

Instead of displaying everything as a boring table, create a visual timeline.

Example:

AUGUST 2026

19 AUG
Started a new project

17 AUG
Important realization

12 AUG
Finished something I had been delaying

Each timeline item can open the original diary entry.

Allow filters:

All

Thoughts

Goals

Memories

Favorites

Mood

21. FAVORITES

Users can mark diary entries as favorites.

Create:

Favorites

Show favorite entries chronologically.

Allow unfavorite directly.

22. TAGGING

Allow optional tags.

Examples:

#study
#ideas
#life
#work
#goals
#CA
#personal

Create:

entry_tags

Fields:

id

entry_id

user_id

tag

Allow filtering by tag.

Tags should remain optional.

23. MEDIA ATTACHMENTS

Allow users to attach:

Images

Photos

PDFs

Voice notes

Use Supabase Storage.

Create:

entry_attachments

Fields:

id

entry_id

user_id

file_name

file_path

file_type

file_size

created_at

Storage must use user-specific folders.

Example:

user_id/entries/entry_id/file

Never expose private storage files publicly.

Use signed URLs where necessary.

24. VOICE NOTE

Add optional voice recording.

Button:

🎙️

User taps:

Record

Then:

Stop

Save audio to the diary entry.

Display:

▶ Voice Note
0:42

Do not automatically transcribe unless a transcription provider is configured.

Architecture should allow transcription to be added later.

25. PHOTO MEMORY

Allow:

Add Memory

User can attach one or more photos.

Show them elegantly inside the diary entry.

Avoid making it look like a social-media feed.

This is a private memory.

26. PRIVACY

Privacy is one of the most important product requirements.

Every user must only be able to access their own:

Diary entries

Tasks

Moods

Gratitude

Attachments

Tags

Profile

Preferences

Implement strict Supabase Row Level Security.

For every user-owned table:

SELECT:
auth.uid() = user_id

INSERT:
auth.uid() = user_id

UPDATE:
auth.uid() = user_id

DELETE:
auth.uid() = user_id

Do not rely only on frontend filtering.

Database-level security is mandatory.

27. LOCKED ENTRIES

Allow users to mark an entry as:

🔒 Private

Locked entries should require an additional app-level verification before opening if feasible.

Do not implement fake encryption.

If true client-side encryption is not implemented, clearly treat this as an access-control feature rather than cryptographic encryption.

Architecture should allow future end-to-end encryption.

28. SETTINGS

Create:

Settings

Sections:

Profile

Name

Avatar

Email

Appearance

Light

Dark

System

Diary

Writing font

Writing size

Line spacing

Show prompts

Default mood tracking

Notifications

Daily reminder

Reminder time

Task reminders

Privacy

Lock diary

Session management

Export data

Delete account

29. DARK MODE

Dark mode should feel like a night journal.

Do not simply invert the colors.

Use:

Deep charcoal

Soft warm text

Muted borders

Reduced brightness

Comfortable writing contrast

The writing surface should still feel like a diary.

30. DAILY REMINDER

Allow users to configure:

Remind me to write

Time:

07:00 PM

Architecture should support notification integration.

Do not create fake browser notifications.

If notification infrastructure isn't available, build the settings/UI and backend structure cleanly so notification delivery can be connected later.

31. DATA EXPORT

Users must be able to export their diary.

Provide:

Export My Diary

Formats:

JSON

PDF

Plain text / Markdown

Export only the authenticated user's own data.

The export should include:

Diary entries

Dates

Moods

Gratitude

Tasks

Tags

Attachment metadata

If PDF generation requires a backend function, structure it cleanly.

32. ACCOUNT DELETION

Provide:

Delete My Account

Require confirmation.

Clearly explain:

"This permanently deletes your diary, tasks, memories, and account data."

Do not make this easy to trigger accidentally.

Implement proper cascading deletion for user-owned records and storage objects.

33. ERROR HANDLING

Create friendly errors.

Never expose raw database errors to users.

Examples:

Instead of:

Postgres error 23505

Show:

Something went wrong saving your entry. Your local draft is safe. Please try again.

Network failure:

You're offline. Your writing is saved on this device and will sync when you're back online.

34. OFFLINE-FIRST WRITING SAFETY

This is important.

If the user is writing and internet connection disappears:

Never delete their text

Keep a local draft

Show "Offline"

Continue allowing writing

Sync when connection returns

Resolve conflicts safely.

The latest confirmed user edit should not silently overwrite newer local content.

35. AUTOSAVE

Autosave continuously.

States:

Saving...

Saved just now

Offline — saved locally

Syncing...

Never interrupt typing with modal dialogs.

36. ANIMATIONS

Use subtle premium animations.

Page opening:

Soft fade + slight slide.

Calendar transitions:

Smooth.

Entry opening:

Subtle fade.

Task completion:

Small satisfying animation.

Sidebar:

Smooth slide.

Buttons:

Minimal hover feedback.

Do NOT use:

Excessive bouncing

Confetti everywhere

Long loading animations

Distracting transitions

The application should feel calm.

37. PAGE TURN EFFECT

For the diary itself, optionally create a subtle page transition that gives the impression of turning a paper page.

It should be fast.

Do not sacrifice usability for the effect.

On mobile, prefer a simple swipe/fade transition.

38. MOBILE EXPERIENCE

The application must be genuinely mobile-first.

On mobile:

Today's diary page should be almost full-screen.

Top:

←

19 August 2026

•••

Then:

Large writing area.

Bottom:

Today
Diary
Calendar
Tasks
More

The keyboard must not cause layout bugs.

Ensure:

Proper viewport handling

Sticky controls

Safe-area support for modern phones

Touch-friendly controls

No horizontal scrolling

Large writing area

Easy swipe between diary dates

39. DESKTOP EXPERIENCE

Desktop should use available screen width intelligently.

Recommended:

Left navigation +
Large centered diary page +
Optional right-side daily information

Example:

LEFT:
Navigation

CENTER:
Diary

RIGHT:
Today's tasks / mood / prompts

However, do not overcrowd the screen.

The diary remains the primary focus.

40. EMPTY STATES

Create elegant empty states.

No diary entries:

Your story starts here.

No tasks:

Nothing planned yet.

No favorites:

Keep the moments that matter.

No search results:

Nothing found in your diary.

41. LOADING STATES

Use skeletons where useful.

Avoid generic spinners everywhere.

Diary opening should feel immediate.

Use optimistic UI where safe.

42. ACCESSIBILITY

Implement:

Keyboard navigation

Focus states

Proper ARIA labels

Accessible buttons

Sufficient contrast

Screen-reader-friendly navigation

Reduced motion support

Respect:

prefers-reduced-motion

43. SECURITY

Implement:

Supabase RLS

Secure authentication

Secure storage

Signed URLs for private attachments

No sensitive data in client-side logs

No service-role key in frontend

Environment variables for secrets

Proper input validation

File type validation

File size limits

Never expose Supabase service-role credentials to the browser.

44. DATABASE SCHEMA

Create the required PostgreSQL tables.

Minimum tables:

profiles

id

display_name

avatar_url

timezone

preferred_theme

preferred_font

created_at

updated_at

diary_entries

id

user_id

entry_date

title

content

mood

mood_score

is_favorite

is_locked

created_at

updated_at

tasks

id

user_id

title

description

task_date

due_time

completed

completed_at

priority

position

created_at

updated_at

gratitude_items

id

user_id

entry_id

content

position

created_at

journal_prompts

id

prompt

category

active

entry_tags

id

user_id

entry_id

tag

entry_attachments

id

user_id

entry_id

file_name

file_path

file_type

file_size

created_at

Create appropriate indexes and foreign keys.

Use UUIDs.

Use timestamps consistently.

45. DATABASE SECURITY

Enable RLS on every user-owned table.

Create policies for:

SELECT
INSERT
UPDATE
DELETE

based on:

auth.uid() = user_id

For gratitude_items, entry_tags, and entry_attachments, ensure the authenticated user owns the referenced diary entry as well.

Do not create permissive policies such as:

using (true)

for private user data.

46. PERFORMANCE

Optimize for fast startup.

Requirements:

Lazy-load heavy pages

Compress images

Optimize database queries

Add indexes

Paginate diary archive

Do not load entire diary history at once

Debounce search

Debounce autosave

Avoid unnecessary realtime subscriptions

Use optimistic updates where safe

47. SEARCH ARCHITECTURE

Implement PostgreSQL full-text search for diary content where appropriate.

Search should support:

Exact words

Multiple words

Entry titles

Tags

Dates

Allow date filtering:

From:
To:

Mood filtering:

Great

Good

Okay

Low

Sad

etc.

48. CALENDAR DATA

Calendar should efficiently query only the required date range.

Do not fetch the entire diary database just to render one month.

For each day, calculate:

Has entry?

Number of tasks

Mood

Completion percentage

Display subtle indicators.

49. FUTURE-READY ARCHITECTURE

Keep the code modular so future features can be added without rebuilding the application.

Potential future features:

AI diary insights

Weekly reflection

Monthly reflection

Habit tracking

Goal tracking

End-to-end encryption

Handwriting with stylus

Voice transcription

Smart memory search

Diary statistics

Private AI assistant

Calendar integrations

Backup integrations

Native mobile app

Do not implement these unless explicitly requested.

Build clean interfaces/hooks/services so they can be added later.

50. IMPORTANT UX PRINCIPLE

Do not turn the app into a productivity dashboard.

The hierarchy is:

Diary

Thoughts

Memories

Planning

Tasks

Analytics

The user should feel:

"I'm writing in my diary."

Not:

"I'm managing my productivity."

51. DAILY OPENING EXPERIENCE

When the user opens the application:

Show today's date.

Example:

19

August 2026

Wednesday

Then:

Good morning.

or depending on local time:

Good afternoon.

Then:

What's on your mind today?

Cursor should automatically be ready in the writing area when appropriate.

Below the writing area:

Today's Plan

Tasks.

Then:

Today's Mood

Mood selector.

Then:

Today's Reflection

Optional prompts.

This is the central experience.

52. MICROCOPY

Use warm, human language.

Examples:

Instead of:
"Create Entry"

Use:
Start Writing

Instead of:
"New Task"

Use:
Add to My Day

Instead of:
"Search Database"

Use:
Search Your Memories

Instead of:
"Delete Record"

Use:
Delete Entry

Instead of:
"No Data"

Use:
Your story starts here.

53. FINAL QUALITY REQUIREMENTS

Before considering the project complete, verify:

Authentication

Signup works

Login works

Logout works

Password reset works

Protected routes work

Diary

Create entry

Edit entry

Autosave

Date navigation

Delete entry

Favorite entry

Mood

Prompts

Tasks

Create

Edit

Complete

Reopen

Delete

Due dates

Priorities

Calendar

Month navigation

Date selection

Entry indicators

Task indicators

Search

Searches actual user data

Results open correct entry

No cross-user results

Timeline

Chronological entries

Correct dates

Entry navigation

Attachments

Upload

Display

Delete

Secure storage

Privacy

RLS enabled

Users cannot access other users' data

Storage secured

Mobile

Responsive

No horizontal scrolling

Writing experience works with mobile keyboard

Navigation works

Reliability

Autosave

Offline draft

Error handling

Loading states

54. BUILD ORDER

Build the application in this order:

PHASE 1

Authentication

Database

RLS

Profiles

PHASE 2

Today's diary page

Diary editor

Autosave

Date navigation

PHASE 3

Tasks

Mood

Gratitude

Prompts

PHASE 4

Calendar

Diary archive

Favorites

Timeline

PHASE 5

Search

Tags

Attachments

Voice notes

PHASE 6

Settings

Privacy

Export

Account deletion

PHASE 7

Offline handling

Performance optimization

Accessibility

Mobile polish

Animation polish

55. FINAL INSTRUCTION TO LOVABLE

Do not merely generate a visual prototype.

Build the actual working full-stack application.

All buttons should perform their intended actions.

All forms should persist data.

All user-specific data must be protected by Supabase RLS.

Do not use placeholder data once the corresponding database functionality exists.

Do not create fake authentication.

Do not expose private data.

Do not expose service-role credentials.

Keep the code modular and maintainable.

Prioritize the writing experience above everything else.

The final product should feel like:

"I finally have a diary that I actually want to open every day."

Build the complete application now.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/176a9952-5f83-489f-bb1c-e40e5be8cd5c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
