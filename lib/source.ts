import { docs } from "@/.source";
import { loader } from "fumadocs-core/source";
import { createElement } from "react";
import { icons } from "lucide-react";

export const source = loader({
  baseUrl: "/docs",
  icon(icon) {
    if (icon && icon in icons)
      return createElement(icons[icon as keyof typeof icons]);
  },
  source: docs.toFumadocsSource(),
});
