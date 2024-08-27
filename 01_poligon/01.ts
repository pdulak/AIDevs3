import { send_answer } from "../modules/poligon";

async function main() {
    const response = await fetch("https://poligon.aidevs.pl/dane.txt");
    const text = await response.text();
    const lines = text.split("\n");
    // remove empty lines from the array
    const filteredLines = lines.filter(line => line.length > 0);
    
    send_answer(filteredLines, "POLIGON");
}

main();

