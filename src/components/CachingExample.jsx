import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

function PostList() {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetch(
        "https://jsonplaceholder.typicode.com/posts?_limit=5"
      );
      return res.json();
    },
    staleTime: 1000 * 5,
    gcTime: 1000 * 10,
    // it should be always higher than staletime
    // refetchOnWindowFocus: true
    // refetchOnReconnect: true
    // refetchOnMount: true??
    // retry: 3??
  });

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {isFetching && <p>Background fetching...</p>}

      {data &&
        <div>
          {data.map((post) => (
            <div key={post.id} className="card">
              <p>{post.title}</p>
            </div>
          ))}
        </div>
      }
    </div>
  );
}

function CachingExample() {
  const [show, setShow] = useState(true);

  const queryClient = useQueryClient();

  function handleInvalidate() {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  }

  return (
    <div className="section">
      <h2>3. Caching</h2>
      <p>
        Toggle this component off and on to show that TanStack Query keeps data
        in cache.
      </p>

      {/* custom refetching by invalidating Query. meaning
      when we use invalidatequery, it will refetch the data and the stale 
      timmer will be reset*/}

      <button onClick={handleInvalidate}>Invalidate Query</button>

      <button onClick={() => setShow(!show)}>
        {show ? "Unmount Component" : "Mount Component"}
      </button>

      {show && <PostList />}
    </div>
  );
}

export default CachingExample;
