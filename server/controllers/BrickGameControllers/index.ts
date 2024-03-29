import { Request, Response } from 'express'
import BrickGame from '../../models/BrickGame'
import BrickGamePoint from '../../models/BrickGamePoint'

const ProblemList = [
    {
        quizId: 1,
        quizType: 'same',
        count: 2,
        place: 'front',
    },
    {
        quizId: 2,
        quizType: 'same',
        count: 2,
        place: 'back',
    },
    {
        quizId: 3,
        quizType: 'same',
        count: 2,
        place: 'middle',
    },
    {
        quizId: 4,
        quizType: 'same',
        count: 2,
        place: 'mix',
    },
    {
        quizId: 5,
        quizType: 'same',
        count: 3,
        place: 'front',
    },
    {
        quizId: 6,
        quizType: 'same',
        count: 3,
        place: 'back',
    },
    {
        quizId: 7,
        quizType: 'same',
        count: 3,
        place: 'middle',
    },
    {
        quizId: 8,
        quizType: 'same',
        count: 3,
        place: 'mix',
    },
    {
        quizId: 9,
        quizType: 'diff',   // always 3
        count: 1,   // diplicate count
        place: 'any',
    },
    {
        quizId: 10,
        quizType: 'diff',
        count: 2,
        place: 'any',
    },
    {
        quizId: 11,
        quizType: 'diff',
        count: 3,
        place: 'any',
    },
    {
        quizId: 12,
        quizType: 'diff',
        count: 11,
        place: 'any',
    },
]

const ExtraPoints = [
    {
        quizId: 1,
        dsType: 'list',
        point: 1,
    },
    {
        quizId: 1,
        dsType: 'deque',
        point: 1,
    },
    {
        quizId: 1,
        dsType: 'stack',
        point: 2,
    },
    {
        quizId: 2,
        dsType: 'deque',
        point: 2,
    },
    {
        quizId: 2,
        dsType: 'list',
        point: 1,
    },
    {
        quizId: 3,
        dsType: 'queue',
        point: 2,
    },
    {
        quizId: 3,
        dsType: 'deque',
        point: 1,
    },
    {
        quizId: 3,
        dsType: 'list',
        point: 1,
    },
    {
        quizId: 4,
        dsType: 'list',
        point: 2,
    },
    {
        quizId: 5,
        dsType: 'list',
        point: 1,
    },
    {
        quizId: 5,
        dsType: 'deque',
        point: 1,
    },
    {
        quizId: 5,
        dsType: 'stack',
        point: 2,
    },
    {
        quizId: 6,
        dsType: 'deque',
        point: 2,
    },
    {
        quizId: 6,
        dsType: 'list',
        point: 1,
    },
    {
        quizId: 7,
        dsType: 'queue',
        point: 2,
    },
    {
        quizId: 7,
        dsType: 'deque',
        point: 1,
    },
    {
        quizId: 7,
        dsType: 'list',
        point: 1,
    },
    {
        quizId: 8,
        dsType: 'list',
        point: 2,
    },
    {
        quizId: 9,
        dsType: 'set',
        point: 2,
    },
    {
        quizId: 10,
        dsType: 'set',
        point: 2,
    },
    {
        quizId: 11,
        dsType: 'set',
        point: 2,
    },
    {
        quizId: 12,
        dsType: 'set',
        point: 2,
    },
]