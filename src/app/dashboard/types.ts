export interface Post {
    id: string;
    title: string;
    subTitle?: string;
    content: string;
    status?: string;
    slug?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Subscriber {
    id: string;
    email: string;
    kindeId?: string;
    resendContactId: string;
    createdAt: string;
}

