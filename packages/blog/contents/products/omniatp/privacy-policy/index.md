---
layout: plain
title: OmniATP Privacy Policy
sitemap: false
navigation: false
head:
  - - meta
    - name: robots
      content: noindex
---

OmniATP ("the Extension") is a Chrome browser extension that lets you post to Bluesky from Chrome's Omnibox. This policy describes what data the Extension handles, where it is sent, and the rights you have over that data.

In short: the Extension does not run any developer-controlled server, does not use analytics, advertising SDKs, or telemetry. The only network destination the Extension contacts is Bluesky (`https://bsky.social`) — and only when you (a) sign in, (b) the stored session is refreshed by the Bluesky client library, or (c) you submit a post. Everything else is stored locally in your browser's `chrome.storage.local`.

## 1. Data controller and contact

The data controller is:

- **Yasuhiro Shimizu**, an individual developer based in Japan.
- **Privacy contact (data subject requests):** yshrsmz.ys+pp@gmail.com
- **General feature/bug feedback:** <https://github.com/yshrsmz/omniatp/issues> (do **not** post personal data on the public issue tracker)

We respond to verifiable data subject requests within 30 days as required by GDPR Art. 12(3). To verify your identity we may ask you to confirm the Bluesky handle or DID associated with your request.

## 2. Data the Extension handles

All data described below is stored in your browser's `chrome.storage.local`. None of it is transmitted to the developer. The Extension communicates only with the Bluesky service described in §3.

### 2.1 Authentication credentials and session

When you sign in from the Extension's options page, the Extension sends the **identifier** (Bluesky handle, DID, or email) and the **password** you entered to Bluesky over HTTPS using the official AT Protocol client library (`@atproto/api`). On success, Bluesky returns a session containing your handle, DID, an access token (`accessJwt`), and a refresh token (`refreshJwt`).

- The identifier and password are sent to Bluesky and **are not retained in storage by the Extension**. Only the returned session (handle, DID, tokens) is persisted.
- The session is stored **as received, without additional encryption**, in `chrome.storage.local`. Anyone with access to your local Chrome profile may be able to read it. Sign out (or remove the Extension) before lending or returning your device.
- We strongly recommend that you create a Bluesky **App Password** at <https://bsky.app/settings/app-passwords> and use that instead of your main account password. The Bluesky API technically accepts either, but an App Password can be revoked individually if your device is compromised.
- The Bluesky client library transparently uses the refresh token to renew the access token when needed; this also results in HTTPS traffic to Bluesky.

### 2.2 Personally identifying information

The session described above contains your Bluesky **handle** and **DID**. These are stored locally and used only to authenticate post requests to Bluesky. Note that your handle and DID are public information on the AT Protocol network.

### 2.3 Active tab content (used only when you invoke the share command)

When you invoke the share sub-command (e.g. `at :share` in the Omnibox), the Extension calls `chrome.tabs.query({ active: true, currentWindow: true })`, which returns the active tab object. The Extension reads only the **URL** and **title** of that tab; other fields returned by the API (favicon URL, etc.) are not used. The data is consumed at the moment of invocation to compose a post and is **not stored, logged, or sent anywhere except** as part of the post you choose to publish to Bluesky. The Extension does not record your browsing history.

### 2.4 User preferences

The following user-configured preferences are stored locally:

- `postPrefix` — a text prefix prepended to shared posts (default: `NowBrowsing: `).
- `copyToClipboardOnPost` — a boolean toggle for copying the post text to your clipboard at the time of posting.
- `amazonAssociateDomain` and `amazonAssociateId` — optional Amazon affiliate program configuration. When set, the Extension rewrites Amazon URLs in shared posts to include this affiliate tag **locally, before sending the post to Bluesky**. This is a monetization feature; the developer of the Extension does **not** receive a commission from these links — the commission goes to whoever sets the affiliate ID (i.e. you, the user).

### 2.5 Notifications

After a successful post, the Extension shows a Chrome notification whose **body contains the full text of the post you just sent**. After a failed post, the body contains the Bluesky API status code and error message. These notifications are displayed by the operating system's notification surface (which may be visible to others looking at your screen) and disappear after 3 seconds.

### 2.6 Local console logging

For debugging, the Extension writes diagnostic events (including session lifecycle events such as sign-in, sign-out, and post submission) to the **browser's local developer console** via `console.*`. These logs do not leave your device, are not transmitted to any server, and disappear when the service worker shuts down or the browser is closed. You can view them via Chrome's `chrome://extensions` → "Inspect views" if you wish to audit them.

## 3. Third parties

The Extension communicates with exactly one external service:

### Bluesky (Bluesky Social PBC, United States)

- **Endpoint:** `https://bsky.social` — currently hard-coded in this version of the Extension. Future versions may allow configuring an alternative AT Protocol PDS; this policy will be updated accordingly.
- **When contacted:** at sign-in, when the Bluesky client library refreshes the access token, and when you submit a post.
- **Data sent:** identifier and password (only at sign-in); access/refresh tokens (on subsequent calls); post content (when you submit).
- **Public network:** Posts published through the Extension are public on the AT Protocol network and are propagated by the Bluesky relay (`bsky.network`) to other AT Protocol participants. Bluesky may independently log request metadata such as IP address, User-Agent, and timestamps. See Bluesky's own privacy policy (linked from <https://bsky.app>) for details on how they handle that data.

The Extension uses no analytics SDK, no advertising SDK, no crash reporter, and no other third-party service.

## 4. Permissions requested by the Extension

| Permission       | Purpose                                                                                                              |
| ---------------- | -------------------------------------------------------------------------------------------------------------------- |
| `storage`        | Stores the Bluesky session and user preferences locally via `chrome.storage.local`.                                  |
| `tabs`           | Reads the URL and title of the active tab when you invoke the share sub-command.                                     |
| `notifications`  | Displays local Chrome notifications about post success or failure (see §2.5).                                        |
| `offscreen`      | Creates a short-lived offscreen document, opened only when needed and immediately closed after a single copy action. |
| `clipboardWrite` | Allows the offscreen document to write the post text to your clipboard, when the clipboard option is enabled.        |

The Extension declares **no host permissions** and does **not** inject content scripts into web pages. Outbound HTTPS traffic to `https://bsky.social` originates from the service worker via `fetch` (mediated by `@atproto/api`) and does not require host permissions.

## 5. Legal basis for processing (GDPR)

For users in the EEA, the United Kingdom, and Switzerland, we rely on the following legal bases under GDPR Art. 6:

- **Art. 6(1)(b) — performance of a contract:** processing your Bluesky credentials and tab content is strictly necessary to provide the posting feature you have requested by installing the Extension and signing in.
- **Art. 6(1)(f) — legitimate interest:** local diagnostic logging (§2.6) supports correct operation and security of the Extension. The data does not leave your device.

We do not engage in automated decision-making or profiling under Art. 22.

## 6. International data transfers

When you submit a post or sign in, your data is transmitted to **Bluesky Social PBC in the United States**, which is outside the EEA/UK. This transfer takes place because you have requested the posting feature; we do not facilitate any other international transfer. You may stop these transfers at any time by signing out and uninstalling the Extension.

## 7. Retention and deletion

- Local data is retained only as long as it remains in your browser. There is no developer-controlled copy.
- **Sign out** from the Extension's options page to remove the stored Bluesky session.
- **Uninstall the Extension** to remove all data the Extension has stored locally (session, preferences, Amazon affiliate configuration).
- Data retained by Bluesky after you have submitted posts is governed by Bluesky's own privacy policy and is outside the developer's control.

## 8. Your rights

### 8.1 EEA / UK / Switzerland (GDPR / UK GDPR)

You have the right to:

- request **access** to your personal data,
- request **rectification** of inaccurate data,
- request **erasure** ("right to be forgotten"),
- request **restriction** of processing,
- **object** to processing based on legitimate interest,
- **data portability** for data processed by automated means on the basis of contract or consent,
- **withdraw consent** where processing is based on consent (note: the Extension does not currently rely on consent as a legal basis).

In practice, because the Extension does not retain data on developer-controlled servers, most of these rights are exercised directly by signing out or uninstalling. For any other request, contact yshrsmz.ys+pp@gmail.com.

You also have the right to **lodge a complaint with your local Data Protection Authority** (Art. 77 GDPR). A directory of EU/EEA authorities is published by the European Data Protection Board.

### 8.2 California (CCPA / CPRA)

If you are a California resident:

- **Categories of personal information collected (last 12 months):** identifiers (Bluesky handle, DID, email if used as identifier at sign-in); authentication information (Bluesky password — sent to Bluesky and not retained by the Extension; access/refresh tokens — stored locally); internet activity (URL and title of the active tab when you invoke the share sub-command).
- **Sources:** directly from you, and (in the case of session tokens) from Bluesky in response to your sign-in.
- **Business purpose:** providing the posting feature you requested.
- **Categories disclosed for a business purpose:** identifiers and authentication information are disclosed only to Bluesky to provide the requested service.
- **Do Not Sell or Share My Personal Information:** **we do not sell or share your personal information**, and we do not engage in cross-context behavioral advertising.
- **Sensitive personal information:** the Bluesky password and session tokens may qualify as sensitive personal information. We use them solely to authenticate post requests on your behalf — i.e. for the purpose for which you provided them. We do not use them for any inferred-characteristics purpose.
- You may exercise the rights to know, delete, correct, and limit use of sensitive personal information by contacting yshrsmz.ys+pp@gmail.com.

## 9. Children

The Extension is not directed to children under 13 (or the equivalent minimum age in your jurisdiction). The developer does not knowingly collect personal information from children under 13. If you believe a child has provided personal information through the Extension, please contact yshrsmz.ys+pp@gmail.com so the matter can be addressed.

## 10. Compliance with the Chrome Web Store User Data Policy

The Extension's use of information received from Google APIs and the Chrome Web Store complies with the [Chrome Web Store User Data Policy](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq), including the **Limited Use** requirements. Specifically:

- We do **not** sell user data.
- We do **not** transfer user data to third parties for advertising, retargeting, or to determine creditworthiness or for lending purposes.
- We do **not** use user data for personalized advertising, recommendations, or for training generalized AI/ML models.
- We do **not** allow humans to read user data, except (a) with the user's affirmative consent for specific data, (b) where necessary for security purposes (e.g. investigating abuse), (c) to comply with applicable law, or (d) where the data is aggregated and used for internal operations such as bug fixes.

User data obtained through the Extension is used solely for the user-facing features described in this document.

## 11. Security

The Extension relies on the security boundary provided by Chrome's extension architecture (`chrome.storage.local`, service worker isolation, and the offscreen document API). It does not transmit credentials to any party other than Bluesky over HTTPS. As described in §2.1 and §2.6, session tokens are stored without additional encryption and may be visible to anyone with access to your Chrome profile or to the developer console; this is consistent with how Chrome stores other extensions' session data.

The Extension does not declare host permissions and does not run content scripts, which limits the attack surface. Source code is available at <https://github.com/yshrsmz/omniatp> for independent review.

## 12. Changes to this policy

If this policy changes in a way that affects what data is handled or where it is sent, we will publish the updated version at this URL with a new "Last updated" date and a note in the changelog below. Material changes will also be reflected in the GitHub repository.

### Changelog

- **2026-05-08** — Initial publication.

## 13. Language

This policy is published in English. A Japanese translation is available on request via the privacy contact above; in case of conflict, the English version controls.

---

last updated: May 8, 2026
