import { Link, useLocation } from "react-router-dom";
import { projects } from "../data/projects";
import styles from "./Projects.module.css";

const studies = {
  "/projects/rag-doc-chat": {
    name: "RAG Doc Chat",
    problem: "Finding an answer in a collection of documents is only useful when you can check the source. This project pairs document questions with citations that lead back to the original PDF page.",
    approach: "The stack combines a React interface with Python, FastAPI and Qdrant, using OpenAI and Claude for document question answering. Documents are pre-loaded so the question flow can focus on retrieving relevant information and presenting a grounded answer.",
    result: "Each answer includes a citation that opens the PDF at the referenced page. The interface keeps the answer and its evidence connected, allowing the reader to inspect the original context.",
    related: "/projects/invoice-extractor",
    relatedName: "Invoice Extractor",
  },
  "/projects/invoice-extractor": {
    name: "Invoice Extractor",
    problem: "Invoices arrive as both PDFs and images. Turning them into a consistent table requires extraction, validation and a way to identify duplicates.",
    approach: "Python and FastAPI handle document processing with Claude’s vision capabilities. A React interface built with Vite and Tailwind CSS presents the structured results in a table.",
    result: "The workflow accepts PDF and JPEG invoices, extracts structured fields, validates the results and flags duplicates. The table brings the extracted information together for review.",
    related: "/projects/rag-doc-chat",
    relatedName: "RAG Doc Chat",
  },
};

export default function CaseStudy() {
  const { pathname } = useLocation();
  const study = studies[pathname as keyof typeof studies];
  const project = projects.find(item => item.name === study.name)!;
  return <article className={`shell ${styles.intro}`}>
    <Link to="/projects">← All projects</Link>
    <h1 className={styles.heading}>{study.name}</h1>
    <p className={`${styles.lede} measure`}>{project.blurb}</p>
    <div className={styles.caseStudy}>
      <section><h2>The problem</h2><p>{study.problem}</p></section>
      <section><h2>The approach</h2><p>{study.approach}</p></section>
      <section><h2>The workflow</h2><p>{study.result}</p></section>
      <section><h2>Built with</h2><ul>{project.tech.map(tech => <li key={tech}>{tech}</li>)}</ul></section>
      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">View {study.name} on GitHub →</a>
      <p>Related project: <Link to={study.related}>{study.relatedName}</Link></p>
    </div>
  </article>;
}
