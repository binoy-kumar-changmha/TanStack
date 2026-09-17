import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

async function fetchPosts() {
    const res = await fetch(
        "https://jsonplaceholder.typicode.com/posts?_limit=5",
    );
    return res.json();
}

function QueryExample() {
    const [loadData, setLoadData] = useState(false)
    const { data: posts, isLoading, error, refetch } = useQuery({ queryKey: ['posts'], queryFn: fetchPosts, enabled: loadData })

    return (
        <div className="section">
            <h2>1. Intro and Setup</h2>
            <p>This is our first query without TanStack Query.</p>

            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}

            <button onClick={() => { setLoadData(true) }}>Load Data</button>
            <br />
            <button onClick={() => refetch()}>Refetch Data</button>

            {posts && posts.map((post) => (
                <div key={post.id} className="card">
                    <h4>{post.title}</h4>
                    <p>{post.body}</p>
                </div>
            ))}
        </div>
    );
}

export default QueryExample;