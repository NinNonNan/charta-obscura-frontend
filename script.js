document.addEventListener('DOMContentLoaded', () => {
    // URL del tuo script Google Apps
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx16pHzWINf93vLVvtCT0oclr0bNfLVSoNDBU_Isa-dHvI5tAr7Cu-2r-nZKgpxoNni/exec';
    
    // Riferimenti agli elementi principali
    const formContainer = document.getElementById('form-container');
    const dashboardContainer = document.getElementById('dashboard-content');
    const blurredBackgroundOverlay = document.getElementById('blurred-background-overlay');
    const contentContainer = document.getElementById('content-container'); // Nuovo
    const toggleViewBtn = document.getElementById('toggle-view');
    const nomeSocietaLabel = document.getElementById('nome-societa-label');
    const dataNascitaInput = document.getElementById('data_nascita');
    const form = document.getElementById('anagrafica-form');
    const formResponse = document.getElementById('form-response');
    const letteraBenvenuto = document.getElementById('lettera-benvenuto');
    
    // Funzione per estrarre il parametro 'societa' dall'URL
    const urlParams = new URLSearchParams(window.location.search);
    const nomeSocieta = urlParams.get('societa') || 'Codicillo di Turing';
    
    // Evento per nascondere il foglietto e rimuovere la sfocatura
    if (letteraBenvenuto) {
        letteraBenvenuto.addEventListener('click', () => {
            letteraBenvenuto.classList.add('hidden');
            if (blurredBackgroundOverlay) {
                blurredBackgroundOverlay.classList.add('no-blur'); // Rimuove la sfocatura dal background
            }
            if (formContainer) {
                formContainer.classList.add('no-blur'); // Rimuove la sfocatura dal form
            }
        });
    }

    // Aggiorna il testo del sottotitolo con il nome della società
    if (nomeSocietaLabel) {
        nomeSocietaLabel.textContent = nomeSocieta;
    }

    // Funzione per cambiare la sezione visibile
    const showDashboard = () => {
        formContainer.style.display = 'none';
        dashboardContainer.style.display = 'block';
        letteraBenvenuto.style.display = 'none'; // Nasconde il bigliettino
        
        // Rimuove la sfocatura se l'utente va alla dashboard
        if (blurredBackgroundOverlay) {
            blurredBackgroundOverlay.classList.add('no-blur');
        }
        if (formContainer) {
            formContainer.classList.add('no-blur');
        }
        toggleViewBtn.textContent = 'Vai al Form di Iscrizione';
    };
    
    const showForm = () => {
        dashboardContainer.style.display = 'none';
        formContainer.style.display = 'flex';
        letteraBenvenuto.style.display = 'block'; // Mostra il bigliettino
        
        // Applica la sfocatura quando si torna al form (se il bigliettino è ancora visibile)
        if (!letteraBenvenuto.classList.contains('hidden')) {
            if (blurredBackgroundOverlay) {
                blurredBackgroundOverlay.classList.remove('no-blur');
            }
            if (formContainer) {
                formContainer.classList.remove('no-blur');
            }
        }
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
    
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
    
        data.nome_societa = nomeSocieta;
    
        fetch(SCRIPT_URL, {
            method: 'POST',
            body: new URLSearchParams(data),
        })
        .then(response => response.json())
        .then(result => {
            if (result.status === 'success') {
                const formElements = form.querySelectorAll('label, input, textarea, button');
                formElements.forEach(el => el.remove());
                
                const successMsg = `
                    <div style="text-align: center; padding: 2rem; color: #333; background-color: #fff; border: 1px solid #ccc; border-radius: 8px;">
                        <p style="font-size: 1.2rem; margin: 0;">Iscrizione completata con successo!</p>
                        <p style="font-size: 1rem; margin-top: 1rem;">Accedi alla tua cartella personale: <br><a href="${result.folderUrl}" target="_blank" style="color: #6a0dad; text-decoration: underline;">QUI</a></p>
                    </div>
                `;
                formResponse.innerHTML = successMsg;
            } else {
                formResponse.innerHTML = `Errore: ${result.message}`;
            }
        })
        .
