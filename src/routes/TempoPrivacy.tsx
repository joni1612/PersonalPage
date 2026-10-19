import { Link } from "react-router-dom";
import { social } from "../data/site";
import styles from "./IntervalsPrivacy.module.css";

const contents = [
  ["responsible", "Who is responsible"], ["data", "Data the app uses"],
  ["purposes", "How your data is used"], ["storage", "Storage and retention"],
  ["services", "Services involved"], ["deletion", "Disconnecting and deleting data"],
  ["rights", "Your choices and rights"], ["children", "Children"], ["changes", "Changes to this policy"],
];

export default function TempoPrivacy() {
  return <div className={`shell ${styles.page}`}>
    <Link to="/tempostudio" className={styles.back}>Back to the app</Link>
    <header className={styles.header}>
      <p className={styles.eyebrow}>Tempo Studio</p><h1>Privacy policy</h1>
      <p className={styles.date}>Effective and last updated: <time dateTime="2026-10-18">18 October 2026</time></p>
      <p className={styles.lede}>Your videos and training data are used to create the videos you request. This policy explains the connection, local processing and choices you make when exporting or sharing.</p>
    </header>
    <div className={styles.layout}>
      <nav aria-label="On this page" className={styles.contents}><p>On this page</p><ol>{contents.map(([id,label]) => <li key={id}><a href={`#${id}`}>{label}</a></li>)}</ol></nav>
      <article className={styles.policy} aria-label="Tempo Studio privacy policy details">
        <section id="responsible"><h2>Who is responsible</h2>
          <p>Jonathan Griesinger develops Tempo Studio, an independent video-editing app connected to Intervals.icu. This policy covers the app and support correspondence. There is no separate Tempo Studio account or developer-operated workout database.</p>
          <p>For privacy questions or requests, email <a href={`mailto:${social.email}?subject=Tempo%20Studio%20privacy`}>{social.email}</a>. Intervals.icu operates its own account and training-data service separately.</p>
        </section>
        <section id="data"><h2>Data the app uses</h2>
          <ul>
            <li><strong>Selected media:</strong> the videos you choose through the system Photos picker, Files or drag/drop, including their original audio and available media metadata such as duration, orientation and recording date.</li>
            <li><strong>Activity information:</strong> after authorisation, activity identifiers, names, dates, sport and recording source, duration, distance, available average heart rate and cycling power, and GPS route coordinates returned by Intervals.icu. Additional fields present in an activity response may be received in memory but are not added to the card unless supported.</li>
            <li><strong>Connection information:</strong> a short-lived OAuth authorisation code, access token, permissions and athlete identifier/display name, together with random PKCE and state values used to verify the sign-in.</li>
            <li><strong>Your project settings:</strong> series names, dates, timezone, progress label, headline, optional handle, branding choices, edits, cover settings and generated files.</li>
          </ul>
          <p>The app does not access Apple Health or HealthKit, record live GPS, or record from your camera or microphone. Fitness and route information can still be sensitive. Selected footage may contain people, location information or other personal details.</p>
        </section>
        <section id="purposes"><h2>How your data is used</h2>
          <p>The app processes your selections to edit clips, calculate a series progress label, display available activity metrics and a route, render title/card animations, create a cover and export the result. It requests read-only activity permission and does not create or edit workouts in Intervals.icu. Disconnecting revokes the app’s authorisation.</p>
          <p>Processing is carried out at your request to provide these features. You choose whether to authorise access to your fitness data and can withdraw that authorisation. Where applicable law requires consent for health-related information, that access depends on your consent. Support correspondence is used to respond to you and maintain service security.</p>
          <p>The app has no advertising, behavioural analytics, tracking or AI-processing SDKs. We do not sell or rent your videos or training data, use them for advertising, or make medical, insurance or employment decisions from them.</p>
        </section>
        <section id="storage"><h2>Storage and retention</h2>
          <p><strong>On your device:</strong> rendering and video editing happen locally. Imported clips are staged in the app’s temporary directory; original files are preserved. Activity details and routes are held in memory for the project. Series and branding preferences are stored in the app’s local preferences, and credentials are stored in an app-only, device-only Keychain item accessible while the device is unlocked. Normal device backup behaviour can apply to preferences; this policy does not promise that all app settings are excluded from backups.</p>
          <p><strong>Native login:</strong> Tempo Studio uses a public-client OAuth flow with S256 PKCE through Apple’s system authentication browser. The code is exchanged directly with Intervals.icu over HTTPS. There is no login backend operated for Tempo Studio and no developer server that receives your login code or token.</p>
          <p>Returning Home removes the current project state and its staged input clips. Temporary video exports and covers may remain until the operating system purges them or the app is deleted. Saved files in Photos, Files, backups or third-party services remain under your control. App settings remain until you change them or remove the app’s container data. Activity access remains until you disconnect or revoke it.</p>
          <p>If you send a support email, we receive your email address and whatever you include. Correspondence is retained only as needed to respond, handle related follow-up and meet applicable legal obligations. Do not send passwords or access tokens.</p>
        </section>
        <section id="services"><h2>Services involved</h2>
          <ul>
            <li><strong>Intervals.icu:</strong> authenticates you, issues/revokes the token and supplies activity data directly to the app. Your password is entered into its login page, not a Tempo Studio form. Its infrastructure may retain operational/security records under the <a href="https://www.intervals.icu/privacy-policy/">Intervals.icu privacy policy</a>.</li>
            <li><strong>Apple:</strong> supplies app distribution, system media pickers, Photos/Files services, device security, Keychain and optional diagnostics under <a href="https://www.apple.com/legal/privacy/">Apple’s privacy policy</a>. Media stored in iCloud may be downloaded by the operating system when selected. Exported media may sync through your own iCloud settings.</li>
            <li><strong>Services you choose for sharing:</strong> the system share sheet sends a file to the app or destination you select. That service’s terms and privacy practices then apply. Tempo Studio does not automatically publish your videos.</li>
            <li><strong>Website and email providers:</strong> these pages use AWS hosting and self-hosted fonts, without added advertising trackers or analytics cookies. Opening a page or sending email involves connection metadata and processing by those providers. This website does not receive your activity data or OAuth token.</li>
          </ul>
          <p>Provider infrastructure can involve international processing outside your country. Provider policies describe their locations and transfer safeguards. No developer-operated video upload or workout-processing service is used by the app. Disclosures by us are limited to what is needed for your support request or required by law.</p>
        </section>
        <section id="deletion"><h2>Disconnecting and deleting data</h2>
          <p>Open <strong>Connections → Intervals.icu → Disconnect</strong> (also available in Settings). The app first asks Intervals.icu to revoke access, then removes the local credential and current Intervals.icu activity/preview selection.</p>
          <p>If revocation fails, for example while offline, the connection remains so you can retry. The app shows an error and does not claim revocation succeeded. You can also revoke access in your Intervals.icu account settings.</p>
          <p>Disconnecting does not delete imported footage, saved branding, existing exports, your Intervals.icu account or the activities held there. Return Home to remove the current staged footage, delete saved exports in Photos/Files or other destinations, and manage original activities at Intervals.icu. Removing the app normally deletes its local container, but Keychain items can survive uninstall; disconnect before uninstalling when possible. Copies saved elsewhere or included in backups are not deleted by removing the app.</p>
          <p>There is no separate Tempo Studio account to delete. For support correspondence or information you sent to us directly, email the contact above to request deletion.</p>
        </section>
        <section id="rights"><h2>Your choices and rights</h2>
          <p>You can try the built-in demo without an account, decline or revoke activity permission, choose only the clips to import and refuse Photos saving permission while still sharing through Files. The Photos picker grants access to selected videos; saving requests add-only access. You can manage permissions in system Settings.</p>
          <p>Review your route, activity name, dates, metrics and footage before exporting or sharing. They can reveal sensitive information about your training or location. You control the content and recipients of each shared file.</p>
          <p>Depending on applicable law, you may have rights to access, correct, erase, receive a copy of, restrict or object to processing of your personal data, and withdraw consent without affecting lawful earlier processing. Contact us for information we hold; requests about the provider’s records should also go to Intervals.icu. We may need proportionate identity verification to protect your information. Where applicable, you may complain to a data protection supervisory authority in your place of residence, work or the alleged infringement.</p>
        </section>
        <section id="children"><h2>Children</h2><p>Tempo Studio is not designed specifically for children. We do not knowingly request children’s personal information. If you believe a child has sent us personal information, contact us so we can address it. Intervals.icu’s account eligibility rules apply separately.</p></section>
        <section id="changes"><h2>Changes to this policy</h2><p>We will update this page and its date when the app’s processing changes. Material changes requiring a new choice or permission will be presented before that processing begins.</p></section>
      </article>
    </div>
  </div>;
}
