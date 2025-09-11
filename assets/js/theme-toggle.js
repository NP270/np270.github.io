	const body = document.body;
	const toggle = document.getElementById('theme-toggle');
		
    body.classList.add('dark');
	
    toggle.addEventListener('change', () => {
		if (toggle.checked) {
		    body.classList.replace('dark', 'light');
		} else {
		    body.classList.replace('light', 'dark');
		}
	});