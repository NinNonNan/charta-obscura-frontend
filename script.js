document.addEventListener('DOMContentLoaded', () => {
    // Riferimenti agli elementi principali
    const formContainer = document.getElementById('form-container');
    const dashboardContainer = document.getElementById('dashboard-content');
    const toggleViewBtn = document.getElementById('toggle-view');

    // Funzione per estrarre il parametro 'societa' dall'URL
    const urlParams = new URLSearchParams(window.location.search);
    const nomeSocieta = urlParams.get('societa') || 'Codicillo di Turing'; // Default se non specificato

    // Aggiorna il testo del sottotitolo con il nome della società
    const nomeSocietaLabel = document.getElementById('nome-societa-label');
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

    // Logica di validazione e invio del form
    const form = document.getElementById('anagrafica-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const formResponse = document.getElementById('form-response');
    const formInner = form.querySelector('div'); // Contenitore interno dei campi del form

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Simula l'invio
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data.societa = nomeSocieta; // Aggiunge il campo societa ai dati

        console.log('Dati da inviare:', data);

        submitBtn.disabled = true;

        try {
            // Qui andrebbe la logica per inviare i dati, ad esempio a un foglio di Google
            // Simuleremo una risposta positiva
            const urlCartella = 'https://drive.google.com/drive/folders/abcdefg12345';
            setTimeout(() => {
                // Rimuovi tutti i campi del form, eccetto il titolo e il sottotitolo
                const formElements = form.querySelectorAll('label, input, textarea, button');
                formElements.forEach(el => el.remove());
                
                // Aggiorna il contenuto di form-response per mostrare il messaggio di successo
                const successMsg = `
                    <div style="text-align: center; padding: 2rem; color: #065f46; background-color: #ecfdf5; border: 1px solid #065f46;">
                        <p style="font-size: 1.2rem; margin: 0;">Iscrizione completata con successo!</p>
                        <p style="font-size: 1rem; margin-top: 1rem;">Accedi alla tua cartella personale: <br><a href="${urlCartella}" target="_blank">${urlCartella}</a></p>
                    </div>
                `;
                formResponse.innerHTML = successMsg;

            }, 1500);

        } catch (error) {
            formResponse.innerHTML = `<p class="error">Si è verificato un errore durante l'invio.</p>`;
            submitBtn.disabled = false;
        }
    });
});
