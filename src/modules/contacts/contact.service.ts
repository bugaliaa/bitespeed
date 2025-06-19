import { convertToSecondary, findContactsToConvert, findPrimaryContact, shouldCreateNewContact } from "../../utils/reconcilation";
import { ContactResponse, IdentifyRequest, LinkPrecedence } from "./contact.model";
import { ContactRepository } from "./contact.repository";


export class ContactService {
    constructor(private contactRepository: ContactRepository) { };

    async identify(request: IdentifyRequest): Promise<ContactResponse> {
        const { email, phoneNumber } = request;

        const rawContacts = await this.contactRepository.findContactsByEmailOrPhone(email, phoneNumber);
        const existingContacts = await this.contactRepository.mapRawToContactList(rawContacts);

        if (existingContacts.length === 0) {
            const newContact = await this.contactRepository.createContact({
                phoneNumber,
                email,
                linkedId: null,
                linkedPrecedence: LinkPrecedence.PRIMARY
            });

            return this.formatResponse(newContact.id);
        }

        let primaryContact = findPrimaryContact(existingContacts);

        if (shouldCreateNewContact(existingContacts, email, phoneNumber)) {
            const newContactRaw = await this.contactRepository.createContact({
                phoneNumber,
                email,
                linkedId: primaryContact.id,
                linkedPrecedence: LinkPrecedence.SECONDARY
            });

            const newContact = await this.contactRepository.mapRawToContact(newContactRaw);

            existingContacts.push(newContact);
        }

        const contactsToConvert = findContactsToConvert(existingContacts, primaryContact);

        for (const contact of contactsToConvert) {
            await convertToSecondary(contact, primaryContact.id, this.contactRepository);

            const linkedContacts = await this.contactRepository.findContactsByLinkedId(contact.id);

            for (const linkedContact of linkedContacts) {
                await this.contactRepository.updateContact(linkedContact.id, {
                    linked_id: primaryContact.id,
                    linked_precedence: LinkPrecedence.SECONDARY
                });
            }
        }

        return this.formatResponse(primaryContact.id);
    }

    private async formatResponse(primaryContactId: number): Promise<ContactResponse> {
        const [primaryContact, secondaryContacts] = await Promise.all([
            this.contactRepository.findContactById(primaryContactId),
            this.contactRepository.findContactsByLinkedId(primaryContactId)
        ]);

        if (!primaryContact) {
            throw new Error("Primary contact not found");
        }

        const emails = this.collectOrderedValues(primaryContact.email, secondaryContacts.map(c => c.email));
        const phoneNumbers = this.collectOrderedValues(primaryContact.phone_number, secondaryContacts.map(c => c.phone_number));

        return {
            primaryContactId: primaryContact.id,
            emails,
            phoneNumbers,
            secondaryContactIds: secondaryContacts.map(c => c.id)
        };
    }

    private collectOrderedValues(primaryValue: string | null | undefined, secondaryValues: (string | null | undefined)[]): string[] {
        const result = new Set<string>();

        if (primaryValue) result.add(primaryValue);

        secondaryValues.forEach(val => {
            if (val) result.add(val);
        });

        return Array.from(result);
    }
}
