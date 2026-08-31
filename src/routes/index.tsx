import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import "../game/argena.css";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Argena — mroczna gra tekstowa RPG" },
      {
        name: "description",
        content:
          "Argena to polska gra tekstowa RPG: Ziemie Niczyje, walka na supercios, zielarstwo, questy, bestiariusz i frakcje.",
      },
      { property: "og:title", content: "Argena — mroczna gra tekstowa RPG" },
      {
        property: "og:description",
        content:
          "Wciel się w najemnika na Ziemiach Niczyich. Ucz się rzemiosła, poluj, handluj i przetrwaj wojnę dwóch królestw.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600&family=Fraunces:opsz,wght@9..144,300;9..144,400&family=Inter:wght@400;500&display=swap",
      },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    import("../game/argena.js").then((m) => {
      m.startArgena();
    });
  }, []);

  return (
    <div className="argena">
      <h1>Argena</h1>
      <p className="podtytul">Rozdział pierwszy</p>
      <div id="gra" />
      <div id="panel" hidden />
      <nav id="pasek" />
    </div>
  );
}
