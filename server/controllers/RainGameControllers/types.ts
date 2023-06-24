interface RainGameUserData {
    nickname: string;
    totalgame: number;
    RainGame: number;
    character: string;
}
/* 사용 방법
io.on("connection", (socket) => {
    socket.data.nickname = "leader";
    socket.data.totalgame = 400;
    socket.data.RainGame : 180;
    character : "june";
});
*/

interface RainGameGameData {
    // 화면구현위한 전송
}
/* 사용 방법
io.on("connection", (socket) => {
    전송내역들
});
*/

//ClientToServerEvent
interface RainGameItemEvents {
    // item1: () => void;
}

/* 사용 방법
io.on("connection", (socket) => {
    socket.on("item1", () => {
        ...
    });
});
*/