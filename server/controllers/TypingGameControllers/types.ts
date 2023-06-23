interface TypingGameUserData {
    nickname: string;
    totalgame : number;
    typinggame : number;
    character : string;
}
/* 사용 방법
io.on("connection", (socket) => {
    socket.data.nickname = "leader";
    socket.data.totalgame = 400;
    socket.data.typinggame : 180;
    character : "june";
});
*/

interface TypingGameGameData {
    // 화면구현위한 전송
}
/* 사용 방법
io.on("connection", (socket) => {
    전송내역들
});
*/

//ClientToServerEvent
interface TypingGameItemEvents {
    // item1: () => void;
}

/* 사용 방법
io.on("connection", (socket) => {
    socket.on("item1", () => {
        ...
    });
});
*/