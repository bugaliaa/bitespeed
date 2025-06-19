import { Contact, CreateContactDTO } from "@modules/contacts/contact.model";
import { db } from "@config/db";

export class ContactRepository {
    async findContactsByEmailOrPhone(
        email?: string | null,
        phoneNumber?: string | null
    ): Promise<Contact[]> {

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
            conditions.push("phone_number = $2" + values.length + 1);
            values.push(phoneNumber);
        }

        query += conditions.join(" OR ") + ")";

        const { rows } = await db.query<Contact>(query, values);

        return rows;
    }

    async createContact(contactData: CreateContactDTO): Promise<Contact> {
        const { phoneNumber, email, linkedId, linkedPrecedence } = contactData;

        const query = `
            INSERT INTO contacts (phone_number, email, linked_id, linked_precedence)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;

        const values = [phoneNumber, email, linkedId, linkedPrecedence];

        const { rows } = await db.query<Contact>(query, values);

        return rows[0];
    }

    async updateContact(id: number, contactData: Partial<Contact>): Promise<Contact> {
        const setClause = Object.keys(contactData)
            .map((key, index) => `${key} = $${index + 1}`)
            .join(", ");

        const values = Object.values(contactData);
        values.push(id);

        const query = `
            UPDATE contacts SET ${setClause}, updated_at = NOW() WHERE id = $${values.length}
            RETURNING *
        `;

        const { rows } = await db.query<Contact>(query, values);

        return rows[0];
    }

    async findContactById(id: number): Promise<Contact | null> {
        const query = "SELECT * FROM contacts WHERE id = $1 AND deleted_at IS NULL";
        const { rows } = await db.query<Contact>(query, [id]);

        return rows.length > 0 ? rows[0] : null;
    }

    async findContactsByLinkedId(linkedId: number): Promise<Contact[]> {
        const query = `
            SELECT * FROM contacts
            WHERE linked_id = $1 AND deleted_at IS NULL
        `;
        const { rows } = await db.query<Contact>(query, [linkedId]);

        return rows;
    }
}
