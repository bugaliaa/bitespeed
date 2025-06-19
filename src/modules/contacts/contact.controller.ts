import { Request, Response } from "express";
import { ContactService } from "./contact.service";
import { IdentifyRequest } from "./contact.model";
import { ContactRepository } from "./contact.repository";

export class ContactController {
    private contactService: ContactService;

    constructor() {
        this.contactService = new ContactService(new ContactRepository());
    }

    async identify(req: Request, res: Response) {
        const { email, phoneNumber }: IdentifyRequest = req.body;

        if (!email && !phoneNumber) {
            return res.status(400).json({
                status: "error",
                message: "At least one of email or phoneNumber is required"
            });
        }

        try {
            const response = await this.contactService.identify({ email, phoneNumber });

            res.status(200).json({
                contact: {
                    primaryContactId: response.primaryContactId,
                    emails: response.emails,
                    phoneNumbers: response.phoneNumbers,
                    secondaryContactIds: response.secondaryContactIds
                }
            });
        } catch (error) {
            console.error("Error identifying contact:", error);
            res.status(500).json({ error : "Internal server error" });
        }
    }
}
