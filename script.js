document.addEventListener('DOMContentLoaded', () => {
    // URL del tuo script Google Apps, sostituisci con l'URL che hai ottenuto
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx16pHzWINf93vLVvtCT0oclr0bNfLVSoNDBU_Isa-dHvI5tAr7Cu-2r-nZKgpxoNni/exec';

    // Riferimenti agli elementi principali
    const formContainer = document.getElementById('form-container');
    const dashboardContainer = document.getElementById('dashboard-content');
    const toggleViewBtn = document.getElementById('toggle-view');
    const nomeSocietaLabel = document.getElementById('nome-societa-label');
    const dataNascitaInput = document.getElementById('data_nascita');
    const form = document.getElementById('anagrafica-form');
    const formResponse = document.getElementById('form-response');

    // Funzione per estrarre il parametro 'societa' dall'URL
    const urlParams = new URLSearchParams(window.location.search);
    const nomeSocieta = urlParams.get('societa') || 'Codicillo di Turing'; // Default se non specificato

    // Aggiorna il testo del sottotitolo con il nome della società
    if (nomeSocietaLabel) {
        nomeSocietaLabel.textContent = nomeSocieta;
    }

    // Funzione per cambiare la sezione visibile
    const showDashboard = () => {
        formContainer.style.display = 'none';
        dashboardContainer.style.display = 'block';
        toggleViewBtn.textContent = 'Vai al Form di Iscrizione';
    };

    const showForm = () => {
        dashboardContainer.style.display = 'none';
        formContainer.style.display = 'flex';
        toggleViewBtn.textContent = 'Vai alla Dashboard';
    };

    // Evento per il cambio di sezione
    toggleViewBtn.addEventListener('click', () => {
        if (formContainer.style.display === 'none') {
            showForm();
        } else {
            showDashboard();
        }
    });

    // Inizializzazione di Flatpickr
    const defaultYear = new Date().getFullYear() - 100;
    const defaultPlaceholderDate = `01/01/${defaultYear}`;

    flatpickr(dataNascitaInput, {
        locale: "it",
        dateFormat: "d/m/Y",
        altInput: true,
        altFormat: "d F Y",
        "disableMobile": "true",
        defaultDate: new Date(defaultYear, 0, 1),
        onReady: function(selectedDates, dateStr, instance) {
            instance.altInput.placeholder = defaultPlaceholderDate;
            instance.altInput.classList.add('placeholder-style');
            if (dateStr) {
                instance.altInput.style.color = 'var(--text-dark)';
                instance.altInput.style.fontStyle = 'normal';
            }
        },
        onChange: function(selectedDates, dateStr, instance) {
            if (selectedDates.length > 0) {
                instance.altInput.classList.remove('placeholder-style');
            } else {
                instance.altInput.classList.add('placeholder-style');
            }
        }
    });

    // Logica di invio del form
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        formResponse.innerHTML = 'Invio in corso...';

        // Raccoglie i dati del form
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Aggiunge la "societa" dinamica
        data.nome_societa = nomeSocieta;

        // Invia i dati a Google Apps Script
        fetch(SCRIPT_URL, {
            method: 'POST',
            body: new URLSearchParams(data),
        })
        .then(response => response.json())
        .then(result => {
            if (result.status === 'success') {
                // Rimuovi tutti gli elementi del form eccetto h1 e h2
                const formElements = form.querySelectorAll('label, input, textarea, button');
                formElements.forEach(el => el.remove());

                // Aggiorna il contenuto di form-response per mostrare il messaggio di successo
                const successMsg = `
                    <div style="text-align: center; padding: 2rem; color: #065f46; background-color: #ecfdf5; border: 1px solid #065f46;">
                        <p style="font-size: 1.2rem; margin: 0;">Iscrizione completata con successo!</p>
                        <p style="font-size: 1rem; margin-top: 1rem;">Accedi alla tua cartella personale: <br><a href="${result.folderUrl}" target="_blank">${result.folderUrl}</a></p>
                    </div>
                `;
                formResponse.innerHTML = successMsg;

            } else {
                formResponse.innerHTML = `Errore: ${result.message}`;
            }
        })
        .catch(error => {
            formResponse.innerHTML = `Si è verificato un errore di rete: ${error}`;
        });
    });
});
