const mobileNavButton = document.querySelector('#nav-right i');
const mobileNavMenu = document.querySelector('#nav-mobile');

mobileNavButton.addEventListener('click', () => {
	if (
		mobileNavMenu.style.display === 'none' ||
		mobileNavMenu.style.display === ''
	)
		mobileNavMenu.style.display = 'block';
	else mobileNavMenu.style.display = 'none';
});
