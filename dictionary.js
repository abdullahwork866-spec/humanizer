/* Dictionary-based humanizer — runs fully in the browser, no API, no cost. */

// Multi-word phrases first (longest match wins), then single words.
const PHRASES = {
  "it is important to note that": ["note that", "keep in mind that", "worth knowing:"],
  "it is worth noting that": ["note that", "it's worth saying that"],
  "it's worth noting that": ["note that", "worth saying:"],
  "in today's digital age": ["these days", "today"],
  "in today's fast-paced world": ["these days", "today"],
  "in the realm of": ["in", "when it comes to"],
  "when it comes to": ["for", "with"],
  "plays a crucial role": ["matters a lot", "is really important"],
  "plays a vital role": ["matters a lot", "is really important"],
  "plays a pivotal role": ["is a big part", "matters a lot"],
  "a wide range of": ["many", "all kinds of", "plenty of"],
  "a plethora of": ["lots of", "plenty of", "many"],
  "a myriad of": ["many", "lots of"],
  "in order to": ["to"],
  "due to the fact that": ["because", "since"],
  "in the event that": ["if"],
  "with regard to": ["about", "on"],
  "with respect to": ["about", "on"],
  "in conclusion": ["to wrap up", "all in all", "in short"],
  "to sum up": ["in short", "all in all"],
  "on the other hand": ["then again", "but"],
  "as a result": ["so", "because of that"],
  "for instance": ["for example", "say"],
  "at the end of the day": ["in the end", "ultimately"],
  "first and foremost": ["first", "to start"],
  "last but not least": ["finally", "and lastly"],
  "not only": ["not just"],
  "take into consideration": ["consider", "think about"],
  "take advantage of": ["use", "make the most of"],
  "shed light on": ["explain", "clear up"],
  "delve into": ["look into", "dig into", "explore"],
  "dive into": ["look at", "get into"],
  "navigate the complexities": ["deal with the details", "work through it"],
  "unlock the power of": ["make use of", "get more from"],
  "game-changer": ["big shift", "real difference-maker"],
  "stands as a testament": ["shows", "proves"],
  "a testament to": ["proof of", "a sign of"],
  "rich tapestry": ["mix", "blend"],
  "ever-evolving": ["changing", "always changing"],
  "ever-changing": ["changing", "shifting"],
  "cutting-edge": ["modern", "latest", "advanced"],
  "state-of-the-art": ["modern", "latest"],
  "in a nutshell": ["in short", "simply put"],
  "needless to say": ["of course", "obviously"],
  "it goes without saying": ["clearly", "obviously"],
  "a variety of": ["different", "several", "many"],
  "a number of": ["several", "some", "a few"],
  "the fact that": ["that"],
  "in addition to": ["besides", "along with"],
  "as well as": ["and", "along with"],
  "is able to": ["can"],
  "are able to": ["can"],
  "has the ability to": ["can"],
  "in the context of": ["in", "within"],
  "at this point in time": ["now", "at this point"],
  "for the purpose of": ["for", "to"],
  "play a key role": ["matter a lot", "be a big part"],
  "serves as": ["works as", "is"],
  "paves the way": ["opens the door", "makes room"],
  "lays the foundation": ["sets things up", "starts things off"],
  "a deep understanding of": ["a good grasp of", "real knowledge of"],
  "gain valuable insights": ["learn a lot", "pick up useful ideas"],
  "valuable insights": ["useful ideas", "helpful points"],
  "seamless experience": ["smooth experience", "easy experience"],
  "robust solution": ["solid solution", "strong option"],
  "holistic approach": ["complete approach", "all-round approach"]
};

const WORDS = {
  delve: ["dig", "look", "explore"],
  delves: ["digs", "looks", "explores"],
  tapestry: ["mix", "blend", "collection"],
  landscape: ["scene", "field", "world"],
  leverage: ["use", "make use of"],
  leveraging: ["using", "making use of"],
  utilize: ["use"], utilizes: ["uses"], utilized: ["used"], utilizing: ["using"],
  utilization: ["use"],
  moreover: ["also", "plus", "on top of that"],
  furthermore: ["also", "besides", "what's more"],
  additionally: ["also", "plus"],
  consequently: ["so", "as a result"],
  therefore: ["so", "that's why"],
  thus: ["so", "that way"],
  hence: ["so", "which is why"],
  nevertheless: ["still", "even so"],
  nonetheless: ["still", "even so"],
  however: ["but", "still", "though"],
  subsequently: ["later", "then", "after that"],
  commence: ["start", "begin"], commences: ["starts", "begins"],
  commenced: ["started", "began"],
  terminate: ["end", "stop"], terminates: ["ends", "stops"],
  endeavor: ["effort", "try"], endeavors: ["efforts", "attempts"],
  facilitate: ["help", "make easier"], facilitates: ["helps", "makes easier"],
  facilitating: ["helping", "making easier"],
  optimize: ["improve", "tune up"], optimizes: ["improves", "tunes up"],
  optimizing: ["improving", "fine-tuning"], optimization: ["improvement", "fine-tuning"],
  enhance: ["improve", "boost"], enhances: ["improves", "boosts"],
  enhanced: ["improved", "better"], enhancing: ["improving", "boosting"],
  enhancement: ["improvement", "boost"],
  crucial: ["key", "important", "vital"],
  pivotal: ["key", "central", "important"],
  paramount: ["most important", "top priority"],
  essential: ["key", "needed", "important"],
  vital: ["key", "important"],
  comprehensive: ["complete", "thorough", "full"],
  robust: ["strong", "solid", "sturdy"],
  seamless: ["smooth", "easy"],
  seamlessly: ["smoothly", "easily"],
  innovative: ["new", "fresh", "creative"],
  groundbreaking: ["new", "pioneering", "fresh"],
  revolutionary: ["new", "radical", "game-changing"],
  transformative: ["big", "life-changing", "major"],
  unparalleled: ["unmatched", "top-notch"],
  unprecedented: ["never seen before", "new"],
  multifaceted: ["many-sided", "complex"],
  intricate: ["detailed", "complex"],
  nuanced: ["subtle", "detailed"],
  meticulous: ["careful", "thorough"],
  meticulously: ["carefully", "thoroughly"],
  paradigm: ["model", "approach"],
  realm: ["area", "world", "field"],
  realms: ["areas", "fields"],
  embark: ["start", "set out"], embarks: ["starts", "sets out"],
  embarking: ["starting", "setting out"],
  journey: ["path", "process", "road"],
  foster: ["encourage", "build", "support"], fosters: ["encourages", "builds", "supports"],
  fostering: ["encouraging", "building", "supporting"],
  empower: ["help", "give power to"], empowers: ["helps", "gives power to"],
  empowering: ["helping", "giving power to"],
  streamline: ["simplify", "smooth out"], streamlines: ["simplifies", "smooths out"],
  streamlined: ["simplified", "smooth"],
  bolster: ["boost", "strengthen"], bolsters: ["boosts", "strengthens"],
  underscore: ["highlight", "stress"], underscores: ["highlights", "stresses"],
  underscoring: ["highlighting", "stressing"],
  showcase: ["show", "display"], showcases: ["shows", "displays"],
  showcasing: ["showing", "displaying"],
  ensure: ["make sure", "check"], ensures: ["makes sure", "checks"],
  ensuring: ["making sure", "checking"],
  numerous: ["many", "plenty of", "lots of"],
  various: ["different", "several", "many"],
  diverse: ["varied", "different", "mixed"],
  plethora: ["lots", "plenty", "heap"],
  myriad: ["many", "countless"],
  vast: ["huge", "big", "large"],
  significant: ["big", "major", "real"],
  significantly: ["a lot", "greatly", "much"],
  substantial: ["large", "big", "solid"],
  substantially: ["greatly", "a lot"],
  fundamental: ["basic", "core", "key"],
  fundamentally: ["at its core", "basically"],
  ultimately: ["in the end", "finally"],
  essentially: ["basically", "mostly"],
  arguably: ["maybe", "you could say"],
  undoubtedly: ["clearly", "for sure"],
  indeed: ["in fact", "really"],
  notably: ["especially", "in particular"],
  particularly: ["especially", "mostly"],
  specifically: ["in particular", "namely"],
  typically: ["usually", "normally"],
  generally: ["usually", "mostly"],
  approximately: ["about", "around"],
  purchase: ["buy"], purchases: ["buys"], purchased: ["bought"],
  assist: ["help"], assists: ["helps"], assisted: ["helped"], assisting: ["helping"],
  assistance: ["help"],
  obtain: ["get"], obtains: ["gets"], obtained: ["got"], obtaining: ["getting"],
  require: ["need"], requires: ["needs"], required: ["needed"], requiring: ["needing"],
  requirement: ["need"], requirements: ["needs"],
  demonstrate: ["show"], demonstrates: ["shows"], demonstrated: ["showed"],
  demonstrating: ["showing"],
  indicate: ["show", "suggest"], indicates: ["shows", "suggests"],
  indicated: ["showed", "suggested"],
  attempt: ["try"], attempts: ["tries"], attempted: ["tried"], attempting: ["trying"],
  inquire: ["ask"], inquires: ["asks"], inquired: ["asked"],
  prior: ["earlier", "before"],
  regarding: ["about", "on"],
  concerning: ["about", "on"],
  whereas: ["while", "but"],
  whilst: ["while"],
  amongst: ["among"],
  upon: ["on"],
  thereby: ["so", "which"],
  therein: ["in it", "there"],
  henceforth: ["from now on"],
  aforementioned: ["earlier", "mentioned"],
  individuals: ["people"],
  individual: ["person"],
  numerousness: ["number"],
  beneficial: ["helpful", "useful", "good"],
  advantageous: ["helpful", "useful"],
  detrimental: ["harmful", "bad"],
  imperative: ["vital", "necessary"],
  noteworthy: ["worth noting", "notable"],
  remarkable: ["striking", "impressive"],
  exceptional: ["outstanding", "excellent"],
  elevate: ["raise", "lift"], elevates: ["raises", "lifts"],
  elevated: ["raised", "lifted"],
  harness: ["use", "tap into"], harnesses: ["uses", "taps into"],
  harnessing: ["using", "tapping into"],
  cultivate: ["grow", "build"], cultivates: ["grows", "builds"],
  garner: ["gain", "earn"], garners: ["gains", "earns"],
  endeavour: ["effort", "try"],
  spearhead: ["lead"], spearheads: ["leads"], spearheading: ["leading"],
  orchestrate: ["organize", "coordinate"],
  encompass: ["include", "cover"], encompasses: ["includes", "covers"],
  encompassing: ["including", "covering"],
  exemplify: ["show", "illustrate"], exemplifies: ["shows", "illustrates"],
  epitome: ["best example", "perfect example"],
  testament: ["proof", "sign"],
  beacon: ["guide", "signal"],
  cornerstone: ["foundation", "base"],
  linchpin: ["key piece", "anchor"],
  synergy: ["teamwork", "combined effect"],
  ecosystem: ["system", "network"],
  stakeholders: ["people involved", "those involved"],
  holistic: ["complete", "all-round"],
  proactive: ["forward-looking", "ahead of the curve"],
  scalable: ["able to grow", "flexible"],
  actionable: ["practical", "usable"],
  impactful: ["effective", "powerful"],
  bespoke: ["custom", "tailor-made"],
  curated: ["selected", "hand-picked"],
  pertinent: ["relevant"],
  adept: ["skilled", "good"],
  proficient: ["skilled", "good"],
  proficiency: ["skill"],
  amidst: ["among", "in the middle of"],
  whilst: ["while"]
};

const CONTRACTIONS = [
  [/\bdo not\b/gi, "don't"], [/\bdoes not\b/gi, "doesn't"], [/\bdid not\b/gi, "didn't"],
  [/\bis not\b/gi, "isn't"], [/\bare not\b/gi, "aren't"], [/\bwas not\b/gi, "wasn't"],
  [/\bwere not\b/gi, "weren't"], [/\bcannot\b/gi, "can't"], [/\bcan not\b/gi, "can't"],
  [/\bwill not\b/gi, "won't"], [/\bwould not\b/gi, "wouldn't"], [/\bshould not\b/gi, "shouldn't"],
  [/\bcould not\b/gi, "couldn't"], [/\bhave not\b/gi, "haven't"], [/\bhas not\b/gi, "hasn't"],
  [/\bhad not\b/gi, "hadn't"], [/\bit is\b/gi, "it's"], [/\bthat is\b/gi, "that's"],
  [/\bthere is\b/gi, "there's"], [/\bwhat is\b/gi, "what's"], [/\bwe are\b/gi, "we're"],
  [/\bthey are\b/gi, "they're"], [/\byou are\b/gi, "you're"], [/\bI am\b/g, "I'm"],
  [/\bwe have\b/gi, "we've"], [/\bthey have\b/gi, "they've"], [/\byou have\b/gi, "you've"],
  [/\bI have\b/g, "I've"], [/\bwill\b(?= be)/gi, "will"]
];

function matchCase(src, repl) {
  if (src === src.toUpperCase() && src.length > 1) return repl.toUpperCase();
  if (src[0] === src[0].toUpperCase()) return repl.charAt(0).toUpperCase() + repl.slice(1);
  return repl;
}

function pick(arr, seed) {
  return arr[seed % arr.length];
}

function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

const PHRASE_KEYS = Object.keys(PHRASES).sort((a, b) => b.length - a.length);
const PHRASE_RE = new RegExp("(?<![\\w'])(" + PHRASE_KEYS.map(escapeRe).join("|") + ")(?![\\w'])", "gi");
const WORD_RE = new RegExp("\\b(" + Object.keys(WORDS).sort((a, b) => b.length - a.length).join("|") + ")\\b", "gi");

function humanizeWithDictionary(text, opts) {
  opts = opts || {};
  let n = 0;
  let count = 0;
  const bump = () => (n += 7 + Math.floor(Math.random() * 3));

  let out = text.replace(PHRASE_RE, (m) => {
    const opts2 = PHRASES[m.toLowerCase()];
    if (!opts2) return m;
    count++;
    return matchCase(m, pick(opts2, bump()));
  });

  out = out.replace(WORD_RE, (m) => {
    const opts2 = WORDS[m.toLowerCase()];
    if (!opts2) return m;
    count++;
    return matchCase(m, pick(opts2, bump()));
  });

  if (opts.contractions !== false) {
    CONTRACTIONS.forEach(([re, rep]) => {
      out = out.replace(re, (m) => {
        count++;
        return matchCase(m, rep);
      });
    });
  }

  // Tidy: em dashes often flag AI text; soften them.
  out = out.replace(/\s*—\s*/g, ", ").replace(/\s*–\s*/g, ", ");
  // Fix doubled words / spaces created by swaps.
  out = out.replace(/\b(\w+)\s+\1\b/gi, "$1").replace(/[ \t]{2,}/g, " ").replace(/,\s*,/g, ",");
  // Capitalize sentence starts after replacement.
  out = out.replace(/(^|[.!?]\s+)([a-z])/g, (_, a, b) => a + b.toUpperCase());

  return { text: out, changes: count };
}

if (typeof module !== "undefined") module.exports = { humanizeWithDictionary };
