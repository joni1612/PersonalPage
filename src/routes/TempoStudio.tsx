import { Link } from "react-router-dom";
import { social } from "../data/site";
import styles from "./IntervalsICU.module.css";
import ResponsiveImage from "../components/ResponsiveImage";

const screenshots = [
  { file: "timeline", title: "Make the cut", text: "Trim, split, reorder and rotate your clips. Undo and redo keep experimentation simple.", alt: "Tempo Studio clip editor with a portrait video canvas, selected clip, timeline handles and editing tools." },
  { file: "activity", title: "Bring in your effort", text: "Choose a date and match the video to an activity. Your series calculates the day for you.", alt: "Activity step showing a training-series day, selected date and cycling activity with distance and duration." },
  { file: "style", title: "Make it yours", text: "Keep a recognisable look with a headline, font, colour, handle, layout and animation saved to your series.", alt: "Style step showing a bold series title and day preview, intro controls and a Generate reel button." },
  { file: "branding", title: "Let the numbers tell the story", text: "Style your opening title and route/stat card, including available heart rate and cycling power.", alt: "Saved style editor showing a route and cycling stats card preview with typography and colour controls." },
  { file: "cover", title: "Give it a matching cover", text: "Choose a frame, adjust the crop and export a cover with the same title and visual identity.", alt: "Reel cover editor with a branded portrait image, frame selector, headline and crop controls." },
];

export default function TempoStudio() {
  return <div className={`shell ${styles.page}`}>
    <Link to="/projects" className={styles.back}>← All projects</Link>
    <section className={styles.hero} aria-labelledby="tempo-title">
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>For iPhone & iPad · Preparing for launch</p>
        <h1 id="tempo-title">Tempo Studio</h1>
        <p className={styles.lede}>Your effort.<br />Ready to share.</p>
        <p className={styles.intro}>Turn your training footage into a story worth sharing. Cut your clips, connect your activity and add your route and stats in your own style.</p>
        <a href="#screenshots" className={styles.action}>Take a look inside <span aria-hidden="true">↓</span></a>
        <p className={styles.note}>An Intervals.icu account is needed for your own activity data. The built-in demo works without an account. Video editing and rendering happen on your device.</p>
      </div>
      <figure className={styles.heroFigure}>
        <ResponsiveImage asset="tempostudio/cover" sizes="(max-width: 420px) 65vw, 256px" className={styles.phone} src="/images/tempostudio/cover.png" width={1206} height={2622} loading="eager" fetchPriority="high" alt="Tempo Studio cover editor showing a training-series title over selected outdoor footage." />
        <figcaption>A matching cover for your training story.</figcaption>
      </figure>
    </section>
    <section className={styles.features} aria-label="What Tempo Studio does">
      <div><span className={styles.number}>01 · Clips</span><h2>Make the cut</h2><p>Bring in videos from Photos or Files. Trim, split, rearrange and rotate them on a responsive timeline. Keep the original files intact.</p></div>
      <div><span className={styles.number}>02 · Activity</span><h2>Bring in your effort</h2><p>Choose an activity from Intervals.icu. Add distance, time, your GPS route, average heart rate and cycling power when the activity contains them.</p></div>
      <div><span className={styles.number}>03 · Style</span><h2>Make it yours</h2><p>Build a recurring series with a start date, dynamic progress label and saved branding. Change this video’s headline without changing the whole series.</p></div>
      <div><span className={styles.number}>04 · Share</span><h2>Ready for your next Reel</h2><p>Generate an animated title and closing activity card, preview the result and export a 1080 × 1920 MP4. Create a matching PNG cover, then save or share both.</p></div>
    </section>
    <section id="screenshots" className={styles.screenshots} aria-labelledby="tempo-screenshots">
      <div className={styles.sectionHeading}><h2 id="tempo-screenshots">Inside Tempo Studio</h2><p>Real iPhone simulator screenshots with demo activity data.</p></div>
      <div className={styles.gallery}>{screenshots.map(item => <figure key={item.file}>
        <div className={styles.screenCanvas}><a href={`/images/tempostudio/${item.file}.png`} aria-label={`View full-size screenshot: ${item.title}`}><ResponsiveImage asset={`tempostudio/${item.file}`} sizes="240px" className={styles.phone} src={`/images/tempostudio/${item.file}.png`} width={1206} height={2622} loading="lazy" alt={item.alt} /></a></div>
        <figcaption><h3>{item.title}</h3><p>{item.text}</p></figcaption>
      </figure>)}</div>
    </section>
    <section className={styles.about} aria-labelledby="tempo-connection">
      <div><p className={styles.eyebrow}>Local editing · Secure connection</p><h2 id="tempo-connection">Create on your device.</h2></div>
      <div className={styles.prose}>
        <p>Sign in to Intervals.icu through the system browser with read-only activity permission. The app stores the access token in your device’s Keychain and requests your activity directly. There is no Tempo Studio login backend or video upload service.</p>
        <p>Intervals.icu is currently the only available activity integration. Direct Garmin sync into Intervals.icu can provide the route and metrics for Garmin recordings. Availability depends on the original recording, sync and permissions; Strava-sourced restricted placeholders cannot supply a complete card.</p>
        <p>Tempo Studio is an independent app by Jonathan Griesinger. It is not affiliated with Intervals.icu, Garmin, Instagram or Meta. You choose what to export and where to share it; publishing is not automatic.</p>
        <Link to="/tempostudio/privacy">Privacy policy</Link>
      </div>
    </section>
    <section id="support" className={styles.support} aria-labelledby="tempo-support">
      <div><h2 id="tempo-support">Questions or feedback?</h2><p>Tell me how Tempo Studio fits into your training and content workflow.</p></div>
      <a className={styles.action} href={`mailto:${social.email}?subject=Tempo%20Studio%20support`}>Contact support <span aria-hidden="true">↗</span></a>
    </section>
  </div>;
}
