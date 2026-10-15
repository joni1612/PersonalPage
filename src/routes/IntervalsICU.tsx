import { Link } from "react-router-dom";
import PageMeta from "../components/PageMeta";
import { social } from "../data/site";
import styles from "./IntervalsICU.module.css";

const screenshots = [
  { file: "trends", title: "See the bigger picture", text: "Follow your training over time, with the values for your selected date always close at hand.", alt: "Trends screen showing Fitness and Fatigue history with a pinned summary of the selected date." },
  { file: "pace", title: "Make sense of your effort", text: "Readable pace, heart-rate and power charts, with useful scales and a choice of distance or time.", alt: "Running activity showing average pace, a focused pace chart and a distance axis." },
  { file: "calendar", title: "Put the week in context", text: "Browse completed activities and the planned workouts available from your account.", alt: "Calendar screen showing a month of day boxes and the workouts on the selected day." },
];

export default function IntervalsICU() {
  return <div className={`shell ${styles.page}`}>
    <PageMeta title="Intervals ICU Companion — Jonathan Griesinger" description="A native iOS companion for Intervals.icu. Check your training status, explore workouts and see your week at a glance." />
    <Link to="/projects" className={styles.back}>← All projects</Link>
    <section className={styles.hero} aria-labelledby="app-title">
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>For iOS · In development</p>
        <h1 id="app-title">Intervals ICU Companion</h1>
        <p className={styles.lede}>Your training.<br />A little closer.</p>
        <p className={styles.intro}>A quick daily check. A closer look after a workout. Your Intervals.icu data, in a calm, native app that gets you straight to what matters.</p>
        <a href="#screenshots" className={styles.action}>Take a look inside <span aria-hidden="true">↓</span></a>
        <p className={styles.note}>An Intervals.icu account is required to view your own training. You can explore the app with demo data.</p>
      </div>
      <figure className={styles.heroFigure}>
        <img className={styles.phone} src="/images/intervalsicu/today.png" width={1206} height={2622} fetchPriority="high" alt="Today screen with Fitness, Fatigue and Form values, their data date and a recent training chart." />
        <figcaption>Your daily check, without the digging.</figcaption>
      </figure>
    </section>

    <section className={styles.features} aria-label="What the app does">
      <div><span className={styles.number}>01</span><h2>Your training, at a glance</h2><p>Fitness, Fatigue and Form, together with their data date. See your latest workout when you’ve trained today. Saved summaries stay available offline.</p></div>
      <div><span className={styles.number}>02</span><h2>A closer look at your workout</h2><p>Sport-specific highlights first. Then charts, kilometre splits and available recorded laps. Open the full measurements when you want more detail.</p></div>
      <div><span className={styles.number}>03</span><h2>Your week in view</h2><p>A simple calendar brings completed activities and planned entries together. Pick a day and see what’s there.</p></div>
      <div><span className={styles.number}>04</span><h2>A glance from your Home Screen</h2><p>A widget shows your latest saved metrics, their date and today’s latest workout. Tap to open the app. Updates follow iOS’s widget schedule.</p></div>
    </section>

    <section id="screenshots" className={styles.screenshots} aria-labelledby="screenshots-heading">
      <div className={styles.sectionHeading}><h2 id="screenshots-heading">Inside the app</h2><p>iPhone simulator screenshots with synthetic demo data.</p></div>
      <div className={styles.gallery}>{screenshots.map(item => <figure key={item.file}>
        <div className={styles.screenCanvas}><a href={`/images/intervalsicu/${item.file}.png`} aria-label={`View full-size screenshot: ${item.title}`}><img className={styles.phone} src={`/images/intervalsicu/${item.file}.png`} width={1206} height={2622} loading="lazy" alt={item.alt} /></a></div>
        <figcaption><h3>{item.title}</h3><p>{item.text}</p></figcaption>
      </figure>)}</div>
    </section>

    <section className={styles.about} aria-labelledby="connection-heading">
      <div><p className={styles.eyebrow}>Connected, on your terms</p><h2 id="connection-heading">Your data stays yours.</h2></div>
      <div className={styles.prose}>
        <p>Connect securely through Intervals.icu and grant read-only access. Your token is kept in your device’s Keychain; the app doesn’t ask for your password or change your training data.</p>
        <p>This is an independent companion built by Jonathan Griesinger, not an official Intervals.icu app. Fitness and Fatigue are supplied by Intervals.icu. Available activities, charts and laps depend on what your connected sources share.</p>
        <Link to="/intervalsicu/privacy">Privacy policy</Link>
      </div>
    </section>
    <section id="support" className={styles.support} aria-labelledby="support-heading">
      <div><h2 id="support-heading">Questions or feedback?</h2><p>I’d like to hear how the app fits into your training.</p></div>
      <a className={styles.action} href={`mailto:${social.email}?subject=Intervals%20ICU%20Companion%20support`}>Contact support <span aria-hidden="true">↗</span></a>
    </section>
  </div>;
}
