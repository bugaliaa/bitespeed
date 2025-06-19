import { convertToSecondary, findContactsToConvert, findPrimaryContact, shouldCreateNewContact } from "utils/reconcilation";
import { Contact, ContactResponse, CreateContactDTO, IdentifyRequest, LinkPrecedence } from "./contact.model";
import { ContactRepository } from "./contact.repository";


export class ContactService {
    constructor(private contactRepository: ContactRepository) { };

    async identify(request: IdentifyRequest): Promise<ContactResponse> {
        const { email, phoneNumber } = request;

        const existingContacts = await this.contactRepository.findContactsByEmailOrPhone(email, phoneNumber);

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
            const newContact = await this.contactRepository.createContact({
                phoneNumber,
                email,
                linkedId: primaryContact.id,
                linkedPrecedence: LinkPrecedence.SECONDARY
            });

            existingContacts.push(newContact);
        }

        const contactsToConvert = findContactsToConvert(existingContacts, primaryContact);

        for (const contact of contactsToConvert) {
            await convertToSecondary(contact, primaryContact.id, this.contactRepository);

            const linkedContacts = await this.contactRepository.findContactsByLinkedId(contact.id);

            for (const linkedContact of linkedContacts) {
                await this.contactRepository.updateContact(linkedContact.id, {
                    linkedId: primaryContact.id,
                    linkedPrecedence: LinkPrecedence.SECONDARY
                });
            }
        }

        return this.formatResponse(primaryContact.id);
    }

    private async formatResponse(primaryContactId: number): Promise<ContactResponse> {

        const primaryContact = await this.contactRepository.findContactById(primaryContactId);
        if (!primaryContact) {
            throw new Error("Primary contact not found");
        }

        const secondaryContacts = await this.contactRepository.findContactsByLinkedId(primaryContactId);

        const allContacts = [primaryContact, ...secondaryContacts];
        const emails = Array.from(new Set(allContacts.map(c => c.email).filter(Boolean) as string[]));
        const phoneNumbers = Array.from(new Set(allContacts.map(c => c.phoneNumber).filter(Boolean) as string[]));

        return {
            primaryContactId: primaryContact.id,
            emails,
            phoneNumbers,
            secondaryContactIds: secondaryContacts.map(c => c.id),
        };
    }
}
