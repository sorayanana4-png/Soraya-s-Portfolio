import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import {
  buildHeadMetaMarkup,
  buildLlmsTxt,
  buildRobotsTxt,
  buildSitemapXml,
  getRouteConfigByUniverse,
  getUniverseFromPath,
  UNIVERSE_ROUTES,
} from './seo/seoConfig';

export { buildLlmsTxt, buildRobotsTxt, buildSitemapXml, UNIVERSE_ROUTES };

export function render(urlPath: string, baseUrl?: string) {
  const universe = getUniverseFromPath(urlPath);
  const routeMeta = getRouteConfigByUniverse(universe);
  const html = renderToString(<App initialUniverse={universe} />);
  const headTags = buildHeadMetaMarkup(universe, baseUrl);

  return {
    html,
    headTags,
    universe,
    routeMeta,
  };
}
