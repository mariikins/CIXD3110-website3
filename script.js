const routeData = {
  water: {
    stamp: "WATER PERSON",
    meta: "45 min · start at W Street",
    name: "Follow gravity.",
    description:
      "Begin at the reflecting pool, look up the full cascade, then climb beside all thirteen basins. You will understand why the park is a machine for perspective.",
    mission: "Count the basins without using your fingers.",
  },
  art: {
    stamp: "BRONZE GOSSIP",
    meta: "60 min · five public artworks",
    name: "Collect strange heroes.",
    description:
      "Start with Dante and Buchanan below, find the restored armillary sphere, then climb to Serenity and Joan of Arc—the city’s only equestrian statue of a woman.",
    mission: "Invent one respectful question for every statue.",
  },
  sunday: {
    stamp: "SOCIAL WEATHER",
    meta: "Sunday afternoon · upper lawn",
    name: "Borrow the rhythm.",
    description:
      "Follow the sound toward the upper park. Make room for drummers, dancers, picnics, soccer, yoga and a public tradition that belongs to everyone at once.",
    mission: "Stay for three songs longer than you planned.",
  },
  quiet: {
    stamp: "SOFT CREATURE",
    meta: "30 min · no objective required",
    name: "Do less, beautifully.",
    description:
      "Choose an old tree at the edge of the upper lawn. Sit where the formal geometry loosens. Watch the park rearrange itself around you.",
    mission: "Notice five greens and name none of them correctly.",
  },
};

const stopData = {
  joan: {
    image: "assets/joan.jpg",
    alt: "The Joan of Arc statue in autumn",
    credit: "NPS",
    label: "STOP 01 / UPPER LEVEL",
    title: "Joan, mid-charge.",
    text: "Dedicated in 1922, this is Washington’s only equestrian statue of a woman. The gift links the women of France with the women of America.",
    fact: "The sword—returned in 2011.",
  },
  lawn: {
    image: "assets/joan.jpg",
    alt: "The open upper lawn behind the Joan of Arc statue",
    credit: "NPS",
    label: "STOP 02 / UPPER LEVEL",
    title: "A room without a roof.",
    text: "The long upper mall is the park’s social center: generous enough for games, rest, protest, drums, dance and the surprisingly serious work of doing nothing.",
    fact: "A clear axis, framed by mature trees.",
  },
  cascade: {
    image: "assets/cascade.jpg",
    alt: "The thirteen-basin cascading fountain",
    credit: "NPS / DOI / Kelsey Graczyk",
    label: "STOP 03 / THE DROP",
    title: "Perspective, weaponized.",
    text: "Each of the thirteen basins widens as it descends, making the cascade seem longer from below. Water first ran here in 1932 and returned after repairs in May 2026.",
    fact: "The widening steps at the lower end.",
  },
  sphere: {
    image: "assets/meridian-1936.jpg",
    alt: "Historic view of the lower plaza at Meridian Hill Park",
    credit: "NPS History Collection",
    label: "STOP 04 / LOWER PLAZA",
    title: "The universe came back.",
    text: "A new armillary sphere was installed in November 2024, recreating the long-missing original from historic photographs and drawings.",
    fact: "A celestial model on a very earthly plaza.",
  },
  pool: {
    image: "assets/fountain-visitors.jpg",
    alt: "Visitors near the cascade and reflecting pool",
    credit: "NPS / Tony DeYoung",
    label: "STOP 05 / LOWER PLAZA",
    title: "The hill holds still.",
    text: "At the base of the cascade, the reflecting pool turns all that downward energy into a broad pause. It reopened with the lower plaza in May 2026.",
    fact: "Look up—the illusion works best from here.",
  },
};

const byId = (id) => document.getElementById(id);

const selectRoute = (routeId) => {
    const route = routeData[routeId];
    if (!route) throw new Error(`Unknown park mood: ${routeId}`);
    document.querySelectorAll(".route-button").forEach((item) => item.classList.remove("active"));
    document.querySelector(`[data-route="${routeId}"]`)?.classList.add("active");
    byId("route-stamp").textContent = route.stamp;
    byId("route-meta").textContent = route.meta;
    byId("route-name").textContent = route.name;
    byId("route-description").textContent = route.description;
    byId("route-mission").textContent = route.mission;
    const card = byId("route-result");
    card.classList.remove("pulse");
    requestAnimationFrame(() => card.classList.add("pulse"));
    return { routeId, name: route.name, mission: route.mission };
};

document.querySelectorAll(".route-button").forEach((button) => {
  button.addEventListener("click", () => selectRoute(button.dataset.route));
});

const showStop = (stopId) => {
    const stop = stopData[stopId];
    if (!stop) throw new Error(`Unknown park stop: ${stopId}`);
    document.querySelectorAll(".hotspot").forEach((item) => item.classList.remove("active"));
    document.querySelector(`[data-stop="${stopId}"]`)?.classList.add("active");
    byId("stop-image").src = stop.image;
    byId("stop-image").alt = stop.alt;
    byId("stop-credit").textContent = stop.credit;
    byId("stop-label").textContent = stop.label;
    byId("stop-title").textContent = stop.title;
    byId("stop-text").textContent = stop.text;
    byId("stop-fact").textContent = stop.fact;
    const card = byId("stop-card");
    card.classList.remove("swap");
    requestAnimationFrame(() => card.classList.add("swap"));
    return { stopId, title: stop.title, detail: stop.text };
};

document.querySelectorAll(".hotspot").forEach((button) => {
  button.addEventListener("click", () => showStop(button.dataset.stop));
});

const registerWebMCPTools = () => {
  const context = document.modelContext;
  if (!context?.registerTool) return;
  const lifecycle = new AbortController();
  const register = (tool) => {
    try {
      void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => {});
    } catch (_) {
      // Browsers without a complete WebMCP implementation keep the visible UI unchanged.
    }
  };

  register({
    name: "select_park_mood",
    title: "Select a park mood",
    description: "Choose a park mood and show its suggested route and tiny mission in the field guide.",
    inputSchema: {
      type: "object",
      properties: {
        mood: { type: "string", enum: ["water", "art", "sunday", "quiet"] },
      },
      required: ["mood"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute(input) {
      if (!input || !routeData[input.mood]) throw new Error("Choose water, art, sunday, or quiet.");
      return selectRoute(input.mood);
    },
  });

  register({
    name: "show_park_stop",
    title: "Show a park stop",
    description: "Open one stop in the interactive park anatomy diagram and return its historical note.",
    inputSchema: {
      type: "object",
      properties: {
        stop: { type: "string", enum: ["joan", "lawn", "cascade", "sphere", "pool"] },
      },
      required: ["stop"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true, untrustedContentHint: false },
    execute(input) {
      if (!input || !stopData[input.stop]) throw new Error("Choose joan, lawn, cascade, sphere, or pool.");
      return showStop(input.stop);
    },
  });
};

registerWebMCPTools();

const slider = byId("time-slider");
const updateCompare = () => {
  const value = `${slider.value}%`;
  byId("compare-old").style.width = value;
  byId("compare-line").style.left = value;
};
slider.addEventListener("input", updateCompare);

const statusElement = byId("park-status");
const updateParkStatus = () => {
  const dcParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    month: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const values = Object.fromEntries(dcParts.map((part) => [part.type, part.value]));
  const month = Number(values.month);
  const hour = Number(values.hour) % 24;
  const isSummer = month >= 5 && month <= 10;
  const closeHour = isSummer ? 24 : 21;
  const isOpen = hour >= 5 && hour < closeHour;
  const closeLabel = isSummer ? "midnight" : "9 pm";
  statusElement.textContent = isOpen ? `Park hours now · closes ${closeLabel}` : "Park hours now · closed";
  document.querySelector(".park-pulse i").style.background = isOpen ? "var(--acid)" : "var(--coral)";
};
updateParkStatus();
setInterval(updateParkStatus, 60000);

const cursor = document.querySelector(".cursor-orbit");
window.addEventListener("pointermove", (event) => {
  cursor.style.left = `${event.clientX}px`;
  cursor.style.top = `${event.clientY}px`;
});
document.querySelectorAll("a, button, input").forEach((element) => {
  element.addEventListener("pointerenter", () => cursor.classList.add("hot"));
  element.addEventListener("pointerleave", () => cursor.classList.remove("hot"));
});

const parallaxItems = [...document.querySelectorAll("[data-parallax]")];
const waterline = document.querySelector(".waterline span");
let ticking = false;
const onScroll = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const max = document.documentElement.scrollHeight - innerHeight;
    waterline.style.height = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      parallaxItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const offset = (rect.top + rect.height / 2 - innerHeight / 2) * Number(item.dataset.parallax);
        const target = item.tagName === "IMG" ? item : item;
        target.style.transform = `translate3d(0, ${offset}px, 0) scale(1.05)`;
      });
    }
    ticking = false;
  });
};
addEventListener("scroll", onScroll, { passive: true });
onScroll();

const kindWords = [
  "MAKE ROOM",
  "PET THE DOG (ASK FIRST)",
  "SHARE THE SHADE",
  "LISTEN LONGER",
  "BRING WATER",
  "DANCE BADLY",
  "LEAVE NO TRACE",
  "SAY HELLO",
  "REST COUNTS",
];

byId("kind-chaos").addEventListener("click", () => {
  const zone = byId("kindness-zone");
  const button = byId("kind-chaos");
  button.setAttribute("aria-label", "Kind chaos released");
  for (let index = 0; index < 9; index += 1) {
    setTimeout(() => {
      const note = document.createElement("span");
      note.className = "kindness-note";
      note.textContent = kindWords[index % kindWords.length];
      note.style.left = `${8 + Math.random() * 78}%`;
      note.style.top = `${48 + Math.random() * 40}%`;
      note.style.transform = `rotate(${Math.random() * 14 - 7}deg)`;
      zone.append(note);
      setTimeout(() => note.remove(), 4700);
    }, index * 120);
  }
});

let audioContext;
let waterSource;
let waterGain;

const startWater = () => {
  audioContext = audioContext || new AudioContext();
  const seconds = 2;
  const buffer = audioContext.createBuffer(2, audioContext.sampleRate * seconds, audioContext.sampleRate);
  for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
    const data = buffer.getChannelData(channel);
    let last = 0;
    for (let index = 0; index < data.length; index += 1) {
      const white = Math.random() * 2 - 1;
      last = last * 0.93 + white * 0.07;
      data[index] = last * 0.7;
    }
  }
  waterSource = audioContext.createBufferSource();
  waterSource.buffer = buffer;
  waterSource.loop = true;
  const filter = audioContext.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1100;
  filter.Q.value = 0.45;
  waterGain = audioContext.createGain();
  waterGain.gain.value = 0.075;
  waterSource.connect(filter).connect(waterGain).connect(audioContext.destination);
  waterSource.start();
};

const stopWater = () => {
  if (waterSource) waterSource.stop();
  waterSource = null;
};

byId("sound-switch").addEventListener("click", () => {
  const button = byId("sound-switch");
  const turningOn = button.getAttribute("aria-pressed") !== "true";
  button.setAttribute("aria-pressed", String(turningOn));
  button.lastChild.textContent = turningOn ? " Water audio: on" : " Water audio: off";
  document.body.classList.toggle("sound-on", turningOn);
  if (turningOn) startWater();
  else stopWater();
});
