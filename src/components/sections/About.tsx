const EQUATION = ["Cinema", "Storytelling", "Data", "Technology", "Strategy"];

export function About() {
  return (
    <section id="about" className="about">
      <p className="about__note">Curiosity → Experiment → Impact</p>

      <h2 className="about__headline">
        I don’t belong to
        <br />
        <em>only one discipline.</em>
      </h2>

      <div
        className="about__equation"
        aria-label="Cinema plus storytelling plus data plus technology plus strategy"
      >
        {EQUATION.map((word, i) => (
          <span key={word}>
            {i > 0 ? <b aria-hidden="true">+</b> : null}
            {word}
          </span>
        ))}
      </div>

      <div className="about__body about__body--editorial">
        <div className="about__copy">
          <p className="about__lede">
            I am an engineer who kept refusing to pick a side. Cinema taught me how attention works.
            Data taught me how to prove it. Everything I build now sits in that overlap.
          </p>
          <p>
            My work starts with a cultural question — why a film travels, why a language needs its
            own room online, why a city is described in announcements instead of lives — and then
            answers it with a system. Research, product thinking and a real opinion about how the
            thing should feel.
          </p>
          <p>
            Telugu culture, sport, music and the business of attention are the subjects I keep
            returning to. Analytics, product and storytelling are the instruments. The six projects
            here are that combination, argued six different ways.
          </p>

          <dl className="about__facts">
            <div>
              <dt>Based</dt>
              <dd>Visakhapatnam, India</dd>
            </div>
            <div>
              <dt>Works in</dt>
              <dd>Product · Analytics · Creative strategy</dd>
            </div>
            <div>
              <dt>Interested in</dt>
              <dd>Cinema · Audience behaviour · Telugu writing · Cities</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
