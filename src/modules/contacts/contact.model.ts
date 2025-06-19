export enum LinkPrecedence {
    PRIMARY = 'primary',
    SECONDARY = 'secondary'
}

export interface Contact {
    id: number,
    phoneNumber?: string | null,
    email?: string | null
    linkedId?: number | null,
    linkedPrecedence?: LinkPrecedence | null,
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date | null
}

export interface RawContact {
    id: number;
    phone_number: string;
    email: string;
    linked_id?: number | null;
    linked_precedence?: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

export type CreateContactDTO = {
    phoneNumber?: string | null,
    email?: string | null,
    linkedId?: number | null,
    linkedPrecedence?: LinkPrecedence | null
}

export interface IdentifyRequest {
    phoneNumber?: string | null,
    email?: string | null
}

export interface ContactResponse {
    primaryContactId: number;
    emails: string[];
    phoneNumbers: string[];
    secondaryContactIds: number[];
}
