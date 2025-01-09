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
  buttonToday.id = 'ffls-autofill-today';
  
  // Add a click event to the button (example)
  buttonToday.addEventListener('click', async (e) => {
    e.preventDefault();

    // Get the page with the fantasy points so we can make some uber basic projections
    const urlObject = new URL(currentURL);
    const queryParams = new URLSearchParams(urlObject.search);
    queryParams.set('statType', '0');
    urlObject.search = queryParams.toString();

    // TODO: Make this an actual players object
    const players: string[] = [];

    try {
      const response = await fetch(urlObject.href);

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const statsPage = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(statsPage, 'text/html');
      const players = doc.querySelectorAll('#body-center-main table tbody tr');
      // Make sure we set all players to the bench to start so that we can add the players positions
      // easier.
      console.log({players});
    } catch (error) {
      console.log(error);
    }

    // Now that we have all the players, we need to figure out the optimal lineup.

    // Now we have the correct lineup, let's set it in the HTML, and at this point, we should be
    // able to let the page save as it normally would. We might need to just click the submit button.
  });

  // Add the button after the Save Lineup button
  const saveLineupButton = document.querySelector('#body-center-main .form-actions');
  // We're checking if this already exists, if so, don't add it
  const autofillLineupButton = document.querySelector('#ffls-autofill-today')
  if (saveLineupButton && !autofillLineupButton) {
    saveLineupButton.appendChild(buttonToday);
  }
}