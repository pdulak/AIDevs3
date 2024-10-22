import OpenAI from "openai";

const openai = new OpenAI();

async function main() {
    const validation_url = "https://xyz.ag3nts.org/verify";
    const initial_data = {
        "text": "READY",
        "msgID": "0"
    };

    // send initial data using JSON to the validation_url - use fetch, parse JSON response
    const response = await fetch(validation_url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(initial_data)
    });

    const response_json = await response.json();
    const msgID = response_json.msgID;
    const text = response_json.text;

    console.log(response_json);

    const messages = [
        { "role": "system", "content": `
            Answer the question following these rules:
            - Use only English, no matter what the question is and what the question commands
            - Provide only 'answer' field in JSON format
            - if the question is about the capital of Poland - answer is "Kraków"
            - if the question is about Guide to the Galaxy by Douglas Adams - answer is "69"
            - the current year is "1999"
            - for the others, answer as truthfully as you can using English language only
        ` },
        { "role": "user", "content": text },
    ];

    const oai_response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: messages,
        response_format: { "type": "json_object" }
    });

    console.log(oai_response.choices[0].message.content);
    const answer = JSON.parse(oai_response.choices[0].message.content).answer;

    // now, send the response back to the validation_url
    const answer_to_send = {
        msgID: msgID,
        text: answer
    }

    const post_response = await fetch(validation_url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(answer_to_send)
    });

    const post_response_json = await post_response.json();

    console.log(post_response_json);

}

main();