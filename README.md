# Prize Master

Mobile-first rewards app prototype built with Vite and Capacitor.

## Current prototype
- Wheel rewards: 0 (30%), 1 (40%), 2 (20%), 5 (9%), 10 (1%). These odds are not shown in the player interface.
- UC exchange catalog: 30 UC / 400 coins, 60 UC / 700 coins, 300 UC / 3,100 coins, 600 UC / 5,800 coins.
- Redemption fulfillment is intended to be manual.

## Build
1. `npm install`
2. `npm run build`
3. `npx cap add android`
4. `npx cap sync android`
5. `cd android && ./gradlew assembleDebug`

GitHub Actions builds a debug APK using `.github/workflows/build-apk.yml`.

## Important
This is a front-end prototype. The wheel and coin balance currently run in the browser and are not secure. Redemption buttons are placeholders and do not yet send requests to an admin. Before real users, move reward selection and balance updates to a trusted backend (for example Firebase Cloud Functions), store redemption requests in a database, and build an admin review workflow. Never treat local browser balances as real currency.
