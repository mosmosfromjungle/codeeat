export interface IFriends {
    requester?: IFriendObj;
    recipient?: IFriendObj;
    createdAt?: Date;   // pending/accept 등 상태변화가 일어나는 마지막을 기록할 것
}

export interface IFriendRequest {
    requester?: IFriendObj;
    recipient?: IFriendObj;
    createdAt?: Date;
}

export interface IFriendObj {
    username: string;
    userObj: string | number;
}