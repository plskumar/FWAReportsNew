# FWAReports

React/Vite investigator portal for healthcare FWA reports.

## Local run

```powershell
npm install
npm run dev
```

Open the URL shown by Vite.

## GitHub deployment

This project uses GitHub Actions, not gh-pages.

```powershell
git init
git branch -M main
git remote add origin https://github.com/plskumar/FWAReports.git
git add .
git commit -m "Initial FWAReports application"
git push -u origin main --force
```

Then go to GitHub repository Settings > Pages and set Source to GitHub Actions.

Live URL:

https://plskumar.github.io/FWAReports/
