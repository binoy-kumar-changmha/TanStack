import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useState } from "react";

async function fetchPosts(page) {
    const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=5`
    );
    return res.json();
}

async function fetchInfinitePosts({ pageParam = 1 }) {
    const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=5`
    );
    return res.json();
}

export default function PaginationAndInfiniteQueriesExample() {
    return (
        <div className="section">
            <h2>Pagination & Infinite Queries</h2>
            <p>
                Pagination is great when we want users to move page by page, while
                infinite queries are useful for load more buttons and infinite scroll.
            </p>

            <PaginationExample />
            {/* <InfiniteQueryExample /> */}
        </div>
    );
}

// pagination (like reading a book) 
// infinite loading (like scrolling a social media feed).
function PaginationExample() {
    const [page, setPage] = useState(1);

    const {
        data: posts,
        isLoading,
        isFetching,
        isPlaceholderData,
    } = useQuery({
        queryKey: ["posts", page],
        queryFn: () => fetchPosts(page),
        placeholderData: keepPreviousData,
    });

    return (
        <div className="card">
            <h3>Pagination Example</h3>
            <p>
                This uses a normal query, but the page number is part of the query key.
            </p>

            <div style={{ marginBottom: "10px" }}>
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                >
                    Previous Page
                </button>

                <button onClick={() => setPage((prev) => prev + 1)}>Next Page</button>
            </div>

            <p>Current Page: {page}</p>

            {isLoading && <p>Loading...</p>}
            {isFetching && <p>Fetching...</p>}
            {isPlaceholderData && (
                <p>Showing previous page while loading new one...</p>
            )}

            {posts &&
                posts.map((post) => (
                    <div key={post.id} className="card">
                        <h4>{post.title}</h4>
                        <p>{post.body}</p>
                    </div>
                ))}
        </div>
    );
}

function InfiniteQueryExample() {
    const {
        data,
        isLoading,
        isFetching,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["infinite-posts"],
        queryFn: fetchInfinitePosts,
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < 5) return undefined;
            return allPages.length + 1;
        },
    });

    return (
        <div className="card">
            <h3>Infinite Query Example</h3>
            <p>
                This loads one page at a time and appends the new results to the bottom.
            </p>

            {isLoading && <p>Loading...</p>}
            {isFetching && !isFetchingNextPage && <p>Background fetching...</p>}

            {data?.pages.map((page, pageIndex) => (
                <div key={pageIndex}>
                    {page.map((post) => (
                        <div key={post.id} className="card">
                            <h4>{post.title}</h4>
                            <p>{post.body}</p>
                        </div>
                    ))}
                </div>
            ))}

            {/* The missing button code is completed below */}
            <button
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
            >
                {isFetchingNextPage
                    ? "Loading more..."
                    : hasNextPage
                        ? "Load More"
                        : "Nothing more to load"}
            </button>
        </div>
    );
}
