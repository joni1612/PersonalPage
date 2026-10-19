import { renderToString } from "react-dom/server";
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from "react-router-dom";
import { routes } from "./routes";
export { getHeadTags, publicPaths, siteOrigin } from "./data/seo";

export async function render(pathname: string) {
  const handler = createStaticHandler(routes);
  const context = await handler.query(new Request(`https://jonathangriesinger.de${pathname}`));
  if (context instanceof Response) throw new Error(`Unexpected redirect: ${context.status}`);
  const router = createStaticRouter(handler.dataRoutes, context);
  return renderToString(<StaticRouterProvider router={router} context={context} hydrate={false} />);
}
