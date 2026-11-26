# Saranath College Website

School Website's New Features For QR Project

## Pages

- `index.html` - Dev Home
- `pages/student-life.html` - Academic pathways, activities, houses, gallery and feedback
- `pages/clubs.html` - Club directory and category filters
- `pages/news-events.html` - School news and event listings
- `pages/news-story.html` - Each news story view
- `pages/student-services.html` - Student services
- `pages/feedback-report.html` - Private comments, feedback, suggestions and complaints form

## Data

- `js/student-life.js` - Academic streams and student-life gallery
- `js/clubs.js` - Club listings
- `js/site-data.js` - Shared news, event, student-life and club data
- `js/news-events.js` - News and event page rendering
- `js/student-services.js` - Student services and feedback email form
- News and event entries in `js/site-data.js` can include optional story galleries. Set `moreImages` to `true`, set `imageCount` to the number of extra photos, and add each photo path and descriptive alt text to `images`. Use `moreImages: false` and `imageCount: 0` for stories without extra photos.

Images and Fonts in `assets/images/` and `assets/fonts/`.