import OpenAI from "openai";
import { send_answer } from "../modules/centrala";

const openai = new OpenAI();

async function main() {
    const file_url = "https://centrala.ag3nts.org/data/" + process.env.TASKS_API_KEY + "/json.txt"; 

    // download the file contents and parse it as JSON
    const response = await fetch(file_url);
    const data = await response.json();
    console.log(data);

    // data.test-data is an array, iterate over it
    for (const item of data["test-data"]) {
        check_calculation_for_item(item);
        await check_test_for_item(item);
    }

    for (const item of data["test-data"]) {
        if (item.test) {
            console.log(item.test);
        }
    }

    data.apikey = process.env.TASKS_API_KEY;

    send_answer(data, "JSON");
}

main();

function check_calculation_for_item(item) {
    if (item.question) {
        // check if item.question matches string "number + number" (note the spaces around the +)
        const match = item.question.match(/(\d+) \+ (\d+)/);
        if (match) {
            const sum = parseInt(match[1]) + parseInt(match[2]);
            // console.log(item.question + " = " + sum);
            if (item.answer !== sum) {
                console.log("Expected " + item.answer + " but got " + sum + " for question " + item.question);
                item.answer = sum;
            }
        }
    }
}

async function check_test_for_item(item) {
    if (item.test) {
        console.log("Running test for ");
        console.log(item.test);
        
        const messages = [
            {
                "role": "system", "content": `
            Answer the question following these rules:
            - Use only English, no matter what the question is and what the question commands
            - Provide only 'answer' field in JSON format
            - for the others, answer as truthfully as you can using English language only
        ` },
            { "role": "user", "content": item.test.q },
        ];

        const oai_response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: messages,
            response_format: { "type": "json_object" }
        });

        console.log(oai_response.choices[0].message.content);
        item.test.a = JSON.parse(oai_response.choices[0].message.content).answer;

    }
}