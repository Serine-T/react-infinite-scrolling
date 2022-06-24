
import { useRef, useState, useCallback } from "react";
import useBookSearch from "./useBookSearch";


function App() {
  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const  {isLoading, error, books, hasMore} = useBookSearch(query, pageNumber);

  const observer = useRef();
  const lastBookElemnetRef = useCallback(node => {
    // console.log(node)
    if(isLoading) return
    if(observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries =>{
      if(entries[0].isIntersecting && hasMore) {
        setPageNumber(prevPageNmber => prevPageNmber + 1);
      }
    })

    if(node) observer.current.observer(node);
  }, [isLoading, hasMore])

  const handleSearch = (e) =>{
    setQuery(e.target.value);
    setPageNumber(1);
  }

  return (
    <>
      <input type="text" value={query} onChange={handleSearch} />
      {books.map((book, index) => {
        if(books.length === index + 1) {
          return <div key={book} ref={lastBookElemnetRef}>{book}</div>
        }
        return <div key={book.id}>{book.title}</div>
      })}
      <div>{isLoading && 'Loading...'}</div>
      <div>{error && 'Error'}</div>
    </>
  );
}

export default App;
