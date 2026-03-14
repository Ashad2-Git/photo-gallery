

export default function SearchBar({ search, setSearch }) {
    return (
        <>
            <div>
                <input
                    type="text"
                    placeholder="Search by author..."
                    className="w-full mb-6 p-2 border rounded-lg"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                ></input>
            </div>
        </>
    )
}