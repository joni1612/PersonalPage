import { Link } from "react-router-dom";
import { social } from "../data/site";
import styles from "./IntervalsPrivacy.module.css";

const contents = [
  ["responsible", "Who is responsible"], ["data", "Data the app uses"],
  ["purposes", "How your data is used"], ["storage", "Storage and retention"],
  ["services", "Services involved"], ["deletion", "Disconnecting and deleting data"],
  ["rights", "Your choices and rights"], ["children", "Children"],
  ["changes", "Changes to this policy"],
];

export default function IntervalsPrivacy() {
  return <div className={`shell ${styles.page}`}>
    <Link to="/intervalsicu" className={styles.back}>Back to the app</Link>
    <header className={styles.header}>
      <p className={styles.eyebrow}>Intervals ICU Companion</p>
      <h1>Privacy policy</h1>
      <p className={styles.date}>Effective and last updated: <time dateTime="2026-10-15">15 October 2026</time></p>
      <p className={styles.lede}>Your training data is used to show you your training. This policy explains what the app accesses, where it goes and how you can disconnect.</p>
    </header>
    <div className={styles.layout}>
      <nav aria-label="On this page" className={styles.contents}>
        <p>On this page</p>
        <ol>{contents.map(([id, label]) => <li key={id}><a href={`#${id}`}>{label}</a></li>)}</ol>
      </nav>
      <article className={styles.policy} aria-label="Privacy policy details">
        <section id="responsible">
          <h2>Who is responsible</h2>
          <p>Jonathan Griesinger develops and operates Intervals ICU Companion, an independent, read-only iOS client for Intervals.icu. This policy covers the app, its Home Screen widget, the login service operated for it and support correspondence.</p>
          <p>For privacy questions or requests, contact <a href={`mailto:${social.email}?subject=Intervals%20ICU%20Companion%20privacy`}>{social.email}</a>. Intervals.icu operates its own service and account system separately.</p>
        </section>
        <section id="data">
          <h2>Data the app uses</h2>
          <p>Only after you connect your account and authorise access, the app reads the following information made available by Intervals.icu:</p>
          <ul>
            <li><strong>Account and preferences:</strong> athlete identifier, display name, time zone and Form display preference.</li>
            <li><strong>Training status:</strong> dated Fitness, Fatigue, Form and training-load information.</li>
            <li><strong>Activities:</strong> names, dates, sport, notes, source/device information, duration, distance, elevation, pace, heart-rate, power, cadence, calories, intensity and available lap or interval data.</li>
            <li><strong>Calendar:</strong> completed and planned entries, workout instructions, dates and estimated training load.</li>
            <li><strong>Connection information:</strong> an OAuth authorisation code, access token and the information needed to validate your login.</li>
          </ul>
          <p>Availability depends on your permissions and connected sources. The app does not access Apple Health / HealthKit, record GPS location, or request access to contacts, photos or the microphone. Workout information may still contain personal details that you entered in Intervals.icu.</p>
        </section>
        <section id="purposes">
          <h2>How your data is used</h2>
          <p>The app uses this information to display your training status, history, calendar, activity analysis and widget; remember your display preference; and show saved summaries when you are offline. It does not write or edit workouts in Intervals.icu. Revoking the app connection is the exception to its read-only API access.</p>
          <p>Processing is carried out at your request to provide the connected service. Your authorisation permits access to your Intervals.icu data; where consent is required for fitness or health-related information, you can withdraw it by disconnecting. Necessary security processing and support correspondence serve the legitimate interests of keeping the service secure and responding to you.</p>
          <p>We do not sell or rent your personal data, use it for advertising, send it to AI services, or use it for automated decisions with legal or similarly significant effects. The app contains no advertising or third-party behavioural analytics SDKs.</p>
        </section>
        <section id="storage">
          <h2>Storage and retention</h2>
          <p><strong>On your device:</strong> the access token is stored in an app-only, device-bound Keychain item. Training summaries, calendar entries and display preferences are saved locally for offline use. These cache files use iOS file protection and are excluded from backups. Activity-detail streams and lap analysis are held in memory for the current app session.</p>
          <p><strong>Widget:</strong> a separate local snapshot contains the latest metrics, dates and today’s latest workout, so the app and widget can share them. The widget never receives your access token. Widget information can be visible to someone who can see your Home Screen; you can remove the widget at any time.</p>
          <p><strong>Login server:</strong> the server receives the authorization code and briefly processes the access token returned by Intervals.icu before sending it to the app over HTTPS. It does not use a database to retain access tokens, user accounts or workout data. Subsequent training-data requests go directly from your device to Intervals.icu.</p>
          <p>Local summaries remain until replaced by a refresh or removed by a successful disconnect. In-memory activity details are discarded when the app session ends. The login code has no persistent user-data store. Infrastructure providers may separately process and retain operational or security records, such as IP addresses, request metadata, timestamps and error information, under their service policies and configured retention. A stateless login service does not mean that hosting infrastructure has no logs.</p>
          <p>If you send a support email, we receive your email address and anything you choose to include. Correspondence is kept only as long as necessary to resolve the request and related follow-up, or longer where legally required. Please do not include passwords or access tokens.</p>
        </section>
        <section id="services">
          <h2>Services involved</h2>
          <ul>
            <li><strong>Intervals.icu</strong> authenticates you, issues and revokes access tokens, and supplies your training data. You enter your password on its login page, not into the companion app. Its own processing is described in the <a href="https://www.intervals.icu/privacy-policy/">Intervals.icu privacy policy</a>.</li>
            <li><strong>Cloudflare Workers</strong> hosts the OAuth login service and processes the associated requests. See <a href="https://www.cloudflare.com/privacypolicy/">Cloudflare’s privacy policy</a> for its infrastructure processing.</li>
            <li><strong>Apple</strong> provides app distribution, device security, Keychain and WidgetKit. Any platform diagnostics you choose to share are governed by your Apple settings and <a href="https://www.apple.com/legal/privacy/">Apple’s privacy policy</a>.</li>
            <li><strong>Website and email providers</strong> deliver these information pages and support email. The website is hosted using AWS infrastructure; loading it involves ordinary connection metadata. The site does not receive your Intervals.icu workout data or OAuth token. It uses self-hosted fonts and adds no advertising trackers or analytics cookies.</li>
          </ul>
          <p>We do not share your training data with advertisers or data brokers. Provider infrastructure can involve international processing outside your country. The relevant provider’s privacy terms describe its locations and transfer safeguards. Any further disclosure by us would be limited to what is necessary to comply with applicable law or protect the service and users.</p>
        </section>
        <section id="deletion">
          <h2>Disconnecting and deleting data</h2>
          <p>In the app, open <strong>Settings → Disconnect Intervals.icu</strong>. The app first asks Intervals.icu to revoke access, then removes its saved Keychain credential, local training cache, widget snapshot and in-memory account data.</p>
          <p>If revocation fails, for example while offline, the connection and saved data remain so you can retry. The app shows an error; it does not claim that access has been revoked. Reconnect to the internet and try again. You can also manage the app’s authorisation in your Intervals.icu account settings.</p>
          <p>Disconnecting does not delete your Intervals.icu account or the original activities held there. Manage or delete those through Intervals.icu. Deleting the iOS app normally removes its local app-container data, but Keychain items can survive uninstall; use Disconnect before uninstalling when possible. Removing only the widget does not disconnect the app.</p>
          <p>For support correspondence or other information you have sent directly to us, email the contact above to request deletion. There is no separate companion account or server workout database to delete.</p>
        </section>
        <section id="rights">
          <h2>Your choices and rights</h2>
          <p>You can use the app’s synthetic demo without connecting an account. You choose whether to authorise Intervals.icu access and can withdraw it later. Withdrawing access prevents further authorised fetching and does not affect the lawfulness of earlier processing.</p>
          <p>Depending on the law that applies to you, you may have rights to access, correct, erase or receive a copy of your personal data; restrict or object to processing; and withdraw consent. Contact us to exercise rights relating to information we hold. Requests about data held by Intervals.icu should also be directed to Intervals.icu. We may need proportionate identity verification to protect your information.</p>
          <p>Where applicable, you can complain to your local data protection supervisory authority, including the authority in your place of residence, work or the alleged infringement. We do not use your fitness data to make medical diagnoses or determine eligibility for insurance, employment or similar services.</p>
        </section>
        <section id="children">
          <h2>Children</h2>
          <p>The app is not directed at children under 13, and we do not knowingly collect their personal information through support or the login service. Use of Intervals.icu is also subject to its own eligibility rules. If you believe a child has provided personal information to us without the required authorisation, please contact us.</p>
        </section>
        <section id="changes">
          <h2>Changes to this policy</h2>
          <p>We will update this page and its date when our practices change. Material changes affecting how personal data is used will be communicated through an appropriate notice, and new consent will be requested where required. This policy describes the current app; it does not authorise unrelated future uses of your data.</p>
        </section>
      </article>
    </div>
  </div>;
}
