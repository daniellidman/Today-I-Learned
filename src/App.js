import './style.css';
import { CATEGORIES, initialFacts } from './data';

function App() {
  return (
    <>
      <Header />
      <NewFactForm />
      <main className="main">
        <CategoryFilter />
        <FactList />
      </main>
    </>
  );
}

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" alt="Today I Learned Logo" />
        <h1>Today I Learned</h1>
      </div>
      <button className="fact-form-button btn btn-large btn-open">
        Share a fact
      </button>
    </header>
  );
}

function NewFactForm() {
  return <form className="fact-form">New Fact Form</form>;
}

function CategoryFilter() {
  return (
    <>
      <aside>
        <ul>
          <li key="all" className="category">
            <button className="btn btn-all-categories">All</button>
          </li>
          {CATEGORIES.map((cat) => (
            <li key={cat.name} className="category">
              <button
                className="btn btn-categories"
                style={{ backgroundColor: cat.color }}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}

function FactList() {
  // TEMP - using initial facts
  const facts = initialFacts;

  return (
    <section>
      <ul className="facts-list">
        {facts.map((fact) => (
          <FactLi key={fact.id} fact={fact} />
        ))}
      </ul>
    </section>
  );
}

function FactLi({ fact }) {
  return (
    <li className="fact">
      <p>
        {fact.text}
        <a href={fact.source} target="_blank" className="source">
          (Source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: `${
            CATEGORIES.find((cat) => cat.name === fact.category).color
          }`,
        }}
      >
        {fact.category}
      </span>
      <div className="vote-buttons">
        <button>👍 {fact.votesInteresting}</button>
        <button>🤯 {fact.votesMindblowing}</button>
        <button>⛔️ {fact.votesFalse}</button>
      </div>
    </li>
  );
}

export default App;
