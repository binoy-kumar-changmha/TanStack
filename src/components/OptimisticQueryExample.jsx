import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

async function fetchPosts() {
    const res = await fetch(
        "https://jsonplaceholder.typicode.com/posts?_limit=5",
    );
    return res.json();
}

async function updatePostTitle({ id, title }) {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ title }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    });

    if (!res.ok) {
        throw new Error("Failed to update post");
    }

    return res.json();
}

// In Optimistic updates, we assume that the fetch will be successful. 
// So, we show the UI before we know if it will be successful or not.
// Then if succeed, all ok & refetches tha lastest UI. otherwise, rollback to previous UI
function OptimisticUpdatesExample() {
    const queryClient = useQueryClient();

    const {
        data: posts,
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: ["posts"],
        queryFn: fetchPosts,
    });

    const { mutate, isPending, isError, error } = useMutation({
        mutationFn: updatePostTitle,

        onMutate: async (updatedPost) => {
            await queryClient.cancelQueries({ queryKey: ["posts"] });

            const previousPosts = queryClient.getQueryData(["posts"]);

            queryClient.setQueryData(["posts"], (oldPosts) => {
                return oldPosts.map((post) =>
                    post.id === updatedPost.id
                        ? { ...post, title: updatedPost.title }
                        : post,
                );
            });

            return { previousPosts };
        },

        // onError and onSettled has access to the context from onMutate function
        onError: (err, updatedPost, context) => {
            queryClient.setQueryData(["posts"], context.previousPosts);
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });

    function handleUpdatePost(post) {
        mutate({
            id: post.id,
            title: post.title + " (Updated Optimistically)",
        });
    }

    return (
        <div className="section">
            <h2>Optimistic Updates</h2>
            <p>This example updates the UI immediately before the server responds.</p>

            {isLoading && <p>Loading...</p>}
            {isFetching && <p>Background fetching...</p>}
            {isPending && <p>Updating post...</p>}
            {isError && <p>Something went wrong: {error.message}</p>}

            {posts &&
                posts.map((post) => (
                    <div key={post.id} className="card">
                        <h4>{post.title}</h4>
                        <button onClick={() => handleUpdatePost(post)}>Update Title</button>
                    </div>
                ))}
        </div>
    );
}

export default OptimisticUpdatesExample;
