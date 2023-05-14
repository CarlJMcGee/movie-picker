import {useState} from "react"
// TODO: screen-cap cool cat img

export default function CoolCatButton() {
    const [quote, setQuote] = useState<string | undefined>(undefined)
    
    /* TODO:
    const aiCofig = new Configuration({
        apiKey: process.env.OPEN_AI_KEY
    })

    const ai = newOpenAIApi(aiConfig)
    */
    const fetchQuote = async () => {
        /* TODO:
        const res = await ai.createCompletion({
            model: "text-davinci-003",
            prompt: <prompt>,
            tempurature: 0.4,
            max_tokens: 350
        })
        setQuote(res.data.choices[0].text)
        */
    }
    
    return (
        <div className="flex justify-center">
            {quote ? <p className="bg-white px-3 py-2 rounded-md">{quote}</p> : null}
            <button onClick={()=> fetchQuote()}>
                <Image src={coolcatjpg} width={250}/>
            </button>
        </div>
    )
}