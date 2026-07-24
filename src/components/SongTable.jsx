import { useState } from "react";

export function SongTable({ songs }) {
  const [sort, setSort] = useState("count");
  const sorted = [...songs].sort((a, b) => sort === "title" ? a.title.localeCompare(b.title) : b.count - a.count);
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th><button onClick={() => setSort("title")}>Song</button></th><th>Song artist</th><th className="number"><button onClick={() => setSort("count")}>Performances</button></th></tr></thead>
        <tbody>{sorted.map((song) => <tr key={`${song.title}-${song.artist}`}><td>{song.title}</td><td>{song.artist}</td><td className="number">{song.count}</td></tr>)}</tbody>
      </table>
    </div>
  );
}
