// import './bootstrap';
import "./echo";
import "../css/app.css";
import "../css/style.css";
import "../css/renderChat.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";

const appName = "Adele";

createInertiaApp({
     title: (title) => `${title} - ${appName}`,
     resolve: (name) =>
          resolvePageComponent(
               `./Pages/${name}.tsx`,
               import.meta.glob("./Pages/**/*.tsx")
          ),
     setup({ el, App, props }) {
          const root = createRoot(el);

          root.render(<App {...props} />);
     },
     progress: {
          color: "#4B5563",
     },
}).then(() => {
     const getDocumentId = document.getElementById("app");
     getDocumentId?.removeAttribute("data-page");
});
