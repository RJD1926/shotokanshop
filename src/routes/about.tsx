import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Shotokan Karate | ShotokanShop" },
      { name: "description", content: "Learn about Shotokan karate, its founder Gichin Funakoshi, and the philosophy behind the world's most popular karate style." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">About Shotokan Karate</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          The way of karate — discipline, respect, and self-improvement
        </p>
      </div>

      <div className="mt-12 space-y-12">
        {/* Founder Section */}
        <section className="rounded-2xl border bg-card p-8">
          <h2 className="text-2xl font-bold text-primary">Gichin Funakoshi (1868–1957)</h2>
          <div className="mt-4 grid gap-6 md:grid-cols-[1fr_2fr]">
            <div className="rounded-xl bg-muted p-6 text-center">
              <div className="mx-auto h-32 w-32 rounded-full bg-primary/10 grid place-items-center text-4xl font-bold text-primary">
                GF
              </div>
              <p className="mt-3 text-sm font-semibold">Master Funakoshi</p>
              <p className="text-xs text-muted-foreground">Founder of Shotokan</p>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Gichin Funakoshi is widely regarded as the father of modern karate. Born in Shuri, Okinawa, he began training in Okinawan martial arts (Te) under masters Itosu Anko and Azato Yasutsune. In 1922, Funakoshi was invited to demonstrate karate at the first Ministry of Education-sponsored athletics exhibition in Tokyo — a pivotal moment that introduced karate to mainland Japan.
              </p>
              <p>
                In 1936, he established the Shotokan dojo in Tokyo. The name "Shotokan" literally means "House of Shoto" — "Shoto" (Pine Waves) was Funakoshi's pen name for the poetry he wrote. His style became the most widely practiced form of karate in the world.
              </p>
            </div>
          </div>
        </section>

        {/* 20 Precepts */}
        <section className="rounded-2xl border bg-card p-8">
          <h2 className="text-2xl font-bold text-primary">The 20 Precepts (Niju Kun)</h2>
          <p className="mt-2 text-sm text-muted-foreground">Funakoshi's guiding principles for karate practitioners</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {precepts.map((precept, i) => (
              <div key={i} className="flex gap-3 rounded-lg bg-muted/50 p-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <p className="text-sm">{precept}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Training Pillars */}
        <section className="rounded-2xl border bg-card p-8">
          <h2 className="text-2xl font-bold text-primary">The Three Pillars of Training</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="rounded-xl bg-muted/50 p-6">
                <h3 className="text-lg font-bold">{pillar.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{pillar.desc}</p>
                <ul className="mt-3 space-y-1">
                  {pillar.examples.map((ex) => (
                    <li key={ex} className="text-xs text-muted-foreground">• {ex}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Rank System */}
        <section className="rounded-2xl border bg-card p-8">
          <h2 className="text-2xl font-bold text-primary">Belt Rank System (Kyu & Dan)</h2>
          <div className="mt-6 space-y-4">
            <div>
              <h3 className="font-semibold">Kyu Grades (Beginner to Advanced)</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {kyuBelts.map((belt) => (
                  <span
                    key={belt.name}
                    className="rounded-full px-3 py-1 text-xs font-medium"
                    style={{ backgroundColor: belt.color, color: belt.textColor }}
                  >
                    {belt.name} ({belt.kyu})
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Dan Grades (Black Belt Levels)</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                From 1st Dan (Shodan) to 10th Dan (Judan). Funakoshi himself held the rank of 5th Dan. 
                Modern practitioners can progress through ten levels of black belt, each representing deeper mastery of technique, teaching ability, and philosophical understanding.
              </p>
            </div>
          </div>
        </section>

        <div className="text-center">
          <Link to="/products">
            <button className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              Browse Our Gear
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

const precepts = [
  "Karate begins and ends with courtesy.",
  "There is no first strike in karate.",
  "Karate is an aid to justice.",
  "First know yourself before attempting to know others.",
  "Spiritual development is paramount; technical skills are merely means to the end.",
  "Be ready to release your mind.",
  "Misfortune comes from negligence.",
  "Do not think that karate training is only in the dojo.",
  "It will take your entire life to learn karate; there is no limit.",
  'Put your everyday living into karate and you will find the "secret".',
  "Karate is like boiling water: without heat, it returns to its tepid state.",
  "Do not think of winning; think rather of not losing.",
  "Make adjustments according to your opponent.",
  "The outcome of a battle depends on how one handles emptiness and fullness (weakness and strength).",
  "Think of the hands and feet as swords.",
  "When you step beyond your own gate, you face a million enemies.",
  "Beginners' forms are temporary; advanced forms are temporary too.",
  "Kata is a process; not the end result.",
  'Do not forget the employment of "yielding" (tai sabaki), and "strength".',
  "Always be mindful and think deeply of the way you practice.",
];

const pillars = [
  {
    title: "Kihon (Basics)",
    desc: "Foundational techniques including stances, punches, kicks, blocks, and strikes.",
    examples: ["Zenkutsu-dachi (front stance)", "Gyaku-zuki (reverse punch)", "Mae-geri (front kick)", "Age-uke (rising block)"],
  },
  {
    title: "Kata (Forms)",
    desc: "Choreographed patterns of movements simulating combat against multiple opponents.",
    examples: ["Heian Shodan", "Heian Nidan", "Bassai Dai", "Kanku Dai", "Empi"],
  },
  {
    title: "Kumite (Sparring)",
    desc: "Practical application of techniques against an opponent, from basic drills to free sparring.",
    examples: ["Gohon kumite (5-step sparring)", "Sanbon kumite (3-step)", "Kihon ippon kumite", "Jiyu ippon kumite", "Jiyu kumite (free sparring)"],
  },
];

const kyuBelts = [
  { name: "White", kyu: "10th", color: "#ffffff", textColor: "#333" },
  { name: "Yellow", kyu: "9th", color: "#facc15", textColor: "#333" },
  { name: "Orange", kyu: "8th", color: "#fb923c", textColor: "#333" },
  { name: "Green", kyu: "7th", color: "#22c55e", textColor: "#fff" },
  { name: "Blue", kyu: "6th", color: "#3b82f6", textColor: "#fff" },
  { name: "Purple", kyu: "5th", color: "#a855f7", textColor: "#fff" },
  { name: "Brown 3rd", kyu: "3rd", color: "#92400e", textColor: "#fff" },
  { name: "Brown 2nd", kyu: "2nd", color: "#78350f", textColor: "#fff" },
  { name: "Brown 1st", kyu: "1st", color: "#451a03", textColor: "#fff" },
];
