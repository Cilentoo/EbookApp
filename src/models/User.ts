export enum UserRole{
    AUTHOR = 'AUTHOR',
    READER = 'READER',
}

export interface User{
    id: string;
    username: string;
    role : UserRole;
    displaysName: string;
    avartar?: string;
}

export const PREDEFINED_USERS: User[] = [
    {
        id:'author_user',
        username: 'dudu',
        role: UserRole.AUTHOR,
        displaysName: 'Dudu',
    },
    {
        id:'reader_user',
        username: 'duda',
        role: UserRole.READER,
        displaysName: 'Tchutchuca',
    }
]