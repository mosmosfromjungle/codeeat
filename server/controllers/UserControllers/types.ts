export type Token = string;

export interface IUserInfo {
    userId?: string;
    hashedPassword?: string;
    username?: string;
    userProfile?: IUserProfile;
    refreshToken?: Token | null;
    createdAt?: Date | null;
}

export interface IUserProfile {
    [key: string]: any;
    character?: string;
    userLevel?: string;
    contactEmail?: string;
    profileMessage?: string;
}

//   lastUpdated?: Date | null;