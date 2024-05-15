function getPageNum(request, itemsPerPageInt, totalElemsInt) {
    const page = request.query.page;
    if (!page) return 1;
  
    const pageNum = parseInt(page, 10);
    if (!pageNum || pageNum < 1) return 1;
  
    const numPages = Math.ceil(totalElemsInt / itemsPerPageInt);
    if (pageNum > numPages) return numPages;
      
    return pageNum;
}

function getPaginationPagesArr(page, itemsPerPageInt, totalElemsInt) {
    const prevPage = page - 1;
    const nextPage = page + 1;
    const numPages = Math.ceil(totalElemsInt / itemsPerPageInt);
      
    const pagesArr = [1]; 
      
    if (prevPage > 1 && prevPage < numPages)
        pagesArr.push(prevPage);
  
    if (page > 1 && page < numPages)
        pagesArr.push(page);
  
    if (nextPage > 1 && nextPage < numPages)
        pagesArr.push(nextPage);
      
    if (numPages > 1)
        pagesArr.push(numPages);
      
    return pagesArr;
}

export default { getPageNum, getPaginationPagesArr };