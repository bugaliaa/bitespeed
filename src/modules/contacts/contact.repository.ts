import { db } from "../../config/db";
import { Contact, CreateContactDTO, LinkPrecedence, RawContact } from "./contact.model";

export class ContactRepository {
    async findContactsByEmailOrPhone(
        email?: string | null,
        phoneNumber?: string | null
    ): Promise<RawContact[]> {

        let query = "SELECT * FROM contacts WHERE deleted_at IS NULL AND (";
        const values: (string | undefined)[] = [];
        const conditions: string[] = [];

        if (!email && !phoneNumber) {
            throw new Error("At least one of email or phoneNumber must be provided");
        }

        if (email) {
            conditions.push("email = $1");
            values.push(email);
        }

        if (phoneNumber) {
            conditions.push("phone_number = $" + (values.length + 1));
            values.push(phoneNumber);
        }

        query += conditions.join(" OR ") + ")";

        console.log("Executing query:", query, "with values:", values);

        const { rows } = await db.query<RawContact>(query, values);

        return rows;
    }

    async createContact(contactData: CreateContactDTO): Promise<RawContact> {
        const { phoneNumber, email, linkedId, linkedPrecedence } = contactData;

        const query = `
            INSERT INTO contacts (phone_number, email, linked_id, linked_precedence)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;

        const values = [phoneNumber, email, linkedId, linkedPrecedence];

        const { rows } = await db.query<RawContact>(query, values);

        return rows[0];
    }

    async updateContact(id: number, contactData: Partial<RawContact>): Promise<RawContact> {
        const fields = Object.keys(contactData).filter(key => key !== "id" && key !== "createdAt" && key !== "updatedAt");

        const setClause = fields.map((field, index) => {
            const dbField = field.replace(/([A-Z])/g, "_$1").toLowerCase();
            return `${dbField} = $${index + 1}`;
        }).join(", ");

        const values = Object.values(contactData);
        values.push(id);

        const query = `
            UPDATE contacts SET ${setClause}, updated_at = NOW() WHERE id = $${values.length}
            RETURNING *
        `;

        console.log("Executing update query:", query, "with values:", values);

        const { rows } = await db.query<RawContact>(query, values);

        return rows[0];
    }

    async findContactById(id: number): Promise<RawContact | null> {
        const query = "SELECT * FROM contacts WHERE id = $1 AND deleted_at IS NULL";
        const { rows } = await db.query<RawContact>(query, [id]);

        return rows.length > 0 ? rows[0] : null;
    }

    async findContactsByLinkedId(linkedId: number): Promise<RawContact[]> {
        const query = `
            SELECT * FROM contacts
            WHERE linked_id = $1 AND deleted_at IS NULL
        `;
        const { rows } = await db.query<RawContact>(query, [linkedId]);

        return rows;
    }

    async mapRawToContactList(raw: RawContact[]): Promise<Contact[]> {
        return raw.map(contact => ({
            id: contact.id,
            phoneNumber: contact.phone_number || null,
            email: contact.email || null,
            linkedId: contact.linked_id || null,
            linkedPrecedence: contact.linked_precedence ? (contact.linked_precedence as LinkPrecedence) : null,
            createdAt: new Date(contact.created_at),
            updatedAt: new Date(contact.updated_at),
            deletedAt: contact.deleted_at ? new Date(contact.deleted_at) : null
        }));
    }

    async mapRawToContact(raw: RawContact): Promise<Contact> {
        return {
            id: raw.id,
            phoneNumber: raw.phone_number || null,
            email: raw.email || null,
            linkedId: raw.linked_id || null,
            linkedPrecedence: raw.linked_precedence ? (raw.linked_precedence as LinkPrecedence) : null,
            createdAt: new Date(raw.created_at),
            updatedAt: new Date(raw.updated_at),
            deletedAt: raw.deleted_at ? new Date(raw.deleted_at) : null
        };
    }
}
