import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getHeadTags } from "../data/seo";

export default function PageMeta() {
  const { pathname } = useLocation();
  useEffect(() => {
    const { title, tags } = getHeadTags(pathname);
    document.head.querySelectorAll('[data-page-meta], meta[name="description"]').forEach(element => element.remove());
    document.title = title;
    const elements = tags.map(({ tag, attributes, text }) => {
      const element = document.createElement(tag);
      element.setAttribute("data-page-meta", "");
      for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
      if (text) element.textContent = text;
      document.head.appendChild(element);
      return element;
    });
    return () => elements.forEach(element => element.remove());
  }, [pathname]);
  return null;
}
