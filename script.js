document.addEventListener('DOMContentLoaded', () => {
    // Riferimenti agli elementi principali
    const formContainer = document.getElementById('form-container');
    const dashboardContainer = document.getElementById('dashboard-content');
    const toggleViewBtn = document.getElementById('toggle-view');

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
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');

    function show(el, text) {
        el.textContent = text;
        el.style.display = 'block';
    }

    function hide(el) {
        el.style.display = 'none';
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        hide(successMessage);
        hide(errorMessage);

        if (!form.checkValidity()) {
            const firstInvalid = form.querySelector(':invalid');
            if (firstInvalid) firstInvalid.focus();
            show(errorMessage, "Controlla i campi obbligatori.");
            return;
        }

        submitBtn.setAttribute('aria-busy', 'true');
        submitBtn.disabled = true;

        try {
            const urlCartella = 'https://drive.google.com/drive/folders/abcdefg12345';
            setTimeout(() => {
                const message = `Iscrizione completata! Accedi alla tua cartella personale: <a href="${urlCartella}" target="_blank">${urlCartella}</a>`;
                show(successMessage, ''); 
                successMessage.innerHTML = message;
                form.reset();
                submitBtn.removeAttribute('aria-busy');
                submitBtn.disabled = false;
            }, 1500);
        } catch (error) {
            show(errorMessage, "Si è verificato un errore durante l'invio.");
            submitBtn.removeAttribute('aria-busy');
            submitBtn.disabled = false;
        }
    });

    form.addEventListener('input', () => {
        hide(successMessage);
        hide(errorMessage);
    });

    // Logica per la generazione di link di invito
    const invitoSocietaInput = document.getElementById('invito_nome_societa');
    const generaLinkBtn = document.getElementById('genera_link_btn');
    const linkInvitoOutput = document.getElementById('link-invito');

    generaLinkBtn.addEventListener('click', () => {
        const nomeSocieta = invitoSocietaInput.value;
        if (nomeSocieta.trim() === '') {
            linkInvitoOutput.textContent = 'Inserisci un nome per la società.';
            linkInvitoOutput.style.color = '#f44336';
            return;
        }

        const encodedNomeSocieta = encodeURIComponent(nomeSocieta.trim());
        const baseUrl = window.location.origin; 
        const linkGenerato = `${baseUrl}/?societa=${encodedNomeSocieta}`;

        linkInvitoOutput.innerHTML = `Il tuo link di invito è: <br><a href="${linkGenerato}" target="_blank">${linkGenerato}</a>`;
        linkInvitoOutput.style.color = '#4caf50';
    });
});
