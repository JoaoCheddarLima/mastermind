import { FlashCard, IFlashCard } from "@/model/card";
import Ollama from "./ollama";

export async function aiEmpowerCard(card: IFlashCard) {
    while (true) {
        try {
            const data = await Ollama.refactFlashCard(card.question, card.answer);

            const { question, answers } = JSON.parse(data);

            for (const answer of answers) {
                if (typeof answer !== 'string') throw new Error('Invalid answer');
            }

            await FlashCard.updateOne(
                {
                    id: card.id,
                },
                {
                    $set: {
                        aiEmpowered: true,
                        aiAnswers: answers,
                        aiRefactoredQuestion: question,
                    }
                }
            )

            break;
        } catch (err) {
            console.log("Failed")
        }
    }
}