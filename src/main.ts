const form = document.querySelector("#track-form") as HTMLFormElement;
const titleInput = document.querySelector("#title") as HTMLInputElement;
const durationInput = document.querySelector("#duration") as HTMLInputElement;
const list = document.querySelector("#list") as HTMLUListElement;
const totalEl = document.querySelector("#total") as HTMLSpanElement;
const genreSelector = document.querySelector("#genre") as HTMLSelectElement;

console.log("Playlist Builder startar...");

type Genre = "pop" | "rock" | "other";

interface Track {
  id: number;
  title: string;
  duration: number | null;
  genre: Genre;
  isFavorite: boolean;
}

let tracks: Track[] = [
  { id: 0, title: "Test track", duration: 125, genre: "other", isFavorite: false },
];

function parseDuration(time: string): number | null {
  if (!time) return null;

  // Validate mm:ss input
  const parts = time.split(":");
  if (parts.length !== 2) return null;
  const [minutes, seconds] = parts;
  if (
    minutes.length < 1 ||
    minutes.length > 2 ||
    seconds.length !== 2 ||
    isNaN(Number(minutes)) ||
    isNaN(Number(seconds)) ||
    Number(seconds) > 59
  ) {
    return null;
  }

  return parseInt(minutes) * 60 + parseInt(seconds);
}

function formatDuration(time: number): string {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString()}:${seconds.toString().padStart(2, "0")}`;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  // 1. Läs titel och längd (och genre)
  const title = titleInput.value.trim();
  let duration = durationInput.value.trim();
  const genre = genreSelector.value as Genre;

  // 2. Använd parseDuration
  const parsedDuration = parseDuration(duration);

  // 3. Skapa ett Track-objekt
  const track: Track = {
    id: Math.floor(Math.random() * 10000000),
    title,
    duration: parsedDuration,
    genre,
    isFavorite: false,
  };

  // 4. Lägg till i tracks-arrayen
  tracks.push(track);

  // 5. Töm formuläret
  titleInput.value = "";
  durationInput.value = "";

  // 6. Anropa render()
  render();
});

function render() {
  console.log("tracks:", tracks);
  list.innerHTML = "";
  tracks.map((track) => {
    // Li element
    const li = document.createElement("li");
    li.innerText =
      track.title +
      " - " +
      (track.duration !== null ? formatDuration(track.duration) : "??:??") +
      ` (${track.genre})`;
    list.appendChild(li);

    // Favorite input and label
    const input = document.createElement("input");
    const label = document.createElement("label");

    input.id = "fav";
    input.type = "checkbox";
    input.checked = track.isFavorite;
    input.addEventListener("click", () => {
      track.isFavorite = !track.isFavorite;
      render();
      console.log(track.title, "changed favorite to: ", track.isFavorite);
    });

    label.innerText = " Fav:";
    label.htmlFor = "fav";

    li.appendChild(label);
    li.appendChild(input);

    // Delete button
    const button = document.createElement("button");
    button.innerText = "Del.";
    button.addEventListener("click", () => {
      const newTracks = tracks.filter((t) => t.id !== track.id);
      tracks = newTracks;
      render();
    });

    li.appendChild(button);

    // Total time
    const totalTime = tracks.reduce((sum, track) => sum + (track.duration ?? 0), 0);

    totalEl.innerText = formatDuration(totalTime);
  });
}

render();
