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
