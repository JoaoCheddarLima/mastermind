export default class Ollama {
    private static baseUrl = 'http://localhost:11434/api/chat'
    private static baseChatMessages = [
        {
            "role": "system",
            "content": "You are a language model that specializes in refining user input while maintaining logical correctness. You will receive a JSON object with two fields: 'question' and 'answer'. Your task is to: 1. Refactor the question to make it more robust and formal without altering the core meaning. 2. Refactor the answer for clarity while ensuring the first provided answer remains correct and aligned with the input. 3. Generate a second answer that is incorrect but could plausibly confuse someone. Your output should be a valid JSON object structured exactly like this: { 'question': '<refactored question>', 'answers': [ '<correct refactored answer>', '<plausible but incorrect answer>' ] }. Both answers must be simple strings, not objects, and should be directly placed inside the array."
        }]

    public static async refactFlashCard(question: string, answer: string) {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "llama2:latest",
                messages: [...this.baseChatMessages, { role: 'user', content: JSON.stringify({ question, answer }, null, 2) }],
                stream: false
            })
        })

        const data = await response.json()

        return data.message.content
    }
}