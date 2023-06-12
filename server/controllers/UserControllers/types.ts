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
    userCharacter?: string;
    userLevel?: string;
    contactGit?: string;
    contactEmail?: string;
    profileMessage?: string;
}

//   lastUpdated?: Date | null;