import { Contact, LinkPrecedence } from "@modules/contacts/contact.model";
import { ContactRepository } from "@modules/contacts/contact.repository";

export function findPrimaryContact(contacts: Contact[]): Contact {
    const primary = contacts.find(c => c.linkedPrecedence === LinkPrecedence.PRIMARY);
    if (primary) return primary;

    return contacts.reduce((oldest, current) =>
        current.createdAt < oldest.createdAt ? current : oldest
    );
}

export function shouldCreateNewContact(contacts: Contact[], email?: string | null, phoneNumber?: string | null): boolean {
    if (!email && !phoneNumber) return false;

    const normalizedEmail = email ? String(email) : null;
    const normalizedPhoneNumber = phoneNumber ? String(phoneNumber) : null;

    const hasEmail = normalizedEmail && contacts.some(c => String(c.email) === normalizedEmail);
    const hasPhone = normalizedPhoneNumber && contacts.some(c => String(c.phoneNumber) === normalizedPhoneNumber);

    return !(hasEmail && hasPhone);
}

export function findContactsToConvert(
    contacts: Contact[],
    primaryContact: Contact
): Contact[] {
    return contacts.filter(contact =>
        contact.id !== primaryContact.id &&
        contact.linkedPrecedence !== LinkPrecedence.PRIMARY
    );
}

export async function convertToSecondary(contact: Contact, primaryId: number, contactRepository: ContactRepository): Promise<void> {
    await contactRepository.updateContact(contact.id, {
        linked_id: primaryId,
        linked_precedence: LinkPrecedence.SECONDARY
    });
}
