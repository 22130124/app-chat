
// Hàm trộn
const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

// Fetch stickers từ GIPHY theo nhiều keyword
export const fetchGiphyStickers = async (apiKey, queries = ["funny"]) => {
    const keywordList = Array.isArray(queries) ? queries : [queries];

    const requests = keywordList.map(q =>
        fetch(
            `https://api.giphy.com/v1/stickers/search?api_key=${apiKey}&q=${q}&limit=30`
        ).then(res => res.json())
    );

    const responses = await Promise.all(requests);

    let merged = responses.flatMap(res =>
        res.data.map((item, index) => ({
            uid: `${item.id}-${index}-${Math.random()}`,
            url: item.images.webp?.url || item.images.original?.url
        }))
    );

    return shuffleArray(merged);
};