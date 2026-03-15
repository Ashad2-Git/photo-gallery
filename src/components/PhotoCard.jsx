import { useEffect, useState, useReducer, useCallback, useMemo } from "react";
import SearchBar from "./SearchBar";
import {favReducer} from "../reducer/favreducer.js"
import { FaHeart, FaRegHeart } from "react-icons/fa";
import useFetchPhotos from "../hooks/useFetchPhotos.js"


export default function PhotoCard() {

    const { photos, loading, error } = useFetchPhotos();
    const [search, setSearch] = useState("")
    const [favorites, dispatch] = useReducer(favReducer, [],
            () => {
                const saved = localStorage.getItem("favorites");
                return saved ? JSON.parse(saved) : [];
            }
        )

        useEffect(() => {
            console.log("Favorites changed:", favorites);
            localStorage.setItem("favorites", JSON.stringify(favorites))
        }, [favorites])

    const filteredImages = useMemo(() => {
           return  photos.filter((img) => 
                img.author.toLowerCase().includes(search.toLowerCase())
        )
    }, [photos, search])


    const toggleFavorite = (img) => {
        dispatch({
            type: "TOGGLE_FAV",
            payload: img,
        })
    }

    // const isFav = (id) => {
    //     return favorites.some((img) => img.id === id)
    // }

    const favIds = new Set(favorites.map(f => f.id))

    const isFav = (id) => favIds.has(id)

    const handleSearch = useCallback((e) => {
        setSearch(e.target.value)
    }, [])

    return (
        <>
            <div className="min-h-screen bg-gray-100 py-10 px-6">

            <p className="text-center mb-6 text-gray-700 font-medium">
                Favorites: {favorites.length}
            </p>

                <SearchBar search={search} onSearch={handleSearch} />

                    <div>
                        {/* Loading Spinner */}
                        {loading && (
                            <div className="flex justify-center">
                                <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <p className="text-red-500 font-semibold">{error}</p>
                        )}

                        {/* Image */}
                        {!loading && !error && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {filteredImages.map((img) =>(
                                <div key={img.id} className="g-white rounded-xl shadow-md overflow-hidden relative group hover:shadow-xl transition duration-300">
                                    <button 
                                        onClick={() => toggleFavorite(img)}
                                        className="absolute top-3 right-3 text-2xl bg-white/80 backdrop-blur p-2 rounded-full shadow hover:scale-110 transition">
                                        
                                        {isFav(img.id) ? <FaHeart color="red"/> : <FaRegHeart color="white"/>}
                                    </button>
                                    <img 
                                        className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-105"
                                        src={img.download_url}
                                        alt={img.author}
                                    />
                                    <p className="text-base mt-2 text-center font-medium">{img.author}</p>
                                </div>
                            ))}
                        </div>
                        )}                    
                    </div>
            </div>
        </>
    )
}