const currentURL = window.location.href;

// TODO: Add other sports as it's confirmed that it works with them
const targetPages = [
  'https://www.fleaflicker.com/nhl/leagues/*/teams/*'
]

const isTargetPage = targetPages.some(pattern => {
  // You can replace wildcard patterns with a matching condition
  return new RegExp(pattern.replace('*', '.*')).test(currentURL);
});

if (isTargetPage) {
  const buttonToday = document.createElement('button');
  buttonToday.textContent = 'Autofill Lineup for Today';
  buttonToday.className = 'btn btn-primary';
  
  // Add a click event to the button (example)
  buttonToday.addEventListener('click', (e) => {
    alert('Button clicked!');
    e.preventDefault();
  });

  // Add the button after the Save Lineup button
  const saveLineupButton = document.querySelector('#body-center-main .form-actions')
  if (saveLineupButton) {
    saveLineupButton.appendChild(buttonToday);
  }
}