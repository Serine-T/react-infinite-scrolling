import axios from 'axios';
import { useEffect, useState } from 'react';

const useBookSearch = (query, pageNumber) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(true);
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore ]=  useState(false);

  useEffect(()=>{
    setBooks([])
  }, [query])

  useEffect(()=>{
    setIsLoading(true);
    setError(false);
    let cancel;
    axios({
      method: 'Get',
      url:'https://openlibrary.org/search.json',
      params: {q:query, page:pageNumber},
      cancelToken: new  axios.CancelToken((c)=> cancel = c)
    }).then(res => {
      setBooks((prevBook) =>{
        return  [...new Set([...prevBook, ...res.data.docs.map(book => book.title)])]
      })

      setHasMore(res.data.docs.length > 0)
      setIsLoading(false);
      console.log(res.data)
    }).catch(e =>{
      if(axios.isCancel) return;
      setError(true);
    })

    return ()=> cancel()
  }, [query, pageNumber]);

  return {isLoading, error, books, hasMore};
}

export default useBookSearch;
