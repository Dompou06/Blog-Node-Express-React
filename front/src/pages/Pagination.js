import React from 'react'

// eslint-disable-next-line react/prop-types
function Pagination({ postsPerPage, total, currentPage, paginate }) { 
const pagesNumbers = []
   for(let i = 1; i <= Math.ceil(total / postsPerPage); i++) {
    pagesNumbers.push(i)
   }
const lastPage = pagesNumbers[pagesNumbers.length - 1]

  return (
    <div>  
    {pagesNumbers.length > postsPerPage && <ul className='posts pagination justify-content-center fw-bold'> 
    <li className='page-item'>
      <span onClick={() => paginate(currentPage-1)} className={currentPage === 1 ? 'page-link disabled' : 'page-link'}> &lt; </span>
    </li>
    {pagesNumbers.map(number => {  
        return <li key={number} className='page-item'>
            <span onClick={() => paginate(number)} className={currentPage === number ? 'page-link active' : 'page-link'}>
                {number}
            </span>
            </li>    
    })}
    <li className="page-item">
      <span onClick={() => paginate(currentPage+1)} className={currentPage === lastPage ? 'page-link disabled' : 'page-link'}> &gt; </span>
    </li>
   
    </ul>
    }
    </div>
  )
}

export default Pagination
