# Charta Obscura - Il Codicillo di Turing

### 📜 Descrizione del Progetto

**Charta Obscura - Il Codicillo di Turing** è il frontend di un gioco epistolare digitale che simula un'esperienza di corrispondenza misteriosa, ispirata al mondo letterario di H.P. Lovecraft. Questo progetto funge da interfaccia pubblica e di gestione, permettendo ai partecipanti di iscriversi e interagire con la logica di gioco gestita su un backend di Google Apps Script.

Il nome del progetto, "Il Codicillo di Turing", unisce l'anacronismo di un protocollo digitale all'interno di un'ambientazione arcaica, suggerendo che le forze dietro al gioco sono sia antiche che tecnologicamente avanzate.

### 💻 Tecnologia

Il frontend è costruito con tecnologie web standard per garantire la massima compatibilità e performance:

* **HTML5:** Per la struttura della pagina e del form di iscrizione.
* **CSS3:** Per il design responsive, che assicura un'esperienza utente ottimale su desktop (form centrato) e su mobile (form a schermo intero).
* **JavaScript (ES6):** Per la logica di interazione con il form e per la comunicazione con il backend.

### 🚀 Come Funziona

Questo repository contiene un'applicazione a pagina singola (SPA) che si interfaccia con un'API creata su Google Apps Script. Il flusso di base è il seguente:

1.  L'utente accede al sito web (ospitato su Netlify).
2.  Compila e invia il form di iscrizione.
3.  Il codice JavaScript intercetta i dati del form e li invia tramite una richiesta `POST` all'API di Google Apps Script.
4.  L'API di Apps Script elabora i dati, crea una cartella Drive per l'utente e restituisce il link della cartella al frontend.
5.  Il frontend mostra il link della cartella all'utente come conferma dell'iscrizione.

### 🛠️ Configurazione e Sviluppo

#### Prerequisiti

Per avviare lo sviluppo locale, assicurati di avere:

* Un editor di codice (es. Visual Studio Code)
* Un browser web moderno

#### Avvio

1.  Clona il repository:
    ```bash
    git clone [https://github.com/tuo-username/charta-obscura-frontend.git](https://github.com/tuo-username/charta-obscura-frontend.git)
    ```
2.  Apri la cartella del progetto nel tuo editor di codice.
3.  Apri il file `index.html` nel tuo browser.

**Nota:** Per testare la piena funzionalità, dovrai configurare il backend su Google Apps Script e ottenere l'URL della Web App per aggiornare il file `script.js`.

### 🔗 Link Utili

* **[Repository Backend su Google Apps Script]**
* **[Sito Web Pubblicato su Netlify]**

---
### Contatti

* Progetto di **NinNonNan**
