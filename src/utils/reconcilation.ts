import { Contact, LinkPrecedence } from "@modules/contacts/contact.model";

export function findPrimaryContact(contacts: Contact[]): Contact {
    const primaryContact = contacts.find(contact =>
        contact.linkedPrecedence === LinkPrecedence.PRIMARY
    );

    if (primaryContact) {
        return primaryContact;
    }

    const sortedContacts = [...contacts].sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    );

    return sortedContacts[0];
}

export function shouldCreateNewContact(
    existingContacts: Contact[],
    email?: String | null,
    phoneNumber?: String | null
): boolean {

    if (!email && !phoneNumber) {
        return false;
    }

    const hasEmailMatch = email && existingContacts.some(contact => contact.email === email);
    const hasPhoneMatch = phoneNumber && existingContacts.some(contact => contact.phoneNumber === phoneNumber);

    return !hasEmailMatch && !hasPhoneMatch;
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

export async function convertToSecondary(
    contact: Contact,
    primaryId: number,
    repository: any
): Promise<void> {
    await repository.updateContact(contact.id, {
        linkedId: primaryId,
        linkPrecedence: LinkPrecedence.SECONDARY
    });
}
