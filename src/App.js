import './style.css';
import { CATEGORIES, initialFacts } from './data';
import { useState, useEffect } from 'react';
import supabase from './supabase';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('all');

  useEffect(
    function () {
      async function getFacts() {
        setIsLoading(true);

        let query = supabase.from('facts').select('*');

        if (currentCategory !== 'all')
          query = query.eq('category', currentCategory);

        const { data: facts, error } = await query
          .order('votesInteresting', { ascending: false })
          .limit(50);
        if (!error) setFacts(facts);
        else alert('There was a problem getting data');
        setIsLoading(false);
      }
      getFacts();
    },
    [currentCategory]
  );

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />

      {showForm && (
        <NewFactForm setShowForm={setShowForm} setFacts={setFacts} />
      )}
      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        {isLoading ? (
          <Loader />
        ) : (
          <FactList facts={facts} setFacts={setFacts} />
        )}
      </main>
    </>
  );
}

function Loader() {
  return <p className="message">Loading...</p>;
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

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}

function NewFactForm({ setFacts, setShowForm }) {
  const [text, setText] = useState('');
  const [source, setSource] = useState('');
  const [category, setCategory] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (text && isValidHttpUrl(source) && category && text.length <= 200) {
      // const newFact = {
      //   id: Math.round(Math.random() * 10000000),
      //   text,
      //   source,
      //   category,
      //   votesInteresting: 0,
      //   votesMindblowing: 0,
      //   votesFalse: 0,
      //   createdIn: new Date().getFullYear(),
      // };
      setIsUploading(true);
      const { data: newFact, error } = await supabase
        .from('facts')
        .insert([{ text, source, category }])
        .select();
      setIsUploading(false);

      if (!error) setFacts((facts) => [newFact[0], ...facts]);

      setText('');
      setSource('http://example.com');
      setCategory('');
      setShowForm(false);
    }
  }

  function updateText(e) {
    setText(e.target.value);
  }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a fact with the world"
        value={text}
        onChange={updateText}
        disabled={isUploading}
      />
      <span>{200 - text.length}</span>
      <input
        type="text"
        placeholder="Trustworthy source"
        value={source}
        onChange={(e) => setSource(e.target.value)}
        disabled={isUploading}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="" disabled={isUploading}>
          Choose category:
        </option>
        {CATEGORIES.map((cat) => (
          <option value={cat.name} key={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large" disabled={isUploading}>
        Post
      </button>
    </form>
  );
}

function CategoryFilter({ setCurrentCategory }) {
  return (
    <>
      <aside>
        <ul>
          <li key="all" className="category">
            <button
              className="btn btn-all-categories"
              onClick={() => setCurrentCategory('all')}
            >
              All
            </button>
          </li>
          {CATEGORIES.map((cat) => (
            <li
              key={cat.name}
              className="category"
              onClick={() => setCurrentCategory(cat.name)}
            >
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

function FactList({ facts, setFacts }) {
  if (facts.length === 0) {
    return (
      <p className="message">
        No facts for this category yet! Create the first one ✌️
      </p>
    );
  }

  return (
    <section>
      <ul className="facts-list">
        {facts.map((fact) => (
          <FactLi key={fact.id} fact={fact} setFacts={setFacts} />
        ))}
      </ul>
    </section>
  );
}

function FactLi({ fact, setFacts }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isDisputed =
    fact.votesInteresting + fact.votesMindblowing < fact.votesFalse;

  async function handleVote(columnName) {
    setIsUpdating(true);

    const { data: updatedFact, error } = await supabase
      .from('facts')
      .update({ [columnName]: fact[columnName] + 1 })
      .eq('id', fact.id)
      .select();
    setIsUpdating(false);

    if (!error)
      setFacts((facts) =>
        facts.map((f) => (f.id === fact.id ? updatedFact[0] : f))
      );
  }

  return (
    <li className="fact">
      <p>
        {isDisputed && <span className="disputed">[⛔️ DISPUTED ⛔️]</span>}
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
        <button
          onClick={() => handleVote('votesInteresting')}
          disabled={isUpdating}
        >
          👍 {fact.votesInteresting}
        </button>
        <button
          onClick={() => handleVote('votesMindblowing')}
          disabled={isUpdating}
        >
          🤯 {fact.votesMindblowing}
        </button>
        <button onClick={() => handleVote('votesFalse')} disabled={isUpdating}>
          ⛔️ {fact.votesFalse}
        </button>
      </div>
    </li>
  );
}

export default App;
