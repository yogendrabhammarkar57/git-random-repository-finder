const heading = document.querySelector('.main-menu');
const dropDown = document.querySelector('.drop-down');
const arrowRotate = document.querySelector('.rot');
const lang = document.querySelector('.lang');
const lang1 = document.querySelector('.lang1');
const desc = document.querySelector('.desc');
const stars = document.querySelector('.star');
const forks = document.querySelector('.forks');
const issues = document.querySelector('.issues');
const names = document.querySelector('.name');
const btnTxt = document.querySelector('.btn-txt');
const Button = document.querySelector('.button');
const showingArea = document.querySelector('.showing-area');
const icons = document.querySelector(".icons");

// Toggle dropdown
heading.addEventListener('click', () => {
  dropDown.classList.toggle('active');
  arrowRotate.classList.toggle('rotate');
});

// Create a main div to hold all language options
let main = document.createElement('div');
main.classList.add('main');

fetch('https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json')
  .then(response => response.json())
  .then(data => {
    data.forEach((item) => {
      let titleDiv = document.createElement('p');
      const line = document.createElement('div');
      line.classList.add('line');
      titleDiv.classList.add('active');
      titleDiv.innerText = item.title;

      titleDiv.addEventListener('click', () => {
        fetchRepository(item.title);
        dropDown.classList.remove('active'); // Hide dropdown
        arrowRotate.classList.remove('rotate'); // Reset arrow rotation
        icons.classList.add('hide'); // Hide icons initially
      });

      main.appendChild(titleDiv);
      main.appendChild(line);
    });
  })
  .catch(error => console.error('Error loading languages:', error));

dropDown.appendChild(main);

async function fetchRepository(language) {
  const url = `https://api.github.com/search/repositories?q=language:${language}&sort=forks&order=desc`;

  // Show loading state
  lang1.innerText = "Loading...";
  names.innerText = "";
  desc.innerText = "Fetching Repository...";
  stars.innerText = "-";
  forks.innerText = "-";
  issues.innerText = "-";

  // Reset error states
  Button.classList.remove('errbtn');
  showingArea.classList.remove('err');
  names.classList.remove('hide');
  desc.classList.remove('error-msg');
  icons.classList.remove('hide');

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.items.length);
      const randomRepo = data.items[randomIndex];

      function truncateText(text, maxWords) {
        const words = text.split(" ");
        return words.length > maxWords ? words.slice(0, maxWords).join(" ") + "..." : text;
      }

      lang.innerText = randomRepo.language || "Unknown";
      lang1.innerText = randomRepo.language || "Unknown";
      desc.innerText = truncateText(randomRepo.description || "No description available", 20);
      stars.innerText = randomRepo.stargazers_count || 0;
      forks.innerText = randomRepo.forks_count || 0;
      issues.innerText = randomRepo.open_issues_count || 0;
      names.innerText = randomRepo.name || "No Name";

      Button.classList.add('show');
      Button.classList.remove('hide');
      btnTxt.innerText = "Refresh";
      icons.classList.remove('hide');


      // Update button click event to fetch a new repository
      Button.onclick = () => fetchRepository(language);
    } else {
      showErrorState("Error fetching repositories");
    }
  } catch (error) {
    console.error("Error fetching repositories:", error);
    showErrorState("Error fetching repositories. Please try again.");
  }
}

// Function to handle error state
function showErrorState(message) {
  btnTxt.innerText = "Retry";
  Button.classList.add('errbtn');
  showingArea.classList.add('err');
  desc.innerText = message;
  desc.classList.add('error-msg'); // Styling for error text
  icons.classList.remove('hide'); // Hide icons when error occurs
  names.classList.add('hide'); // Hide repository name
  lang1.innerText = randomRepo.language;
}
