export interface IFriends {
    requesterId?: string;
    recipientId?: string;
    character?: string;
    createdAt?: Date;   // pending/accept 등 상태변화가 일어나는 마지막을 기록할 것
}

export interface IFriendRequest {
    requesterId?: string;
    recipientId?: string;
    character?: string;
    createdAt?: Date;
}