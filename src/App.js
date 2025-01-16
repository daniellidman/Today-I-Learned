import './style.css';
import { CATEGORIES, initialFacts } from './data';
import { useState } from 'react';

function App() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />

      {showForm && <NewFactForm />}
      <main className="main">
        <CategoryFilter />
        <FactList />
      </main>
    </>
  );
}

function Header({ showForm, setShowForm }) {
  const appTitle = 'Today I Learned';

  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" alt={appTitle} />
        <h1>{appTitle}</h1>
      </div>
      <button
        className="fact-form-button btn btn-large btn-open"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Close' : 'Share a fact'}
      </button>
    </header>
  );
}

function NewFactForm() {
  const [text, setText] = useState('');
  const [source, setSource] = useState('');
  const [category, setCategory] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a fact with the world"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <span>{200 - text.length}</span>
      <input
        type="text"
        placeholder="Trustworthy source"
        value={source}
        onChange={(e) => setSource(e.target.value)}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Choose category:</option>
        {CATEGORIES.map((cat) => (
          <option value={cat.name} key={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button class="btn btn-large">Post</button>
    </form>
  );
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
