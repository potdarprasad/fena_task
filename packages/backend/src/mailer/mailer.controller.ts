import { Body, Controller, Post } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SendMailInput } from './dto';

@Controller('mailer')
export class MailerController {
    constructor(private readonly mailService: MailerService) { }

    @Post('/')
    sendMail(@Body() body: SendMailInput) {
        return this.mailService.sendMail(body);
    }
}
