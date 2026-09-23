import tippy from "tippy.js";
import type { Content, Instance, Props } from "tippy.js";
import "tippy.js/dist/tippy.css";
import "./tippy.scss";

export function injectTippy(
  target: Element | string,
  content: Content,
): Instance[] {
  const options: Partial<Props> = {
    content,
    allowHTML: true,
    appendTo: () => document.body,
    arrow: true,
    interactive: true,
    placement: "top-start",
    popperOptions: {
      modifiers: [{ name: "flip", enabled: false }],
    },
    theme: "sunmar-shild-component",
    trigger: "mouseenter focus click",
  };

  const instances = typeof target === "string" ? tippy(target, options) : tippy(target, options);

  return Array.isArray(instances) ? instances : [instances];
}
