// scripts.js

document.addEventListener('DOMContentLoaded', function() {
	// Smooth scrolling for anchor links
	const navbarLinks = document.querySelectorAll('.navbar a');
	for (let link of navbarLinks) {
		link.addEventListener('click', function(e) {
			e.preventDefault();
			const targetId = this.getAttribute('href').substring(1);
			const targetElement = document.getElementById(targetId);
			if (targetElement) {
				window.scrollTo({
					top: targetElement.offsetTop,
					behavior: 'smooth'
				});
			}
		});
	}

	// Theme panel toggle
	const themeButton = document.getElementById('theme-button');
	const themePanel = document.getElementById('theme-panel');

	themeButton.addEventListener('click', function() {
		if (themePanel.style.right === '0px') {
			themePanel.style.right = '-250px';
		} else {
			themePanel.style.right = '0px';
		}
	});

	// Theme switching
	const themeButtons = themePanel.querySelectorAll('button[data-theme]');

	for (let button of themeButtons) {
		button.addEventListener('click', function() {
			const theme = this.getAttribute('data-theme');
			document.getElementById('theme-stylesheet').setAttribute('href', theme);
			themePanel.style.right = '-250px'; // Close the panel after selecting a theme
		});
	}
});
