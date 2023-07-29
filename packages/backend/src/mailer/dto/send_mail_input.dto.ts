import { IsNotEmpty, IsNumber } from "class-validator";

export class SendMailInput {
    @IsNotEmpty({ message: "Count is required, to send emails" })
    @IsNumber()
    count: number;
}