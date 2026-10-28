# NOW! – Melody Factory

Die Eventseite als Next.js-Projekt mit eingebauter Pflege-Oberfläche.

| | |
|---|---|
| Seite | `/` |
| Termine | `/kalender` |
| Newsletter-Anmeldung | `/newsletter` |
| Pflege-Oberfläche | `/studio` |
| Inhalte | Sanity, Projekt `beatt88f`, Dataset `production` |

Ein Projekt, ein Deploy, eine Domain. Das Studio ist kein separates
Programm, sondern eine Route dieser App – der Kunde ruft
`melodyfactory.ch/studio` auf und pflegt dort alles.

---

## Loslegen

```bash
npm install
cp .env.example .env.local     # Werte siehe unten
npm run dev
```

Dann `http://localhost:3000` für die Seite und
`http://localhost:3000/studio` für die Pflege.

### Umgebungsvariablen

| Variable | Pflicht | Wofür |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ja | `beatt88f` |
| `NEXT_PUBLIC_SANITY_DATASET` | ja | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | nein | Datum, auf das das API-Verhalten festgenagelt ist |
| `NEXT_PUBLIC_SITE_URL` | auf Vercel | echte Domain – die Vorschau im Studio zeigt darauf |
| `SANITY_API_READ_TOKEN` | für die Vorschau | Rolle **Viewer**. Nur dann sieht die Vorschau unveröffentlichte Entwürfe |
| `SANITY_API_WRITE_TOKEN` | nur für `npm run seed` | Rolle **Editor**. Gehört **nicht** nach Vercel |

Tokens anlegen: [sanity.io/manage](https://www.sanity.io/manage) → Projekt →
*API* → *Tokens*.

### Inhalte einmalig einspielen

Die Texte, die Besetzung und das Hero-Bild aus dem statischen Entwurf
(`../index.html`, `../background.png`) sowie vier Termine als
Startbestand des Kalenders landen mit einem Befehl im Studio:

```bash
npm run seed -- --dry-run   # erst nur zeigen, was geschrieben würde
npm run seed                # schreiben
```

Der Befehl überschreibt nie etwas. Jeder der beiden Datensätze wird für
sich geprüft: Vorhandenes bleibt unberührt, Fehlendes wird angelegt.
Gewolltes Überschreiben braucht `npm run seed -- --force`.

---

## Was der Kunde pflegen kann

Unter `/studio` stehen zwei Formulare in der Seitenleiste: **Inhalte der
Seite** für die Startseite und **Kalender** für die Terminliste.

### Inhalte der Seite

Aufgeteilt in Reiter, die der Leserichtung der Seite folgen:

| Reiter | Inhalt |
|---|---|
| **Hero** | Hintergrundbild samt Bildausschnitt und Bildbeschreibung, Wortmarke oben links, Schaltfläche oben rechts (zur Terminliste; leer = ausgeblendet), beide Claim-Zeilen, die grosse Wortmarke |
| **Veranstaltung** | Datum und Beginn, Ort (kurz / ausgeschrieben), Stadt, Dauer, weitere Informationen, Ticket-Link und dessen Beschriftung |
| **Intro** | Sektionstitel und der zentrierte Lead (kursiv für Komponistennamen) |
| **Zeit / Ort** | Spaltentitel, die drei Bezeichnungen, beliebig viele zusätzliche Angaben |
| **Besetzung** | Liste aus Instrument und Name, per Ziehen sortierbar |
| **Infos** | Spaltentitel, Fliesstext mit Fett-Auszeichnung, Schlusszeile |
| **Trailer** | Spaltentitel, Video-Datei zum Hochladen *oder* YouTube-/Vimeo-Link, Hinweistext solange keines von beidem hinterlegt ist |
| **Footer** | Linkspalten, Ticket-Aufruf, grosse Wortmarke, rechtliche Zeile |
| **Newsletter** | Titel und Text der Seite `/newsletter`, Beschriftung der Schaltfläche |
| **Suchmaschinen & Social** | Browser-Titel, Beschreibung, Titel/Text/Bild für geteilte Links |

Drei Dinge, die der Pflege Arbeit und Fehler ersparen:

**Datum, Ort und Ticket-Link stehen genau einmal.** Sie erscheinen auf
der Seite an drei Stellen – im Hero, bei «Zeit / Ort» und im Ticket-Aufruf
im Footer – aber gepflegt werden sie nur im Reiter *Veranstaltung*. Das
Datum kann also nie an einer Stelle alt werden. «7. November 2026» und
«20:00 Uhr» rechnet die Seite selbst aus dem Datumsfeld, in Zürcher Zeit.

**Das Video bestimmt seine Form selbst.** Ein hochgeladenes Video wird
gezeigt, wie es ist – Hochformat wie Querformat, der Rahmen passt sich
an. Liegt eine Datei im Feld, hat sie Vorrang vor dem Link daneben.
Vor dem Hochladen komprimieren: unter 10 MB lädt es auch mobil flüssig
(aus 52 MB wurden beim ersten Trailer 8, ohne sichtbaren Verlust).

**Die Besetzung verteilt sich selbst.** Die Liste läuft über zwei Spalten;
wer umsortiert oder jemanden ergänzt, muss nicht an den Umbruch denken.

**Was nicht hingehört, lässt sich nicht eingeben.** Der Fliesstext kennt
nur Absatz, fett, kursiv und Link – keine Titel-Stile, keine Listen. Die
Typografie der Seite ist fest gesetzt, und alles weitere Wählbare könnte
sie nur kaputt machen. Pflichtfelder sind als solche markiert, der
Ticket-Link wird auf eine gültige Adresse geprüft.

### Kalender

Unter `/studio` → **Kalender** steht die Seite `/kalender`: eine
Überschrift und darunter beliebig viele Termine, per Ziehen sortierbar.
Je Termin werden Datum mit Uhrzeit, Ort, Produktion und Ticket-Link
gepflegt.

**Der Ticket-Link schaltet die Schaltfläche frei.** Solange das Feld leer
ist, steht rechts in der Zeile ein blasser Umriss – dieselbe Pille wie
überall auf der Seite, nur ohne Ziel und nicht anklickbar. Sobald der
Vorverkauf steht und die Adresse drin ist, wird daraus der aktive Knopf.
Niemand muss daran denken, etwas ein- oder auszublenden.

**Wochentag und Uhrzeit rechnet die Seite aus dem Datum.** Aus dem
7. November 2026, 20:00 Uhr wird «Samstag 7. November» und «20.00» – der
Wochentag kann so nie zum Datum danebenstehen. Solange kein Termin
erfasst ist, steht anstelle der Liste der Satz aus «Text ohne Termine».

Die Überschrift ist freier Text und keine gerechnete Monatsangabe: dort
steht, was passt – «Termine», «Spielzeit 2026/27», «November 2027» –
auch wenn die Liste über mehrere Monate läuft.

Den Weg zur Seite legen zwei Stellen: die Schaltfläche oben rechts im
Hero (*Inhalte der Seite* → *Hero* → *Schaltfläche oben rechts*) und ein
Footer-Link mit dem Ziel `/kalender` in einer der Linkspalten.

### Newsletter

Die Anmeldung hat eine Adresse: **`/newsletter`**. Damit lässt sich der
Link allein verschicken – per WhatsApp, in einer Mail, auf Instagram. Die
Seite zeigt Titel, Text und den Knopf, der das Formular von MailerLite
öffnet; und das Formular kommt dort auch von allein, weil im
MailerLite-Konto «nach 5 Sekunden» als Auslöser steht. Wer dem Link
folgt, bekommt die Anmeldung also ohne einen Klick; der Knopf ist für
alle, die sie weggeklickt haben. Gepflegt wird die Seite unter *Inhalte
der Seite* → Reiter **Newsletter**.

Zwei Wege führen von jeder Seite dorthin: die Zeile *Newsletter
abonnieren* im Footer unter dem Ticket-Aufruf, und ein Footer-Link mit
dem Ziel `/newsletter` in einer der Linkspalten. Beides sind Links auf
die Seite – ein Pop-up über dem Seitenfuss kam aus dem Nichts, die Seite
dagegen sagt erst, worum es geht.

**Das Formular selbst gehört MailerLite.** Felder, Einwilligungstext,
Bestätigungsmail und Abmeldung werden dort gepflegt, nicht hier – so
steht alles, was rechtlich zählt, an einer Stelle. In diesem Projekt
stehen nur die beiden technischen Kennungen, in `src/lib/mailerlite.ts`:
die Konto-ID und die des Formulars. Sie ändern sich nur, wenn im
MailerLite-Konto ein neues Formular angelegt wird.

### Vorschau

Im Studio gibt es neben der Pflege den Reiter **Vorschau**: links das
Formular, rechts die Seite. Wer tippt, sieht die Änderung sofort – und
kann in der Seite direkt auf einen Text klicken, um im Formular an der
richtigen Stelle zu landen. Dafür braucht es `SANITY_API_READ_TOKEN`.

### Wann eine Änderung auf der Seite ankommt

Veröffentlichte Änderungen erscheinen ohne Deploy – auf zwei Wegen, und
es lohnt sich, den Unterschied zu kennen:

**Sofort, wenn die Seite offen ist.** Sanity meldet die Änderung über die
Live Content API an jeden Browser, der die Seite gerade geöffnet hat;
der meldet sie an Next.js weiter, das genau die betroffenen
Cache-Einträge verwirft. Das ist der Fall beim Arbeiten im
Vorschau-Reiter.

**Sonst beim nächsten Neuladen.** Ist kein Tab offen, wenn gespeichert
wird, meldet niemand etwas – dann greift die Lebensdauer des Caches.
Sie steht in `src/sanity/live.ts` unter `LIFETIME`, und die Zahlen dort
sind mit Bedacht klein: zwischen `revalidate` und `expire` liegt genau
das Fenster, in dem ein Neuladen noch den alten Stand zeigt und erst
das zweite den neuen. Hier ist es eine Sekunde breit – wer nach dem
Speichern neu lädt, sieht den neuen Stand beim ersten Mal.

Der Preis ist eine Abfrage je Seitenaufruf, sofern nicht mehrere
innerhalb von zwei Sekunden zusammenfallen. Für eine Seite dieser
Grösse ist das nichts. Wächst der Verkehr sehr stark, sind höhere Werte
in `LIFETIME` die eine Stelle, an der man dreht – und ein GROQ-Webhook
aus sanity.io/manage auf eine Revalidierungs-Route hält die Seite dann
trotzdem sofort aktuell.

---

## Befehle

| Befehl | Was er tut |
|---|---|
| `npm run dev` | Entwicklungsserver |
| `npm run build` | Produktions-Build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript ohne Ausgabe |
| `npm run typegen` | Schema lesen und `sanity.types.ts` neu schreiben |
| `npm run seed` | Inhalte aus dem statischen Entwurf einspielen |

**Nach jeder Schema-Änderung `npm run typegen` laufen lassen.** Die Typen
der Seite kommen aus dem Schema, nicht aus der Hand – ein umbenanntes Feld
fällt dann sofort in `tsc` auf, statt später als leere Stelle auf der Seite.

---

## Aufbau

```
sanity.config.ts              Studio: Reiter, Werkzeuge, deutsche Oberfläche
sanity.cli.ts                 für `sanity schema` / `sanity typegen`
sanity.types.ts               erzeugt – nicht von Hand ändern
scripts/seed.mjs              Inhalte des Entwurfs einspielen
src/
  app/
    layout.tsx                <html>/<body> für Seite und Studio
    (site)/layout.tsx         Schriften, CSS, Metadaten, Live-Anbindung
    (site)/page.tsx           die Startseite
    (site)/kalender/page.tsx  die Terminliste unter /kalender
    (site)/newsletter/page.tsx  die Anmeldung unter /newsletter
    studio/[[...tool]]/       die Pflege-Oberfläche
    api/draft-mode/enable/    schaltet die Vorschau ein
  components/                 Hero, Sektionen, Kalender, Fliesstext, die zwei Skripte
  sanity/
    schema/                   das Schema – hier wird gepflegt, was pflegbar ist
    structure.ts              Seitenleiste des Studios
    queries.ts                die GROQ-Abfragen, eine je Seite
    live.ts                   Live Content API
  styles/site.css             das CSS des Entwurfs, plus Kalender-Block
```

### Zum CSS

`src/styles/site.css` ist das handgesetzte CSS aus `index.html`, Zeile für
Zeile übernommen: die Tokens, das `--k`-Hero-Raster, die clamp-Skalen.
Hinzu kamen nur zwei Abschnitte: § 10, weil aus dem CMS mehrere Absätze
kommen können, wo im Entwurf einer stand – und die beiden Blöcke der
Unterseiten in § 5 (Kalender, Newsletter), die dieselben Tokens
weiterverwenden.

Darum auch kein Tailwind in diesem Projekt: dessen Preflight würde dieser
Abstimmung ins Handwerk fahren, und zu gewinnen gäbe es nichts – die Seite
bringt ihr Designsystem schon mit.

### Zu den zwei Skripten

Der Entwurf hatte zwei Inline-Skripte: das Einblenden der `.reveal`-Zeilen
und einen Parallax-Rückfall für Browser ohne scroll-getriebene
Animationen. Beide sind jetzt Client-Komponenten
(`RevealOnScroll`, `HeroParallaxFallback`) und setzen ihre Klassen erst
nach der Hydration. Vorher gesetzt wären sie für React ein Unterschied
zwischen Server-HTML und Client-Render, und React würde sie wieder
entfernen. Ohne JavaScript bleibt die Seite unverändert vollständig
sichtbar – wie im Entwurf.
