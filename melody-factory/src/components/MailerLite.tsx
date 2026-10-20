import Script from 'next/script'

import {MAILERLITE_ACCOUNT_ID} from '@/lib/mailerlite'

/**
 * Laedt MailerLite Universal – darueber laufen die Pop-ups und
 * Anmeldeformulare, die im MailerLite-Konto gepflegt werden. Wann ein
 * Pop-up erscheint (Verzoegerung, Scrolltiefe, Exit-Intent), stellt der
 * Kunde dort ein; hier wird nur das Skript eingebunden.
 *
 * Das Snippet von MailerLite kommt unveraendert hinein: es legt zuerst
 * die Warteschlange window.ml an, haengt dann universal.js in die Seite
 * und meldet das Konto an. Deshalb ein Inline-Skript und nicht nur ein
 * src-Verweis – ml('account', …) muss aufrufbar sein, bevor die Datei
 * geladen ist. Dieselbe Warteschlange faengt auch einen fruehen Klick
 * auf den Newsletter-Knopf auf, solange universal.js noch laedt.
 *
 * Nur im (site)-Layout eingehaengt, damit das Studio davon frei bleibt.
 */
export function MailerLite() {
  return (
    <Script id="mailerlite-universal" strategy="afterInteractive">
      {`(function(w,d,e,u,f,l,n){w[f]=w[f]||function(){(w[f].q=w[f].q||[])
      .push(arguments);},l=d.createElement(e),l.async=1,l.src=u,
      n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);})
      (window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');
      ml('account', '${MAILERLITE_ACCOUNT_ID}');`}
    </Script>
  )
}
