# Webprojekt - To Be Determined (WA2)

## Grundidee
 - Rätselwebseite, Community
 - Rätsel können erstellt, hochgeladen und gelöst werden
 - Man hat ein Profil und Basics von Social Media (PB, Banner, Bio, Herkunft, ...)
 - Wenn noch Zeit ist: Nachrichten zwischen Accounts (Wie Insta DMs)

## Inspiration
 - HackTheBox https://www.hackthebox.com/
 - HackThisSite https://hackthissite.org
 - Geocaching https://geocaching.com
 - YouTube https://youtube.com

## Challenges
 - 9 Schwierigkeitsstufen
 - Lösen bring Punkte (Schwerer -> mehr Punkte)
 - Können von jedem Nutzer erstellt werden
 - Können von jedem Nutzer gelöst werden
 - Man muss vom Ersteller festgelegtes Password / String angeben, um eine Challenge zu lösen
 - Challenges müssen nach der Lösung bewertet werden
 - Hat Attribute
 - Hat Tags
### Attribute
 - Schwierigkeit
 - Kategorie (Verschlüsselung, Logik, Bildrätsel, ...)
 - Code (Eindeutige ChallengeID)
 - Ersteller
 - Erstelldatum
 - Bewertung (Durchschnitt aus Bewertungen für Schwierigkeit, Kreativität &  Allgemein)
### Tags
Geben weitere Informationen zur Challenge, z.B. ob besondere Kenntnisse oder Material benötigt werden, z.B.
 - Benötigt Programmierkenntnisse
 - Benötigt Internet
 - Benötigt besondere Software (z.B. Tor, ssh o.Ä.)
 - Benötigt besondere Hardware (z.B. besonders starke Grafikkarte, bestimmte Werkzeug, ...)
 - ...
### Hinweise
 - 3 Stück (Kosten: 0, 20%, 50%)
 - Reduzieren die möglichen Gewinnpunkte
 - Müssen nicht unbedingt angegeben werden
 - Hinweis 1 darf leer sein, die anderen müssen Text enthalten (falls sie optional hinzugefügt werden)
 - Zum Kaufen: ChallengeID und HintNr werden an server übergeben, dieser schickt Hint zurück und erniedrigt mögliche gewinnpunkte

### Bewertung
 - Nach einer gelösten Challenge Pflicht
 - In 1-5 Sternen
 - Kommentare vor Abschluss sichtbar bevor Abschluss, alle Kommentare nach Abschluss sichtbar
 - Bewertbar sind Schwierigkeit, Kreativität und Allgemein

## Profil
 - E-Mail
 - PW
 - Profilbild (optional)
 - Profilbanner (optional)
 - Profilname
 - Profilbiografie
 - Herkunftsland (optional)
 - (Nachrichten)
 - Aus Daten ermittelte Darstellung aus letzem Rätsel, bestbewertseses Rätsel

## Seiten
 - Startseite  
    Mit Infos für neue User
 - Challenges  
    Ähnlich wie "Trending" auf YouTube, zeigt neuste und gut bewertete Chalenges (filterbar nach Tags & Kategorien)
 -  Login  
    Login & Sign up!
 - Accounteinstellungen
    Profilbearbeitung & Passwortupdate
 - (Verwaltung von Abos)
 - Challenge  
    Beschreibung und Infos der Challenge  
    (Sollte über https://seite/challenge/>ChallengeID< abrufbar sein)
