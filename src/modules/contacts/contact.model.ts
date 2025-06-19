export enum LinkPrecedence {
    PRIMARY = 'primary',
    SECONDARY = 'secondary'
}

export interface Contact {
    id: number,
    phoneNumber?: String | null,
    email?: String | null
    linkedId?: number | null,
    linkedPrecedence?: LinkPrecedence | null,
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date | null
}

export type CreateContactDTO = {
    phoneNumber?: String | null,
    email?: String | null,
    linkedId?: number | null,
    linkedPrecedence?: LinkPrecedence | null
}

export interface IdentifyRequest {
    phoneNumber?: String | null,
    email?: String | null
}

export interface ContactResponse {
    primaryContactId: number;
    emails: string[];
    phoneNumbers: string[];
    secondaryContactIds: number[];
}
