# TanStack

1. I learned how to use useQuery. It gives a abstraction about managing loading state, error handling etc.
2. Optimistic updates, assumes the fetch will be successful and shows the UI before knowing final result. If fails it rollbacks to previous UI.
3. Pagination is fetching one by one page cause there can be millions of data. Once we fetch something, that remains in cache memory.
4. InfiniteQuery is like when u hit the bottom while scrolling, new datas are loaded.
5. With useQuery, we can handle caching, gcTime (garbage), staleTime (freshness), invalidate a query to refetch when we want etc.
6. Mutation for updating, modifying data etc.

yeah, it's that simple!
