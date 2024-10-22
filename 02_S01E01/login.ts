import OpenAI from "openai";

const openai = new OpenAI();

async function main() {
    const url = "https://xyz.ag3nts.org/";
    const response = await fetch(url);
    const text = await response.text();
    const lines = text.split("\n");
    // find the line in which there is "Question" word
    const questionLine = lines.find(line => line.includes("Question"));
    // take the text from questionLine between <br /> and </p> tags
    const question = questionLine.split("<br />")[1].split("</p>")[0];

    console.log(question);

    const messages = [
        { "role": "system", "content": "Answer the question using only number, provide only 'answer' field in JSON format" },
        { "role": "user", "content": question },
    ];

    const oai_response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        response_format: { "type": "json_object" }
    });

    console.log(oai_response.choices[0].message.content);

    // parse json from oai_response.choices[0].message.content
    const answer_object = JSON.parse(oai_response.choices[0].message.content);

    const answer = answer_object.answer;
    
    const post_response = await await fetch("https://xyz.ag3nts.org/", {
        "headers": {
            // "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
            // "accept-language": "en-US,en;q=0.6",
            // "cache-control": "max-age=0",
            "content-type": "application/x-www-form-urlencoded",
            // "priority": "u=0, i",
            // "sec-ch-ua": "\"Chromium\";v=\"130\", \"Brave\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
            // "sec-ch-ua-mobile": "?0",
            // "sec-ch-ua-platform": "\"Linux\"",
            // "sec-fetch-dest": "document",
            // "sec-fetch-mode": "navigate",
            // "sec-fetch-site": "same-origin",
            // "sec-fetch-user": "?1",
            // "sec-gpc": "1",
            // "upgrade-insecure-requests": "1"
        },
        // "referrer": "https://xyz.ag3nts.org/",
        // "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "username=tester&password=574e112a&answer=" + answer,
        "method": "POST",
        // "mode": "cors",
        // "credentials": "omit"
    });

    const post_response_text = await post_response.text();
    console.log(post_response_text);
    
    // write response to a file using current date and time
    const date = new Date();
    const file_name = "logs/02-" + date.toISOString().replace(/:/g, "-") + "-response.txt";
    await Bun.write(file_name, post_response_text);

}

main();