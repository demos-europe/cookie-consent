# DP Cookie Consent

This is a small script that allows to manage cookie consent for optional cookies.

## Usage
```javascript
import { dpConsent } from 'cookie-consent/dist/dp-consent.es.min.js'

// initializing dp consent
const consent = dpConsent({
  notice: '', // text to be shown in the cookie slideout
  optionalCookies: [
    {
      name: '', // the cookie's name
      explanation: '' // what does this cookie do
    },
    { ... }
  ], // an array of optional cookies
  necessaryCookies: [ /* same structure as above */ ], // an array of necessary cookies
  onGrantConsent: () => {}, // callback to be executed when consent is granted
  onRevokeConsent: () => {} // callback to be executed when consent is revoked
})

// adjusting consent settings
consent.adjustSettings()
```

## How it works?

Dp-Cookie-Consent will show a slideout providing options to accept all cookies or to change cookie settings.
If all cookies are accepted the onGrantConsent-callback will be executed and all optional cookies can be set.
If the user opts to change cookie settings a modal will be opened that presents the user with a list of all necessary
and all optional cookies. If the user selects optional cookies and saves these settings, the onGrantConsent-callback will
be executed. If the user doesn't select optional cookies the onRevokeConsent-callback will be executed. A cookie will be
set that remembers the user's choice. The cookie expires within one year.
