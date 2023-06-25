import { Request, Response } from 'express'
import MoleGame from '../../models/MoleGame'

// Default problems
const DefaultProblems = [
    {
        question: '네모칸에 알맞은 기호를 넣어줘!',
        description: '4 + 19 □ 27',
        answer1: '<',
        answer2: '>',
        answer3: '='
    },
    {
        question: '신호등 색이 아닌 것을 골라줘!',
        description: '힌트: 🚥',
        answer1: '보라',
        answer2: '빨강',
        answer3: '노랑'
    },
    {
        question: '기차가 목적지로 이동할 수 있도록 기찻길을 완성해줘!',
        description: '🚩 □ 🚈',
        answer1: '⬅',
        answer2: '➡',
        answer3: '⬆'
    },
    {
        question: '단어가 완성될 수 있도록 네모칸에 알맞은 알파벳을 넣어줘!',
        description: 'A P □ L E',
        answer1: 'P',
        answer2: 'L',
        answer3: 'A'
    },
    {
        question: '소녀가 학교에 도착할 수 있도록 방향을 선택해줘!',
        description: '🗻 □ 👧 □ 🏫',
        answer1: '➡',
        answer2: '⬅',
        answer3: '⬇'
    },
    {
        question: '규칙에 맞게 네모칸에 알맞은 숫자를 넣어줘!',
        description: '2 4 8 □ 32',
        answer1: '16',
        answer2: '10',
        answer3: '26'
    },
    {
        question: '네모칸에 들어갈 알맞은 색을 골라줘!',
        description: '🔴 + 🟢 = □',
        answer1: '🟡',
        answer2: '🔵',
        answer3: '🟣'
    },
    {
        question: '규칙에 맞게 네모칸에 알맞은 색의 공을 골라줘!',
        description: '🔴 ⬛ □ ⬛ 🔴 ⬛',
        answer1: '🔴',
        answer2: '⬛',
        answer3: '🟥'
    },
    {
        question: '소년이 학교에 도착할 수 있도록 올바른 방향을 선택해줘!',
        description: '🗻 □ 🧑 □ ⛲ □ 🏫',
        answer1: '➡➡',
        answer2: '⬇⬅',
        answer3: '➡'
    },
    {
        question: '규칙에 맞게 네모칸에 들어갈 알맞은 기호를 골라줘!',
        description: '▙ □ ▜ ▟',
        answer1: '▛',
        answer2: '▞',
        answer3: '▜'
    }
];

// Insert default problems at first
export async function defaultProblems() {
    MoleGame.insertMany(DefaultProblems)
    .then(() => {
        console.log('Data inserted successfully');
    })
    .catch((error) => {
        console.log('Error inserting data:', error);
    });
}

// Get 10 mole game problems
export const moleProblems = async (req: Request, res: Response) => {
    const problems = await MoleGame.find({}, null, {limit: 10});
    
    if (problems) {
        return res.status(200).json({
            problems
        })
    }

    return res.status(404).json({
        status: 404,
        message: 'Failed to get mole game problems'
    })
}