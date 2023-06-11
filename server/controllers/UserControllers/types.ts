export type Token = string;

export interface IUserInfo {
    userId?: string;
    password?: string;
    passwordCheck?: string;
    username?: string;
    userProfile?: IUserProfile;
    refreshToken?: Token | null;
    createdAt?: Date | null;
}

export interface IUserProfile {
    [key: string]: any;
    profileImgUrl?: string;
    userLevel?: string;
    contactGit?: string;
    contactEmail?: string;
    profileMessage?: string;
}

//   lastUpdated?: Date | null;