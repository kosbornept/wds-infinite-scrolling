import React, { useState, useRef, useCallback } from "react";
import useBookSearch from "./useBookSearch";
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);

  const {
    books,
    hasMore,
    loading,
    error
  } = useBookSearch(query, pageNumber)

  const observer = useRef();
  const lastBookElementRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber(prevPageNumber => prevPageNumber + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])
  
  function handleSearch(e) {
    setQuery(e.target.value);
    setPageNumber(1);
  }

  return (
    <div className="content">
      <h1>Infinite Scrolling Example with IntersectionObserver</h1>
      <p className="description">Try searching a book, for example "The Lord of the Rings", and see how the state changes on scroll to loading, to infinite scrolling results. Results update with each entry into input. Last API element stops API load.</p>
      <input type="text" placeholder="Search Book Here..." value={query} onChange={handleSearch} />
      <hr
        style={{
          background: 'rgb(227, 115, 131)',
          width: '100%',
          color: 'rgb(227, 115, 131)',
          borderColor: 'rgb(227, 115, 131)',
          height: '.75em',
        }}
      />
      {books.map((book, index) => {
        if (books.length === index + 1) {
          return <div className="bookTitle" ref={lastBookElementRef} key={book}>{book}</div>
        }
        return <div className="bookTitle" key={book}>{book}</div>
      })}
      <div className="loading">{loading && 'Loading...'}</div>
      <div className="error">{error && 'Error'}</div>
      <footer><a href="https://icons8.com/icons/set/scroll-down">Favicon</a></footer>
    </div>
  );
}

export default App;
