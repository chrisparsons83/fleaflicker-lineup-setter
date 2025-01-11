// import z from 'zod';

// const RosterApiSchema = z.object({
//   rosterPositions: z.object({
//     label: z.string(),
//     start: z.number(),
//   }).array()
// })

// List of positions
const positions = ['C', 'LW', 'RW', 'W', 'F', 'D', 'G'] as const;

// Type based on the list of positions
type Position = typeof positions[number];

// Set of valid positions for quick lookups
const positionSet = new Set(positions);

// Type guard to check if a value is a valid Position
function isPosition(value: any): value is Position {
  return positionSet.has(value);
}

type Player = {
  name: string,
  averagePoints: number,
  formFieldId: string
  positions: Position[]
}

type Roster = Record<Position, (Player | null)[]>

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

  const buttonWeek = document.createElement('button');
  buttonWeek.textContent = 'Autofill Lineup for Week';
  buttonWeek.className = 'btn btn-primary';
  buttonWeek.id = 'ffls-autofill-week';
  
  // Add a click event to the button (example)
  buttonToday.addEventListener('click', async (e) => {
    e.preventDefault();

    // Get the page with the fantasy points so we can make some uber basic projections
    const urlObject = new URL(currentURL);
    const queryParams = new URLSearchParams(urlObject.search);
    queryParams.set('statType', '0');
    urlObject.search = queryParams.toString();

    const players: Player[] = [];
    const initialPositionRecord = positions.reduce(
      (acc, position) => {
        if (isPosition(position)) {
          acc[position] = [];
        }
        return acc;
      },
      {} as Roster
    );
    console.log({initialPositionRecord});

    // I might want to do this all within this one catch so I can submit right from it?
    // Can I do that?
    try {
      // Get roster rules
      const rosterData = new URLSearchParams();
      rosterData.append('sport', 'NHL');
      rosterData.append('league_id', '12086');
      const rosterResponse = await fetch('https://www.fleaflicker.com/api/FetchLeagueRules?' + rosterData.toString())
      const rosterResponseData = await rosterResponse.json();
      // const rosterResponseData = RosterApiSchema.parse(rawRosterResponseData)
      for (const rosterPosition of rosterResponseData.rosterPositions) {
        console.log({label: rosterPosition.label, start: rosterPosition.start});
        if (isPosition(rosterPosition.label)) {

        }
      }

      const response = await fetch(urlObject.href);

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const statsPage = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(statsPage, 'text/html');
      const domPlayers = doc.querySelectorAll('#body-center-main table tbody tr');
      // Make sure we set all players to the bench to start so that we can add the players positions
      // easier.
      for (const domPlayer of domPlayers) {
        const firstCellText = domPlayer.firstElementChild?.textContent?.trim();
        // If this is Injured Reserve, we can break because we don't care about anything after
        if (firstCellText === 'Injured Reserve') {
          break;
        }

        // If there's only one cell anyhow, this is just a spacer and we can continue onto the next
        // row
        if (domPlayer.children.length === 1) {
          continue;
        }

        const positionLocked = domPlayer.querySelector('td:last-child .label');
        const position = positionLocked ? positionLocked.textContent?.trim() : domPlayer.querySelector('td:last-child .form-control')?.firstElementChild?.textContent?.trim();

        console.log({positionLocked: !!positionLocked, position});

        // Build the player object and add to the array
        players.push({
          name: domPlayer.querySelector('.player-text')?.textContent?.trim() || '',
          averagePoints: Number(domPlayer.querySelector('td:nth-child(11) .fp')?.textContent?.trim()),
          formFieldId: domPlayer.querySelector('td:last-child .form-control')?.getAttribute('name') || '',
          positions: domPlayer.querySelector('.position')?.textContent?.trim().split('/').filter(isPosition) || []
        });
      }

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
    saveLineupButton.appendChild(buttonWeek);
  }
}