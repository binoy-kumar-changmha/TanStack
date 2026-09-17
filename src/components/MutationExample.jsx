import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

async function createPost(newPost) {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        body: JSON.stringify(newPost),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    });

    return res.json();
}

function MutationExample() {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    const { mutate, data: newPost, isPending, error, isError } = useMutation({ mutationFn: createPost })

    return (
        <div className="section">
            <h2>2. Mutations</h2>
            <p>Mutations are used to create, update, or delete data.</p>

            <br />
            <input
                placeholder="Post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <br />
            <br />

            <textarea
                placeholder="Post body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
            />
            <br />
            <br />
            <button onClick={() => mutate({ userId: 1, title, body })} >Create Post</button>

            {isPending && <p>Creating post...</p>}

            {isError && <p>Something went wrong: {error.message}</p>}

            {newPost && (
                <div className="card">
                    <h4>{newPost.title}</h4>
                    <p>{newPost.body}</p>
                </div>
            )}
        </div>
    );
}

export default MutationExample;
