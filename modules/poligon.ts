const poligon_config = {
    apiKey: process.env.TASKS_API_KEY,
    url: process.env.TASKS_URL,
}

export const send_answer = async (answer: any, task: string) => {
    try {
        const bodyContents = JSON.stringify({
            task: task,
            answer: answer,
            apikey: poligon_config.apiKey
        });
        console.log("send_answer bodyContents: ", bodyContents);
        console.log("send_answer url: ", `${poligon_config.url}verify`);

        const response = await fetch(`${poligon_config.url}verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: bodyContents
        })

        const data = await response.json();
        console.log("send_answer data: ", data)
        return data;
    } catch (error) {
        console.error("Error when sending data:", error);
        return null;
    }
}
