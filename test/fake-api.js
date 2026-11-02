// A small fake of https://jsonplaceholder.typicode.com, so the tests run without internet
// and always get the same answers. Some counts differ from the real site on purpose
// (so a hard-coded answer will not pass).

const users = [
  { id: 1, name: "Leanne Graham", username: "Bret", email: "Sincere@april.biz" },
  { id: 2, name: "Ervin Howell", username: "Antonette", email: "Shanna@melissa.tv" },
  { id: 3, name: "Clementine Bauch", username: "Samantha", email: "Nathan@yesenia.net" },
  { id: 5, name: "Chelsey Dietrich", username: "Kamren", email: "Lucio_Hettinger@annie.ca" },
  { id: 7, name: "Kurtis Weissnat", username: "Elwyn.Skiles", email: "Telly.Hoeger@billy.biz" },
];

const posts = [
  { userId: 1, id: 1, title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit" },
  { userId: 1, id: 2, title: "qui est esse" },
  { userId: 2, id: 11, title: "et ea vero quia laudantium autem" },
  { userId: 2, id: 12, title: "in quibusdam tempore odit est dolorem" },
  { userId: 3, id: 21, title: "asperiores ea ipsam voluptatibus modi minima quia sint" },
  { userId: 3, id: 22, title: "dolor sint quo a velit explicabo quia nam" },
  { userId: 7, id: 61, title: "voluptatem doloribus consectetur est ut ducimus" },
].map((post) => ({ ...post, body: `body of post ${post.id}` }));

const todoTitles = {
  1: "delectus aut autem",
  2: "quis ut nam facilis et officia qui",
  21: "suscipit repellat esse quibusdam voluptatem incidunt",
  41: "aliquid amet impedit consequatur aspernatur placeat eaque fugiat suscipit",
};
const todoCounts = { 1: 20, 2: 20, 3: 20, 5: 12 };
const todos = [];
for (const [userId, count] of Object.entries(todoCounts)) {
  for (let i = 0; i < count; i++) {
    const id = todos.length + 1;
    todos.push({ userId: Number(userId), id, title: todoTitles[id] || `todo number ${id}`, completed: id % 3 === 0 });
  }
}

const commentCounts = { 1: 5, 2: 5, 11: 3, 21: 7 };
const comments = [];
for (const [postId, count] of Object.entries(commentCounts)) {
  for (let i = 0; i < count; i++) {
    const id = comments.length + 1;
    comments.push({ postId: Number(postId), id, name: `comment ${id}`, email: `reader${id}@mail.com`, body: "nice post" });
  }
}

const byId = (list, id) => list.find((item) => item.id === Number(id));
const where = (list, key, value) => list.filter((item) => item[key] === Number(value));

// Returns the JSON data for a URL, or undefined when the real site would answer 404.
function route(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return undefined;
  }
  const parts = parsed.pathname.split("/").filter(Boolean);
  const query = parsed.searchParams;
  const [resource, id, nested] = parts;
  const lists = { users, posts, todos, comments };
  const list = lists[resource];
  if (!list || parts.length > 3) return undefined;

  if (id === undefined) {
    // /posts?userId=3, /todos?userId=3, /comments?postId=1
    let result = list;
    for (const [key, value] of query) result = where(result, key, value);
    return result;
  }
  const item = byId(list, id);
  if (!item) return undefined;
  if (nested === undefined) return item;
  // /users/3/posts, /users/3/todos, /posts/1/comments
  if (resource === "users" && (nested === "posts" || nested === "todos")) return where(lists[nested], "userId", id);
  if (resource === "posts" && nested === "comments") return where(comments, "postId", id);
  return undefined;
}

// A real fetch Response, formatted like jsonplaceholder (2-space pretty JSON, {} with status 404 when not found).
function fakeResponse(url) {
  const data = route(url);
  const status = data === undefined ? 404 : 200;
  return new Response(JSON.stringify(data === undefined ? {} : data, null, 2), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

module.exports = { fakeResponse, route, users, posts, todos, comments };
