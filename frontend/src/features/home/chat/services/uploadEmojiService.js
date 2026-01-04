



export const unicodeToTwemojiUrl =(emojiChar)=>{
    if(!emojiChar) return ;
    const codePoints = Array.from(emojiChar)
        .map((c)=>c.codePointAt(0).toString(16)).join("-");

    return `https://twemoji.maxcdn.com/v/latest/72x72/${codePoints}.png`;
};


