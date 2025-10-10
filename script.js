document.addEventListener('DOMContentLoaded', () => {

    // ===== Funzione per il Titolo Scorrevole =====
    const baseTitle = "Charta Obscura - Il Codicillo di Turing"; 
    const spacer = " • ";
    const scrollerTitle = baseTitle + spacer;
    
    let scrollIndex = 0; 
    let scrollInterval; // Variabile per tenere traccia dell'intervallo

    function scrollTitle() {
        const newTitle = scrollerTitle.substring(scrollIndex) + scrollerTitle.substring(0, scrollIndex);
        document.title = newTitle;
        
        scrollIndex++;
        
        if (scrollIndex >= scrollerTitle.length) {
            scrollIndex = 0;
        }
    }

    function startScrolling() {
        // Avvia l'intervallo solo se non è già in esecuzione
        if (!scrollInterval) {
            scrollInterval = setInterval(scrollTitle, 300);
        }
    }
    
    function stopScrolling() {
        // Ferma l'intervallo se è in esecuzione
        clearInterval(scrollInterval);
        scrollInterval = null;
    }
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopScrolling();
        } else {
            startScrolling();
        }
    });

    // Avvia lo scorrimento all'inizio
    startScrolling();
    // ===== Fine della Funzione per il Titolo Scorrevole =====

    // ===== Riferimenti agli Elementi HTML e Variabili Globali =====
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx16pHzWINf93vLVvtCT0oclr0bNfLVSoNDBU_Isa-dHvI5tAr7Cu-2r-nZKgpxoNni/exec';
    
    const introContainer = document.getElementById('intro-content');
    const formContainer = document.getElementById('form-container');
    const dashboardContainer = document.getElementById('dashboard-content');
    const blurredBackgroundOverlay = document.getElementById('blurred-background-overlay');
    const toggleViewBtn = document.getElementById('toggle-view');
    const nomeSocietaLabel = document.getElementById('nome-societa-label');
    const dataNascitaInput = document.getElementById('data_nascita');
    const form = document.getElementById('anagrafica-form');
    const formResponse = document.getElementById('form-response');
    const letteraBenvenuto = document.getElementById('lettera-benvenuto');
    
    const urlParams = new URLSearchParams(window.location.search);
    const nomeSocieta = urlParams.get('societa') || 'Codicillo di Turing';
    
    let currentPage = 'intro';

    // ===== Funzioni di Utilità =====
    const setElementVisibility = (element, isVisible) => {
        if (element) {
            element.style.display = isVisible ? 'block' : 'none';
            if (isVisible) {
                element.classList.remove('hidden-at-start');
            }
        }
    };

    // ===== Funzioni per la Gestione della Vista =====
    const updateView = () => {
        const views = {
            intro: introContainer,
            form: formContainer,
            dashboard: dashboardContainer
        };

        // Nascondi tutte le viste principali
        Object.values(views).forEach(view => setElementVisibility(view, false));

        // Mostra la vista corrente
        setElementVisibility(views[currentPage], true);

        // Aggiorna elementi specifici in base alla vista
        const isFormPage = currentPage === 'form';
        setElementVisibility(letteraBenvenuto, isFormPage);
        blurredBackgroundOverlay.classList.toggle('is-blurred', isFormPage);
        formContainer.classList.toggle('is-blurred', isFormPage);

        // Aggiorna il testo del bottone
        const buttonTextMap = {
            intro: 'Vai all\'Invito',
            form: 'Vai alla Dashboard',
            dashboard: 'Torna all\'Invito'
        }
        toggleViewBtn.textContent = buttonTextMap[currentPage];
    };

    // ===== Listener per Eventi =====
    if (letteraBenvenuto) {
        letteraBenvenuto.addEventListener('click', () => {
            setElementVisibility(letteraBenvenuto, false);
            blurredBackgroundOverlay.classList.remove('is-blurred');
            formContainer.classList.remove('is-blurred');
        });
    }

    if (nomeSocietaLabel) {
        nomeSocietaLabel.textContent = nomeSocieta;
    }
    
    toggleViewBtn.addEventListener('click', () => {
        if (currentPage === 'intro') {
            currentPage = 'form';
        } else if (currentPage === 'form') {
            currentPage = 'dashboard';
        } else if (currentPage === 'dashboard') {
            currentPage = 'form';
        }
        updateView();
    });

    // ===== Inizializzazione e Logica Principale =====
    updateView();

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
        .catch(error => {
            formResponse.innerHTML = `Si è verificato un errore di rete: ${error}`;
        });
    });
});
