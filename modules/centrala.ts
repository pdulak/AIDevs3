const centrala_config = {
    apiKey: process.env.TASKS_API_KEY,
    url: process.env.CENTRALA_URL,
}

export const send_answer = async (answer: any, task: string) => {
    try {
        const bodyContents = JSON.stringify({
            task: task,
            answer: answer,
            apikey: centrala_config.apiKey
        });
        console.log("send_answer bodyContents: ", bodyContents);
        console.log("send_answer url: ", `${centrala_config.url}report`);

        const response = await fetch(`${centrala_config.url}report`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: bodyContents
        })

        // check if response is json
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            console.log("send_answer data: ", data)
            return data;
        } else {
            // parse response text
            const data = await response.text();
            console.log("send_answer data: ", data)
            return data;
        }

    } catch (error) {
        console.error("Error when sending data:", error);
        return null;
    }
}
