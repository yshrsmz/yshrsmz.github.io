---
layout: plain
title: LinkRelay Privacy Policy
sitemap: false
navigation: false
head:
  - - meta
    - name: robots
      content: noindex
---

LinkRelay ("the App", package name `com.codingfeline.linkrelay`) is an Android app that receives links you share to it and forwards them to an app you choose, according to rules you define. This policy describes what data the App handles, where it is sent, and the rights you have over that data.

In short: the App processes shared links on your device. It has no account, no advertising, and no analytics, and the developer runs no server of its own. Data leaves your device in three cases only: (a) crash and error reports sent to Firebase Crashlytics (§3.1), (b) requests to known link-shortening services to find where a short link leads, which you can turn off (§3.2), and (c) Android's own backup and device-to-device transfer, which the operating system performs and the developer never sees (§3.3).

## 1. Data controller and contact

The data controller is:

- **Yasuhiro Shimizu**, an individual developer based in Japan.
- **Privacy contact (data subject requests):** yshrsmz.ys+pp@gmail.com

We respond to data subject requests within 30 days as required by GDPR Art. 12(3).

## 2. Data stored on your device

The following data is stored only in the App's private storage on your device. The developer has no copy of it.

- **Rules** — host and path patterns and the app each pattern forwards to.
- **Forwarding history** — for each forwarded link: the URL as shared, the URL after expansion, the URL actually opened, the destination app, the time, and which rule matched. The most recent 1,000 entries are kept and older entries are deleted automatically. You can delete individual entries or all of them from the history screen.
- **Your custom lists** — URL parameters you have chosen to remove for specific hosts, domains for which you have turned off "register a rule?" notifications, and link-shortening domains you have added.
- **Settings** — for example whether short links are expanded (§3.2).

### 2.1 Links you share

The App reads the text you share to it, extracts the links, and removes tracking parameters using a list bundled with the App. It then opens the link in the app chosen by your rule or in the selection screen. The link is passed to that app because you asked the App to open it there. Apart from §3.2, the link is not sent anywhere else by the App.

### 2.2 Apps installed on your device

To show you which apps can open a link, the App asks Android for the apps that can handle `https` links. This list is used on the device only and is never sent anywhere.

### 2.3 Export and import

You can export your rules and settings to a JSON file and import them again. You choose where the file is saved and which file is read. Forwarding history is not included in the export. The App does not send the file anywhere.

## 3. Data that leaves your device

### 3.1 Crash and error reports (Firebase Crashlytics, Google LLC)

The App uses [Firebase Crashlytics](https://firebase.google.com/products/crashlytics) to find and fix bugs. When the App crashes, or when it catches an unexpected error, a report is sent to Google. A report contains:

- the stack trace and related app state at the time of the crash or error, and the error message;
- device metadata such as the device model, OS version, and app version;
- recent log lines written by the App (informational level or higher);
- a Crashlytics installation UUID and a Firebase installation ID. These identify an installation of the App, not you or your Google account.

Firebase Crashlytics also includes the Firebase sessions library, which sends app and device metadata, the network connection type, and the time the App came to the foreground, so that crash-free rates can be calculated.

The App never writes the links you share into its logs. However, an error message that the App did not anticipate may contain part of a link, such as a host name, and such a message would be included in a crash report.

Google processes this data on the developer's behalf as a service provider. Crashlytics keeps crash stack traces and the associated identifiers for 90 days, then starts removing them ([Firebase privacy and security](https://firebase.google.com/support/privacy)). The App has no in-app setting to turn crash reporting off.

### 3.2 Expanding short links (link-shortening services)

When a link you share belongs to a known link-shortening service (for example `bit.ly` or `youtu.be`), the App sends a request directly to that service to learn where the link leads, so that your rules can match the real destination. The request goes to the service that issued the link, not to the developer.

- Only links on known shortening domains are requested. Other links cause no network request.
- The service receives the request like any visit to the link: it can see the link, your IP address, and the time, and it may count the request as a click. A single-use link may be used up by the request.
- You can turn short-link expansion off in the App's settings.

### 3.3 Android backup and device-to-device transfer

The App allows Android's automatic backup. If backup is turned on in your device settings, Android copies the App's data (including rules, settings, and forwarding history) to your Google account's backup, and to your new device when you transfer to one. The operating system performs this. The developer cannot access these copies. You can turn off backup in your device's settings, and manage or delete backups from your Google account.

## 4. Permissions requested by the App

| Permission             | Purpose                                                                                                    |
| ---------------------- | ---------------------------------------------------------------------------------------------------------- |
| `INTERNET`             | Expanding short links (§3.2) and sending crash and error reports (§3.1).                                   |
| `POST_NOTIFICATIONS`   | Suggesting that you register a rule for a domain you forwarded (Android 13 and later). You can refuse it.  |
| `ACCESS_NETWORK_STATE` | Added by the Firebase libraries to check for a network connection before sending reports.                  |

## 5. Legal basis for processing (GDPR)

For users in the EEA, the United Kingdom, and Switzerland, we rely on the following legal bases under GDPR Art. 6:

- **Art. 6(1)(b) — performance of a contract:** forwarding and expanding the links you share is the service you request by using the App.
- **Art. 6(1)(f) — legitimate interest:** crash and error reports (§3.1) are used to keep the App working correctly. They contain installation identifiers but no account, name, or contact information.

We do not engage in automated decision-making or profiling under Art. 22.

## 6. International data transfers

Crash and error reports are processed by Google LLC, which may process them in the United States or other countries. Requests to link-shortening services (§3.2) go to wherever those services operate.

## 7. Retention and deletion

- Data stored on your device (§2) stays until you delete it in the App, clear the App's data, or uninstall the App.
- Crash and error reports (§3.1) are kept by Crashlytics for 90 days, then removal starts. Uninstalling the App does not remove reports already sent.
- Backup copies (§3.3) are managed in your Google account and device settings.
- Data received by link-shortening services (§3.2) is governed by each service's own privacy policy.

## 8. Your rights

### 8.1 EEA / UK / Switzerland (GDPR / UK GDPR)

You have the right to request access to, rectification of, or erasure of your personal data, to request restriction of processing, to object to processing based on legitimate interest, and to data portability.

Most of the App's data is on your device and is under your control directly. For crash reports, note that the developer cannot tell which report belongs to whom: reports carry installation identifiers only, and the App has no account. If you want to make a request, contact yshrsmz.ys+pp@gmail.com.

You also have the right to lodge a complaint with your local Data Protection Authority (Art. 77 GDPR).

### 8.2 California (CCPA / CPRA)

- **Categories of personal information collected (last 12 months):** identifiers (Crashlytics installation UUID, Firebase installation ID); internet or other electronic network activity (crash reports and app diagnostics, which may contain a host name as described in §3.1).
- **Source:** automatically from the App on your device.
- **Business purpose:** debugging and fixing errors in the App.
- **Disclosed for a business purpose:** to Google LLC as a service provider for crash reporting.
- **We do not sell or share your personal information**, and we do not engage in cross-context behavioral advertising.
- You may exercise the rights to know, delete, and correct by contacting yshrsmz.ys+pp@gmail.com.

## 9. Children

The App is not directed to children under 13 (or the equivalent minimum age in your jurisdiction). The developer does not knowingly collect personal information from children.

## 10. Google Play User Data policy

The App's handling of user data follows the [Google Play User Data policy](https://support.google.com/googleplay/android-developer/answer/10144311). We do not sell user data, do not use it for advertising, and use it only for the purposes described in this document.

## 11. Security

Crash and error reports and short-link expansion requests are sent over HTTPS. The App does not allow unencrypted HTTP connections, so a short link written with `http://` is not requested and is forwarded as it is. Data on your device is kept in the App's private storage, which other apps cannot read.

## 12. Changes to this policy

If this policy changes in a way that affects what data is handled or where it is sent, we will publish the updated version at this URL with a new "last updated" date and a note in the changelog below.

### Changelog

- **2026-09-25** — Initial publication.

## 13. Language

This policy is published in English. A Japanese translation is available on request via the privacy contact above; in case of conflict, the English version controls.

---

last updated: September 25, 2026
