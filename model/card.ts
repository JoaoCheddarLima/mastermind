import mongoose, { Schema } from 'mongoose';

export interface IFlashCard {
    id: string;
    question: string;
    answer: string;
    userId: string;
    createdAt: number;

    aiEmpowered: boolean;

    aiAnswers: string[];
    aiRefactoredQuestion: string;
}

const item = new Schema({
    id: { type: String, required: true, index: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    userId: { type: String, required: true },
    createdAt: { type: Number, required: true },

    aiEmpowered: { type: Boolean, default: false },

    aiAnswers: { type: Array, default: [] },
    aiRefactoredQuestion: { type: String, default: '' },
});

let modeledFix = mongoose.models.FlashCard

if (!modeledFix) {
    modeledFix = mongoose.model("FlashCard", item)
    modeledFix.createIndexes()
}

const FlashCard = modeledFix;

export { FlashCard };